const Startup = require('../models/Startup');

// @desc    Create a new startup
// @route   POST /api/startups
// @access  Private (Founder only)
const createStartup = async (req, res) => {
    const { title, description, category, status, skillsRequired, location, tags, image, logoUrl } = req.body;

    const startup = new Startup({
        title,
        description,
        category,
        founder: req.user._id,
        status,
        skillsRequired,
        location,
        tags,
        image,
        logoUrl
    });

    const createdStartup = await startup.save();
    res.status(201).json(createdStartup);
};

// @desc    Get all startups
// @route   GET /api/startups
// @access  Public
const getStartups = async (req, res) => {
    const { category, location, search, founder, page = 1, limit = 9 } = req.query;
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

    // Convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination metadata
    const total = await Startup.countDocuments(query);

    // Fetch startups with pagination
    const startups = await Startup.find(query)
        .populate('founder', 'name email profilePicture')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
        startups,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
            hasMore: skip + startups.length < total
        }
    });
};

// @desc    Get startup by ID
// @route   GET /api/startups/:id
// @access  Public
const getStartupById = async (req, res) => {
    const startup = await Startup.findById(req.params.id).populate('founder', 'name email bio profilePicture');

    if (startup) {
        res.json(startup);
    } else {
        res.status(404).json({ message: 'Startup not found' });
    }
};

module.exports = { createStartup, getStartups, getStartupById };
