const express = require('express');
const { registerUser, authUser, googleAuth, facebookAuth } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth);
router.post('/facebook', facebookAuth);

module.exports = router;
