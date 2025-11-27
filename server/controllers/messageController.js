const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;

    const message = await Message.create({
        sender: req.user._id,
        receiver: receiverId,
        content
    });

    res.status(201).json(message);
};

// @desc    Get messages between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
    const messages = await Message.find({
        $or: [
            { sender: req.user._id, receiver: req.params.userId },
            { sender: req.params.userId, receiver: req.user._id }
        ]
    }).sort({ createdAt: 1 });

    res.json(messages);
};

module.exports = { sendMessage, getMessages };
