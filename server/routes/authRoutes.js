const express = require('express');
const { registerUser, authUser, googleAuth } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth);

module.exports = router;
