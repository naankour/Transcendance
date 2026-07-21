express = require('express');
const router = express.Router();
const followController  = require('../controllers/followController');

router.get('/follows', followController.getFollows);
router.post('/follows', followController.addFollow);
router.delete('/follows/:id', followController.removeFollow);

module.exports = router;