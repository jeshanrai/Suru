const express = require('express');
const { getUserById, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUserProfile);

module.exports = router;
