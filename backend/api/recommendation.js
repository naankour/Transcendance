const express = require('express');
const router = express.Router();
const { getCurrentRecommendation } = require('../controllers/recommendationController');

router.get('/recommendation/current', getCurrentRecommendation);

module.exports = router;