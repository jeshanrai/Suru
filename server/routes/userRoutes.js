const express = require('express');
const { getUserById, updateUserProfile, completeProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// GET user by ID
router.get('/:id', protect, getUserById);

// PUT update profile
// You can now use the URL with the user ID, but only logged-in user can update their profile
router.put('/:id', protect, updateUserProfile);

// POST complete profile (first-time setup)
router.post('/complete-profile', protect, completeProfile);

module.exports = router;
