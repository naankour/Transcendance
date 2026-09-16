const express = require('express');

const router = express.Router();

const modules = require('../controllers/discoverController.js');

router.get('/', modules.getMovies);

router.get('/genres', modules.getGenre);

// router.get('/year/:date', modules.getMoviesFromYear);

// router.get('/by/:sortType', modules.sortMovies);

// router.get('/:id', modules.getGenre);

module.exports = router;