
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, conversationController.getOrCreateConversation);
router.get('/', authenticateToken, conversationController.getMyConversations);
router.get('/:conversationId/messages', authenticateToken, conversationController.getMessages);

module.exports = router;