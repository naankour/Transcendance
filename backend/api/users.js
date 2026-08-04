
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const { updateMyProfile, upload } = require('../controllers/userController');

router.get('/', userController.getUsers);

router.get('/me', authenticateToken, userController.getMyProfile);
router.put('/me', authenticateToken, upload.single('avatar'), updateMyProfile);
router.delete('/me', authenticateToken, userController.deleteMyProfile);

router.get('/:id', userController.getUserById);

module.exports = router;