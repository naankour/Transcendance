const express = require('express');
const router = express.Router();
const reviewsController  = require('../controllers/reviewsController')
const authenticateToken = require('../middleware/authMiddleware');

router.get('/reviews', authenticateToken, reviewsController.getReviews);
router.get('/movies/:movieId/reviews', authenticateToken, reviewsController.getReviewsByMovie);
router.post('/reviews', authenticateToken, reviewsController.createReview);
router.put('/reviews/:id', authenticateToken,reviewsController.updateReview);
router.delete('/reviews/:id', authenticateToken, reviewsController.deleteReview);

module.exports = router;

app.use(logger)

app.get('/', (req, res) => {
  console.log('Home Page')
  res.send('new Home Page')
})

app.get('/users', (req, res) => {
  console.log('Users Page')
  res.send('Users page');
});



function logger(req, res, next){
  console.log('log')
  next()
}

app.post('api/movies/:id/reviews', async (req, res) => {
  //recup id du film depuis url
  //recup rating eet contenu depuis le body
  //creer review avec prisma
  //renvoyer la review
})