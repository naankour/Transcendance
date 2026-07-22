const express = require('express');
const router = express.Router();
const wathclistController  = require('../controllers/watchlistController');

router.get('/watchlist', watchlistController.getWatchlist);
router.post('/watchlist/:movie_id', watchlistController.addToWatchlist);
router.delete('/watchlist/:movie_id', watchlistController.removeFromWatchlist);

module.exports = router;