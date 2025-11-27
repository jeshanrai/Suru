const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startup: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
    status: { type: String, enum: ['pending', 'shortlisted', 'accepted', 'rejected'], default: 'pending' },
    message: { type: String },
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
