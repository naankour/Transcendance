const express = require('express');
const router = express.Router();
const reviewsController  = require('../controllers/reviewsController')

router.get('/reviews', reviewsController.getReviews);
router.get('/movies/:movie_id/reviews', reviewsController.getReviewsbyMovie);
router.post('/reviews', reviewsController.createReview);
router.put('/reviews/:id', reviewsController.updateReview);
router.delete('/reviews/:id', reviewsController.deleteReview);

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