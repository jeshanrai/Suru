const Startup = require('../models/Startup');

// @desc    Create a new startup
// @route   POST /api/startups
// @access  Private (Founder only)
const createStartup = async (req, res) => {
    const { title, description, category, investmentNeeded, skillsRequired, location, tags, image } = req.body;

    const startup = new Startup({
        title,
        description,
        category,
        founder: req.user._id,
        investmentNeeded,
        skillsRequired,
        location,
        tags,
        image
    });

    const createdStartup = await startup.save();
    res.status(201).json(createdStartup);
};

// @desc    Get all startups
// @route   GET /api/startups
// @access  Public
const getStartups = async (req, res) => {
    const { category, location, search, founder } = req.query;
    let query = {};

    if (category) {
        query.category = category;
    }

    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }

    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    if (founder) {
        query.founder = founder;
    }

    const startups = await Startup.find(query).populate('founder', 'name email');
    res.json(startups);
};

// @desc    Get startup by ID
// @route   GET /api/startups/:id
// @access  Public
const getStartupById = async (req, res) => {
    const startup = await Startup.findById(req.params.id).populate('founder', 'name email bio profileImage');

    if (startup) {
        res.json(startup);
    } else {
        res.status(404).json({ message: 'Startup not found' });
    }
};

module.exports = { createStartup, getStartups, getStartupById };
