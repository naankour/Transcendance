
const prisma = require('../prisma/prismaClient.js');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/avatars');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user.id}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// récupère le profil du user connecté
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // récupère toutes les infos du user
    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        email: true,
        avatar_url: true,
        bio: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found (╥﹏╥)' });
    }

    // on renvoie l'objet du user en format json
    return res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// modifie le profil
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstname, lastname, username, email, bio } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required fields (ง •̀_•́)ง' });
    }


    let avatar_url = req.body.avatar_url;
    if (req.file) {
      avatar_url = `/avatars/${req.file.filename}`;
    }

    const updatedUser = await prisma.users.update({
      where: { id: Number(userId) },
      data: {
        firstname,
        lastname,
        username,
        email,
        bio,
        ...(avatar_url && { avatar_url: avatar_url }), // Met à jour seulement si newAvatarUrl est défini
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        email: true,
        avatar_url: true,
        bio: true,
        updated_at: true,
      },
    });

    return res.json({
      message: 'Profile updated successfully ♡⸜(˶˃ ᵕ ˂˶)⸝♡',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found (╥﹏╥)' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// supprime le compte du user connecté
const deleteMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body || {};

    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete your account (ง •̀_•́)ง' });
    }

    // récupère le password_hash dans la bdd
    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found (╥﹏╥)' });
    }

    const currentHashedPassword = user.password_hash;

    if (!currentHashedPassword) {
      return res.status(500).json({ error: 'Password hash missing in database' });
    }

    // vérifie le mdp
    const isMatch = await bcrypt.compare(password, currentHashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password (╥﹏╥)' });
    }

    await prisma.users.delete({
      where: { id: Number(userId) },
    });

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

    const user = await prisma.users.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        avatar_url: true,
        bio: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found (╥﹏╥)' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// recherche et liste les users  
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;

    const users = await prisma.users.findMany({
      where: search
        ? {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {},
      take: 20,
      select: {
        id: true,
        username: true,
        avatar_url: true,
        bio: true,
      },
    });

    return res.json(users);
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

    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found (╥﹏╥)' });
    }

    // vérifie l'ancien mdp
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect current password ( ｡ •̀ ᴖ •́ ｡)💢' });
    }

    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    await prisma.users.update({
      where: { id: Number(userId) },
      data: { password_hash: newPasswordHash },
    });

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
  upload
};