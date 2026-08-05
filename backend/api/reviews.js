const express = require('express');
const router = express.Router();
const reviewsController  = require('../controllers/reviewController')
const authenticateToken = require('../middleware/authMiddleware');

// router.get('/', authenticateToken, reviewsController.getReviews);
router.get('/', reviewsController.getReviews);
router.get('/me', authenticateToken, reviewsController.getMyReviews);
router.get('/movies/:movieId/reviews', authenticateToken, reviewsController.getReviewsByMovie);
router.post('/', authenticateToken, reviewsController.createReview);
router.put('/:id', authenticateToken,reviewsController.updateReview);
router.delete('/:id', authenticateToken, reviewsController.deleteReview);


// router.get('/', reviewsController.getReviews)
// router.get('/movies/:movieId/reviews', reviewsController.getReviewsByMovie)
// router.post('/', reviewsController.createReview)
// router.put('/:id', reviewsController.updateReview)
// router.delete('/:id', reviewsController.deleteReview)

module.exports = router;

// app.use(logger)

// app.get('/', (req, res) => {
//   console.log('Home Page')
//   res.send('new Home Page')
// })

// app.get('/users', (req, res) => {
//   console.log('Users Page')
//   res.send('Users page');
// });



// function logger(req, res, next){
//   console.log('log')
//   next()
// }

// app.post('api/movies/:id/reviews', async (req, res) => {
//   //recup id du film depuis url
//   //recup rating eet contenu depuis le body
//   //creer review avec prisma
//   //renvoyer la review
// })