const express = require('express');
const router = express.Router();
const favoriteController  = require('../controllers/favoriteController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, favoriteController.getFavorites);
router.post('/:movie_id', authenticateToken, favoriteController.addFavorite);
router.delete('/:movie_id', authenticateToken, favoriteController.removeFavorite);


// router.get('/', favoriteController.getFavorites)
// router.post('/:movie_id', favoriteController.addFavorite)
// router.delete('/:movie_id', favoriteController.removeFavorite)

module.exports = router;