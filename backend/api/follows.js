express = require('express');
const router = express.Router();
const followController  = require('../controllers/followController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/follows', authenticateToken,followController.getFollows);
router.post('/follows', authenticateToken, followController.addFollow);
router.delete('/follows/:id', authenticateToken, followController.removeFollow);

module.exports = router;