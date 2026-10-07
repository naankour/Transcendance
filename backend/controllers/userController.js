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

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
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
      return res.status(404).json({ error: 'notifications.userNotFound' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'notifications.internalServerError' });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstname, lastname, username, email, bio, currentPassword, newPassword } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: 'notifications.usernameEmailRequired' });
    }


    const currentUser = await prisma.users.findUnique({
      where: { id: Number(userId) },
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'notifications.userNotFound' });
    }

    let password_hash = currentUser.password_hash;

 
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'notifications.currentPasswordRequired' });
      }

      const isMatch = await bcrypt.compare(currentPassword, currentUser.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'notifications.incorrectCurrentPassword' });
      }

      password_hash = await bcrypt.hash(newPassword, 10);
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
        password_hash,
        ...(avatar_url && { avatar_url }),
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
      message: 'notifications.profileUpdated',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'notifications.internalServerError' });
  }
};

const deleteMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body || {};

    if (!password) {
      return res.status(400).json({ error: 'notifications.passwordRequiredToDelete' });
    }

    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: 'notifications.userNotFound' });
    }

    const currentHashedPassword = user.password_hash;

    if (!currentHashedPassword) {
      return res.status(500).json({ error: 'Password hash missing in database' });
    }

    const isMatch = await bcrypt.compare(password, currentHashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'notifications.incorrectPassword' });
    }

    await prisma.users.delete({
      where: { id: Number(userId) },
    });

    return res.json({ message: 'notifications.accountDeleted' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({ error: 'notifications.internalServerError' });
  }
};

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
      return res.status(404).json({ error: 'notifications.userNotFound' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return res.status(500).json({ error: 'notifications.internalServerError' });
  }
};

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
    return res.status(500).json({ error: 'notifications.internalServerError' });
  }
};

const getUserOnlineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const onlineUsers = req.app.get('onlineUsers');

    const isOnline = onlineUsers.has(Number(id));

    return res.json({ isOnline });
  }
  catch (error)
  {
    console.error('Error checking online status:', error);
    return res.status(500).json({ error: 'notifications.internalServerError'});
  }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  getUserById,
  getUsers,
  getUserOnlineStatus,
  upload
};