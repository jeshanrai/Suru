const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: ['founder', 'partner'], default: 'partner' },
    bio: { type: String, default: '' },
    skills: [{ type: String, default: [] }],
    profilePicture: { type: String, default: '' },
    portfolio: [{ title: { type: String, default: '' }, link: { type: String, default: '' } }],
    isProfileComplete: { type: Boolean, default: false },
}, { timestamps: true });

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
