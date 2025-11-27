const express = require('express');
const { upload, uploadProfilePicture } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;
