const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    attachments: [{ type: String }],
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
    deliveredAt: { type: Date },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
