
const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');

router.get('/actors/search/:name', actorController.searchActor);
router.get('/actors/:tmdbId', actorController.getActorById);

module.exports = router;