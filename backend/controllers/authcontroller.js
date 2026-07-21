
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required (ง •̀_•́)ง' });
    }

    // check si le user existe
    const userCheck = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists  ( •̀ ᴖ •́ )' });
    }

    // hash le mdp
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // insertion bdd
    const newUser = await db.query(
      `INSERT INTO users (username, email, password_hash, firstname, lastname)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, created_at`,
      [username, email, passwordHash, firstname || null, lastname || null]
    );

    return res.status(201).json({
      message: 'User registered successfully ♡⸜(˶˃ ᵕ ˂˶)⸝♡',
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required (ง •̀_•́)ง' });
    }

    // cherche le user par email
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password (≖_≖ )' });
    }

    const user = result.rows[0];

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