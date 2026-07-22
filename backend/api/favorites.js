const express = require('express');
const router = express.Router();
const favoriteController  = require('../controllers/favoriteController');

router.get('/favorites', favoriteController.getFavorites);
router.post('/favorites/:movie_id', favoriteController.addFavorite);
router.delete('/favorites/:movie_id', favoriteController.removeFavorite);

module.exports = router;