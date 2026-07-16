const express = require('express');
const router = express.Router();
const favoritesController  = require('../controllers/favoritesController');

router.get('/favorites', favoritesController.getFavorites);
router.post('/favorites', favoritesController.addFavorite);
router.delete('/favorites/:id', favoritesController.removeFavorite);

module.exports = router;