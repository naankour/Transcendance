const express = require('express');
const router = express.Router();
const reviewsController  = require('../controllers/reviewController')
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', reviewsController.getReviews);
router.get('/me', authenticateToken, reviewsController.getMyReviews);
router.get('/movies/:movieId/reviews', authenticateToken, reviewsController.getReviewsByMovie);
router.post('/', authenticateToken, reviewsController.createReview);
router.put('/:id', authenticateToken,reviewsController.updateReview);
router.delete('/:id', authenticateToken, reviewsController.deleteReview);



module.exports = router;
