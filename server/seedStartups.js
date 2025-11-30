const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Startup = require('./models/Startup');

dotenv.config();

const startups = [
    {
        title: "EcoFarm Tech",
        category: "AgriTech",
        description: "A platform helping farmers optimize crop yield with AI-driven insights and sustainable techniques.",
        location: "Kathmandu, Nepal",
        status: "Raising Funds",
        skillsRequired: ["React", "Node.js", "AI", "UI/UX"],
        founder: "69283a671d8992d1443e4bd7", // rasu
        logoUrl: "https://via.placeholder.com/50",
        tags: ["AgriTech", "AI", "Sustainability"]
    },
    {
        title: "HealthMate",
        category: "HealthTech",
        description: "A mobile app connecting patients to doctors, pharmacies, and health services in real-time.",
        location: "Kathmandu, Nepal",
        status: "Hiring",
        skillsRequired: ["Flutter", "Firebase", "UI/UX"],
        founder: "69283a671d8992d1443e4bd7", // rasu
        logoUrl: "",
        tags: ["HealthTech", "Mobile App", "Healthcare"]
    },
    {
        title: "EduNext",
        category: "EdTech",
        description: "Interactive learning platform for schools, providing personalized lessons and AI-assisted grading.",
        location: "Pokhara, Nepal",
        status: "Seeking Cofounder",
        skillsRequired: ["Python", "Machine Learning"],
        founder: "692846d71d8992d1443e4e18", // nirajan
        logoUrl: "https://via.placeholder.com/50",
        tags: ["EdTech", "Education", "AI"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Optional: Clear existing startups? The user said "insert", not "replace".
        // I'll just insert.

        await Startup.insertMany(startups);
        console.log('Sample data inserted successfully');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
