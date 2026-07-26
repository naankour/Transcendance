const express = require('express');

const router = express.Router();

const modules = require('../controllers/genreController.js');

router.get('/', modules.getGenre);

router.get('/:id', modules.getMoviesFromGenre);

module.exports = router;