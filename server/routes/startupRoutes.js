const express = require('express');
const { createStartup, getStartups, getStartupById } = require('../controllers/startupController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/').get(getStartups).post(protect, createStartup);
router.route('/:id').get(getStartupById);

module.exports = router;
