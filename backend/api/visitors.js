const express = require('express');
const router = express.Router();
const { incrementAndGetVisitors, getVisitorCount } = require('../controllers/visitorController');

router.post('/visitors/increment', incrementAndGetVisitors);
router.get('/visitors/count', getVisitorCount);

module.exports = router;