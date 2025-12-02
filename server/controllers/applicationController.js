const Application = require('../models/Application');
const Startup = require('../models/Startup');

// @desc    Apply to a startup
// @route   POST /api/applications
// @access  Private
const applyToStartup = async (req, res) => {
    const { startupId, message, resume, resumeFileName, resumeFileType } = req.body;

    const startup = await Startup.findById(startupId);
    if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
    }

    const existingApplication = await Application.findOne({
        applicant: req.user._id,
        startup: startupId
    });

    if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied to this startup' });
    }

    const application = await Application.create({
        applicant: req.user._id,
        startup: startupId,
        message,
        resume,
        resumeFileName,
        resumeFileType
    });

    res.status(201).json(application);
};

// @desc    Get applications for a startup (Founder only)
// @route   GET /api/applications/startup/:startupId
// @access  Private
const getStartupApplications = async (req, res) => {
    const applications = await Application.find({ startup: req.params.startupId })
        .populate('applicant', 'name email skills bio profileImage');
    res.json(applications);
};

// @desc    Get my applications (Partner)
// @route   GET /api/applications/my
// @access  Private
const getMyApplications = async (req, res) => {
    const applications = await Application.find({ applicant: req.user._id })
        .populate({
            path: 'startup',
            select: 'title category founder',
            populate: {
                path: 'founder',
                select: 'name email profileImage'
            }
        });
    res.json(applications);
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Founder only)
const updateApplicationStatus = async (req, res) => {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (application) {
        application.status = status;
        const updatedApplication = await application.save();
        res.json(updatedApplication);
    } else {
        res.status(404).json({ message: 'Application not found' });
    }
};

module.exports = { applyToStartup, getStartupApplications, getMyApplications, updateApplicationStatus };
