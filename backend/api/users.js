
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', userController.getUsers);

router.get('/me', authenticateToken, userController.getMyProfile);
router.put('/me', authenticateToken, userController.updateMyProfile);
router.put('/me/password', authenticateToken, userController.changePassword);
router.delete('/me', authenticateToken, userController.deleteMyProfile);

router.get('/:id', userController.getUserById);

module.exports = router;