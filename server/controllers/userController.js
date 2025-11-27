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
        res.status(500).json({ message: 'Server error' });
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

        // Check if the logged-in user is updating their own profile
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this profile' });
        }

        // Update fields
        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.skills = req.body.skills || user.skills;
        user.portfolio = req.body.portfolio || user.portfolio;
        if (req.body.profilePicture !== undefined) {
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
            profilePicture: updatedUser.profilePicture,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserById, updateUserProfile };
