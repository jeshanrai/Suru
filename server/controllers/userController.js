const User = require('../models/User');

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('GET USER ERROR:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const loggedInUserId = req.user._id;

        if (user._id.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this profile' });
        }

        // Safely update string fields
        user.name = typeof req.body.name === 'string' ? req.body.name : user.name;
        user.bio = typeof req.body.bio === 'string' ? req.body.bio : user.bio;

        // Safely update skills array
        if (Array.isArray(req.body.skills)) {
            user.skills = req.body.skills.filter(s => typeof s === 'string');
        }

        // Safely update portfolio array
        if (Array.isArray(req.body.portfolio)) {
            user.portfolio = req.body.portfolio
                .filter(p => p && typeof p.title === 'string' && typeof p.link === 'string')
                .map(p => ({ title: p.title, link: p.link }));
        }

        // Update profile picture if string provided
        if (typeof req.body.profilePicture === 'string') {
            user.profilePicture = req.body.profilePicture;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            bio: updatedUser.bio,
            skills: updatedUser.skills,
            portfolio: updatedUser.portfolio,
            profilePicture: updatedUser.profilePicture
        });

    } catch (error) {
        console.error('UPDATE USER ERROR:', error);
        // Provide detailed error info
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', error: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate email not allowed' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { updateUserProfile, getUserById };
