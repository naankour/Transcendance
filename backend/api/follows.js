express = require('express');
const router = express.Router();
const followController  = require('../controllers/followController');

router.get('/follows', followController.getFollows);
router.post('/follows/:user_id', followController.addFollow);
router.delete('/follows/:user_id', followController.removeFollow);

module.exports = router;