
const prisma = require('../prisma/prismaClient.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required (ง •̀_•́)ง' });
    }

    // check si le user existe
    const existingUser = await prisma.user.findFirst({
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

    // insertion bdd
    const newUser = await prisma.user.create({
      data: {
        firstname: firstname || null,
        lastname: lastname || null,
        username,
        email,
        password_hash: passwordHash
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
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password (≖_≖ )' });
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

module.exports = {
  register,
  login
};