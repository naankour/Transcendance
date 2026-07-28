
const prisma = require('../prisma/prismaClient.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const axios = require('axios');

const register = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required (ง •̀_•́)ง' });
    }

    // check email valide
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address (≖_≖ )' });
    }

    const isStrong = validator.isStrongPassword(password, {
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

    if (!isStrong) {
      return res.status(400).json({
        error: 'Password must be at least 12 characters and include an uppercase letter, lowercase letter, number, and special character! ( •̀ ᴖ •́ )'
      });
    }

    // check si le user existe
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists  ( •̀ ᴖ •́ )' });
    }

    // hash le mdp
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const defaultAvatars = [
      '/avatars/avatar1.jpg',
      '/avatars/avatar2.jpg',
      '/avatars/avatar3.jpg',
      '/avatars/avatar4.jpg',
      '/avatars/avatar5.jpg',
      '/avatars/avatar6.jpg',
      '/avatars/avatar7.jpg',
      '/avatars/avatar8.jpg',
      '/avatars/avatar9.jpg',
      '/avatars/avatar10.jpg',
    ];
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    // insertion bdd
    const newUser = await prisma.users.create({
      data: {
        firstname: firstname || null,
        lastname: lastname || null,
        username,
        email,
        password_hash: passwordHash,
        avatar_url: randomAvatar
      },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true
      }
    });
    return res.status(201).json({
      message: 'User registered successfully ♡⸜(˶˃ ᵕ ˂˶)⸝♡',
      user: newUser
    });
  } catch (error) {
    console.error('Error during registration:', error);
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required (ง •̀_•́)ง' });
    }

    // cherche le user par email
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password (≖_≖ )' });
    }

    if (!user.password_hash) {
      return res.status(401).json({ error: 'This account uses GitHub login. Please sign in with GitHub instead. (≖_≖ )' });
    }

    // vérifie le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password (≖_≖ )' });
    }

    // génére le token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'your_fallback_secret_key',
      { expiresIn: '24h' }
    );

    // réponse json
    return res.json({
      message: 'Login successful ♡⸜(˶˃ ᵕ ˂˶)⸝♡',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// redirige vers github
const githubLogin = (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
  return res.redirect(githubAuthUrl);
};

const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code missing' });
    }

    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(400).json({ error: 'Failed to obtain access token from GitHub' });
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUser = userResponse.data;

    let email = githubUser.email;
    if (!email) {
      const emailResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const primaryEmailObj = emailResponse.data.find((e) => e.primary) || emailResponse.data[0];
      email = primaryEmailObj ? primaryEmailObj.email : null;
    }

    if (!email) {
      return res.status(400).json({ error: 'Could not retrieve email from GitHub' });
    }

    let user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      const randomUsername = githubUser.login || `github_user_${Date.now()}`;
      user = await prisma.users.create({
        data: {
          username: randomUsername,
          email,
          avatar_url: githubUser.avatar_url || null        },
      });
    }

    const jwtToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'your_fallback_secret_key',
      { expiresIn: '24h' }
    );

    return res.redirect(`http://localhost:5173/auth?token=${jwtToken}`);
  } catch (error) {
    console.error('GitHub OAuth Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'GitHub Authentication failed' });
  }
};

const googleLogin = (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: 'http://localhost:5173/api/auth/google/callback',
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options).toString();
  return res.redirect(`${rootUrl}?${qs}`);
};

const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code missing' });
    }

    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'http://localhost:5173/api/auth/google/callback',
      grant_type: 'authorization_code',
    });

    const { access_token, id_token } = tokenResponse.data;

    const userResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: { Authorization: `Bearer ${id_token}` },
      }
    );

    const googleUser = userResponse.data;

    if (!googleUser.email) {
      return res.status(400).json({ error: 'Could not retrieve email from Google' });
    }

    let user = await prisma.users.findUnique({ where: { email: googleUser.email } });

    if (!user) {
      const baseUsername = googleUser.email.split('@')[0];
      const randomUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

      user = await prisma.users.create({
        data: {
          username: randomUsername,
          email: googleUser.email,
          firstname: googleUser.given_name || null,
          lastname: googleUser.family_name || null,
          avatar_url: googleUser.picture || null,
        },
      });
    }

    const jwtToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'your_fallback_secret_key',
      { expiresIn: '24h' }
    );

    return res.redirect(`http://localhost:5173/auth?token=${jwtToken}`);
  } catch (error) {
    console.error('Google OAuth Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Google Authentication failed' });
  }
};

module.exports = {
  register,
  login,
  githubLogin,
  githubCallback,
  googleLogin,
  googleCallback
};