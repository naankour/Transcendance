const express = require('express');
const router = express.Router();
const wathclistController  = require('../controllers/watchlistController');

router.get('/watchlist', watchlistController.getWatchlist);
router.post('/watchlist', watchlistController.addToWatchlist);
router.delete('/watchlist/:id', watchlistController.removeFromWatchlist);

module.exports = router;