const express = require('express');
const router = express.Router();
const { getFriendsActivity } = require('../controllers/activityController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/activity/friends', authenticateToken, getFriendsActivity);

module.exports = router;