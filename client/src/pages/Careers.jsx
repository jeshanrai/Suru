import React from 'react';
import './Careers.css';

const Careers = () => {
    const openPositions = [
        {
            title: 'Full Stack Developer',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time',
            description: 'Build and maintain our platform using modern web technologies.'
        },
        {
            title: 'UX/UI Designer',
            department: 'Design',
            location: 'Remote',
            type: 'Full-time',
            description: 'Create intuitive and beautiful user experiences for our platform.'
        },

    ];

    return (
        <div className="careers-page">
            <div className="careers-hero">
                <div className="container">
                    <h1>Join Our Team</h1>
                    <p className="hero-subtitle">Help us build the future of startup connections</p>
                </div>
            </div>

            <div className="container careers-content">
                <section className="why-join-section">
                    <h2>Why Work With Us?</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">💼</div>
                            <h3>Meaningful Work</h3>
                            <p>Help entrepreneurs and investors build the future</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🌱</div>
                            <h3>Growth Opportunities</h3>
                            <p>Continuous learning and career development</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🏖️</div>
                            <h3>Work-Life Balance</h3>
                            <p>Flexible hours and remote work options</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🎯</div>
                            <h3>Competitive Benefits</h3>
                            <p>Great salary, health insurance, and perks</p>
                        </div>
                    </div>
                </section>

                <section className="positions-section">
                    <h2>Open Positions</h2>
                    <div className="positions-list">
                        {openPositions.map((position, index) => (
                            <div key={index} className="position-card">
                                <div className="position-header">
                                    <h3>{position.title}</h3>
                                    <span className="position-type">{position.type}</span>
                                </div>
                                <div className="position-meta">
                                    <span className="department">{position.department}</span>
                                    <span className="location">📍 {position.location}</span>
                                </div>
                                <p className="position-description">{position.description}</p>
                                <button className="apply-btn">Apply Now</button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="culture-section">
                    <h2>Our Culture</h2>
                    <p>At StartUpConnect, we foster a culture of innovation, collaboration, and continuous improvement. We believe in empowering our team members to take ownership, experiment with new ideas, and make a real impact.</p>
                    <ul className="culture-list">
                        <li>Collaborative and inclusive environment</li>
                        <li>Innovation-driven mindset</li>
                        <li>Transparent communication</li>
                        <li>Support for professional development</li>
                        <li>Celebrate successes together</li>
                    </ul>
                </section>

                <section className="contact-section">
                    <h2>Don't See Your Role?</h2>
                    <p>We're always looking for talented individuals to join our team. Send us your resume and let us know how you can contribute to StartUpConnect.</p>
                    <a href="mailto:careers@startupconnect.com" className="btn btn-primary">Send Your Resume</a>
                </section>
            </div>
        </div>
    );
};

export default Careers;
