const express = require('express');
const router = express.Router();
const { searchMovie, getMovieById } = require('../controllers/movieController');

router.get('/search/:name', searchMovie);
router.get('/:id', getMovieById);

module.exports = router;