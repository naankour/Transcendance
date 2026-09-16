const express = require('express');
const router = express.Router();
const { searchMovie, getMovieById, postReview } = require('../controllers/movieController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/search/:name', searchMovie);
router.post('/:id/review', authenticateToken, postReview);
router.get('/:id', getMovieById);

module.exports = router;