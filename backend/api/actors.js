const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');
const authenticateToken = require('../middleware/authMiddleware');
 
router.get('/actors/search/:name', actorController.searchActor);
router.get('/actors/:id', actorController.getActorById);
 
router.post('/actors/import/:tmdbId', authenticateToken, actorController.importActor);
 
module.exports = router;
 