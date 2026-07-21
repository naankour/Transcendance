

const db = require('../config/db');
const bcrypt = require('bcrypt');

// récupère le profil du user connecté
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // récupère toutes les infos du user
    const result = await db.query(
      `SELECT id, firstname, lastname, username, email, avatar_url, bio, created_at 
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found (╥﹏╥)' });
    }

    // on renvoie l'objet du user en format json
    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// modifie le profil
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstname, lastname, username, email, avatar_url, bio } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required fields (ง •̀_•́)ง' });
    }

    const result = await db.query(
      `UPDATE users 
       SET firstname = $1, 
           lastname = $2, 
           username = $3, 
           email = $4, 
           avatar_url = $5, 
           bio = $6, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $7 
       RETURNING id, firstname, lastname, username, email, avatar_url, bio, updated_at`,
      [firstname, lastname, username, email, avatar_url, bio, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found (╥﹏╥)' });
    }

    return res.json({
      message: 'Profile updated successfully ♡⸜(˶˃ ᵕ ˂˶)⸝♡',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// supprime le compte du user connecté
const deleteMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query('DELETE FROM users WHERE id = $1', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found (╥﹏╥)' });
    }

    return res.json({ message: 'Account deleted successfully ♡⸜(˶˃ ᵕ ˂˶)⸝♡' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// récupère le profil public d'un user via son id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT id, firstname, lastname, username, avatar_url, bio, created_at 
       FROM users 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found (╥﹏╥)' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// recherche et liste les users  
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;

    let query = 'SELECT id, username, avatar_url, bio FROM users';
    let values = [];

    if (search) {
      query += ' WHERE username ILIKE $1'; 
      values.push(`%${search}%`);
    }

    query += ' LIMIT 20';

    const result = await db.query(query, values);
    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required (ง •̀_•́)ง' });
    }

    const userResult = await db.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found (╥﹏╥)' });
    }

    const user = userResult.rows[0];

    // vérifie l'ancien mdp
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect current password ( ｡ •̀ ᴖ •́ ｡)💢' });
    }

    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userId]
    );

    return res.json({ message: 'Password updated successfully ♡⸜(˶˃ ᵕ ˂˶)⸝♡' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  getUserById,
  getUsers,
  changePassword,
};