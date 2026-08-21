const express = require('express');
const router = express.Router();
const watchlistController  = require('../controllers/watchlistController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, watchlistController.getWatchlist);
router.post('/:movie_id', authenticateToken,watchlistController.addToWatchlist);
router.delete('/:movie_id', authenticateToken, watchlistController.removeFromWatchlist);

router.get('/user/:userId', authenticateToken, watchlistController.getWatchlistByUserId);
// router.get('/', watchlistController.getWatchlist)
// router.post('/:movie_id', watchlistController.addToWatchlist)
// router.delete('/:movie_id', watchlistController.removeFromWatchlist)

module.exports = router;