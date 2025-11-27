const express = require('express');
const { applyToStartup, getStartupApplications, getMyApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protect, applyToStartup);
router.get('/startup/:startupId', protect, getStartupApplications);
router.get('/my', protect, getMyApplications);
router.put('/:id', protect, updateApplicationStatus);

module.exports = router;
