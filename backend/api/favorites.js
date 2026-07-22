const express = require('express');
const router = express.Router();
const favoriteController  = require('../controllers/favoriteController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/favorites', authenticateToken, favoriteController.getFavorites);
router.post('/favorites/:movie_id', authenticateToken, favoriteController.addFavorite);
router.delete('/favorites/:movie_id', authenticateToken, favoriteController.removeFavorite);

module.exports = router;