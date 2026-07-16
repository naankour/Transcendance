const express = require('express');
const router = express.Router();
const favoriteController  = require('../controllers/favoriteController');

router.get('/favorites', favoriteController.getFavorites);
router.post('/favorites', favoriteController.addFavorite);
router.delete('/favorites/:id', favoriteController.removeFavorite);

module.exports = router;