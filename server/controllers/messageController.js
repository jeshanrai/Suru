const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Application = require('../models/Application');
const Startup = require('../models/Startup');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    try {
        // 1. Find or create conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                unreadCounts: {
                    [senderId]: 0,
                    [receiverId]: 0
                }
            });
        }

        // 2. Create message
        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            content,
            conversationId: conversation._id
        });

        // 3. Update conversation
        conversation.lastMessage = message._id;

        // Always increment unread count - socket notification will only be sent if receiver is not in chat
        const currentUnread = conversation.unreadCounts.get(receiverId.toString()) || 0;
        conversation.unreadCounts.set(receiverId.toString(), currentUnread + 1);

        await conversation.save();

        // Populate sender for immediate UI update if needed
        await message.populate('sender', 'name profileImage');
        await message.populate('conversationId');

        res.status(201).json(message);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
};

// @desc    Get messages for a specific conversation (by user ID)
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
    const otherUserId = req.params.userId;
    const myId = req.user._id;

    try {
        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: otherUserId },
                { sender: otherUserId, receiver: myId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

// @desc    Get all conversations for current user (including potential connections)
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // 1. Fetch existing conversations
        const existingConversations = await Conversation.find({
            participants: currentUserId
        })
            .populate('participants', 'name profilePicture role')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        // Map existing conversations to a Set of user IDs for easy lookup
        const existingPartnerIds = new Set();
        const formattedConversations = existingConversations.map(conv => {
            const otherUser = conv.participants.find(p => p._id.toString() !== currentUserId.toString());
            if (otherUser) existingPartnerIds.add(otherUser._id.toString());

            return {
                _id: conv._id,
                otherUser: otherUser,
                lastMessage: conv.lastMessage,
                unreadCount: conv.unreadCounts.get(currentUserId.toString()) || 0,
                updatedAt: conv.updatedAt
            };
        });

        // 2. Fetch potential connections (Accepted Applications)
        let potentialPartners = [];

        // A. If I am an applicant, find startups I've been accepted to (get founders)
        const myApplications = await Application.find({
            applicant: currentUserId,
            status: 'accepted'
        }).populate({
            path: 'startup',
            populate: { path: 'founder', select: 'name profilePicture role' }
        });

        myApplications.forEach(app => {
            if (app.startup && app.startup.founder) {
                potentialPartners.push(app.startup.founder);
            }
        });

        // B. If I am a founder, find applicants accepted to my startups
        const myStartups = await Startup.find({ founder: currentUserId });
        const myStartupIds = myStartups.map(s => s._id);

        if (myStartupIds.length > 0) {
            const acceptedApps = await Application.find({
                startup: { $in: myStartupIds },
                status: 'accepted'
            }).populate('applicant', 'name profilePicture role');

            acceptedApps.forEach(app => {
                if (app.applicant) {
                    potentialPartners.push(app.applicant);
                }
            });
        }

        // 3. Merge potential partners who are NOT in existing conversations
        potentialPartners.forEach(partner => {
            if (!existingPartnerIds.has(partner._id.toString())) {
                // Add unique partners only
                existingPartnerIds.add(partner._id.toString());

                formattedConversations.push({
                    _id: 'new_' + partner._id, // Temporary ID for frontend key
                    otherUser: partner,
                    lastMessage: null,
                    unreadCount: 0,
                    updatedAt: new Date(0) // Put at the bottom
                });
            }
        });

        // Sort: Active conversations first (by date), then new connections
        formattedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        res.json(formattedConversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ message: "Failed to fetch conversations" });
    }
};

// @desc    Mark messages as seen
// @route   PUT /api/messages/seen/:senderId
// @access  Private
const markAsSeen = async (req, res) => {
    const senderId = req.params.senderId;
    const myId = req.user._id;

    try {
        // Update all unread messages from this sender to me
        await Message.updateMany(
            { sender: senderId, receiver: myId, read: false },
            { $set: { read: true, readAt: new Date() } }
        );

        // Reset unread count in conversation
        const conversation = await Conversation.findOne({
            participants: { $all: [myId, senderId] }
        });

        if (conversation) {
            conversation.unreadCounts.set(myId.toString(), 0);
            await conversation.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error marking as seen:", error);
        res.status(500).json({ message: "Failed to mark as seen" });
    }
};


// @desc    Get total unread count
// @route   GET /api/messages/unread/count
// @access  Private
const getUnreadCount = async (req, res) => {
    try {
        const count = await calculateUnreadCount(req.user._id);
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: "Failed to get unread count" });
    }
};

// Helper function to calculate unread count for a user
const calculateUnreadCount = async (userId) => {
    try {
        const conversations = await Conversation.find({
            participants: userId
        });

        let totalUnread = 0;
        conversations.forEach(conv => {
            const unread = conv.unreadCounts.get(userId.toString()) || 0;
            if (unread > 0) {
                totalUnread += 1;
            }
        });

        return totalUnread;
    } catch (error) {
        console.error("Error calculating unread count:", error);
        return 0;
    }
};

module.exports = { sendMessage, getMessages, getConversations, markAsSeen, getUnreadCount, calculateUnreadCount };
