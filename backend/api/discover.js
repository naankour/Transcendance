const express = require('express');

const router = express.Router();

const modules = require('../controllers/discoverController.js');

router.get('/', modules.getMovies);

router.get('/genres', modules.getGenre);

module.exports = router;