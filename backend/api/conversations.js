
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, conversationController.getOrCreateConversation);
router.get('/', authenticateToken, conversationController.getMyConversations);
router.get('/:conversationId/messages', authenticateToken, conversationController.getMessages);
router.post('/:conversationId/messages', authenticateToken, conversationController.sendMessage);

router.get('/unread-count', authenticateToken, conversationController.getUnreadCount);
router.post('/:conversationId/read', authenticateToken, conversationController.markAsRead);

module.exports = router;