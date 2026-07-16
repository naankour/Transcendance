express = require('express');
const router = express.Router();
const followsController  = require('../controllers/followsController');

router.get('/follows', followsController.getFollows);
router.post('/follows', followsController.addFollow);
router.delete('/follows/:id', followsController.removeFollow);

module.exports = router;