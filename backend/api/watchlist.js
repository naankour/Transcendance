const express = require('express');
const router = express.Router();
const wathclistController  = require('../controllers/watchlistController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/watchlist', authenticateToken, watchlistController.getWatchlist);
router.post('/watchlist/:movie_id', authenticateToken,watchlistController.addToWatchlist);
router.delete('/watchlist/:movie_id', authenticateToken, watchlistController.removeFromWatchlist);

module.exports = router;