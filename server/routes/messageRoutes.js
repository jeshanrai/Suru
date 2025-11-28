const express = require('express');
const {
    sendMessage,
    getMessages,
    getConversations,
    markAsSeen,
    getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/unread/count', protect, getUnreadCount);
router.put('/seen/:senderId', protect, markAsSeen);
router.get('/:userId', protect, getMessages);

module.exports = router;
