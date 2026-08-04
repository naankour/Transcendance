express = require('express');
const router = express.Router();
const followController  = require('../controllers/followController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken,followController.getFollows);
router.post('/:user_id', authenticateToken, followController.addFollow);
router.delete('/:user_id', authenticateToken, followController.removeFollow);

// router.get('/', followController.getFollows)
// router.post('/:user_id', followController.addFollow)
// router.delete('/:user_id', followController.removeFollow)

module.exports = router;