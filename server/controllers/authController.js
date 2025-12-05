const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isProfileComplete: user.isProfileComplete,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            skills: user.skills,
            profilePicture: user.profilePicture,
            portfolio: user.portfolio,
            isProfileComplete: user.isProfileComplete,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};



const googleAuth = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bio: user.bio,
                skills: user.skills,
                profilePicture: user.profilePicture,
                portfolio: user.portfolio,
                isProfileComplete: user.isProfileComplete,
                token: generateToken(user._id),
            });
        } else {
            // Create new user
            // Default role to 'partner' if not specified, or maybe ask user later?
            // For now, default to 'partner' as per schema default
            user = await User.create({
                name,
                email,
                password: '', // No password for Google users
                profilePicture: picture,
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

const facebookAuth = async (req, res) => {
    const { accessToken, userID } = req.body;

    try {
        const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;
        const { data } = await axios.get(url);
        const { email, name, picture } = data;

        let user = await User.findOne({ email });

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bio: user.bio,
                skills: user.skills,
                profilePicture: user.profilePicture,
                portfolio: user.portfolio,
                isProfileComplete: user.isProfileComplete,
                token: generateToken(user._id),
            });
        } else {
            user = await User.create({
                name,
                email,
                password: '',
                profilePicture: picture.data.url,
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error('Facebook Auth Error:', error);
        res.status(401).json({ message: 'Facebook authentication failed' });
    }
};

module.exports = { registerUser, authUser, googleAuth, facebookAuth };
