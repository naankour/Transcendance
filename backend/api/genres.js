const express = require('express');

const router = express.Router();

const modules = require('../controllers/genreController.js');

router.get('/genres', modules.getGenre);

router.get('/genres/:id', modules.getMoviesFromGenre);
