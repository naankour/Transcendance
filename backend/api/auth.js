// hihi
const express = require('express'); 
const router = express.Router();
const authController = require('../controllers/authcontroller'); 

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/github', authController.githubLogin);
router.get('/github/callback', authController.githubCallback);

router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

module.exports = router;