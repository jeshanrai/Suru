const mongoose = require('mongoose');

const startupSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    investmentNeeded: { type: Number, default: 0 },
    skillsRequired: [{ type: String }],
    location: { type: String },
    tags: [{ type: String }],
    image: { type: String },
}, { timestamps: true });

const Startup = mongoose.model('Startup', startupSchema);
module.exports = Startup;
