import React from 'react';
import { Target, Users, Lightbulb, Rocket } from 'lucide-react';
import './AboutUs.css';

const AboutUs = () => {
    const values = [
        {
            icon: <Target size={32} />,
            title: 'Our Mission',
            description: 'To bridge the gap between innovative startups and talented individuals, creating opportunities for exponential growth.'
        },
        {
            icon: <Users size={32} />,
            title: 'Community First',
            description: 'We believe in building a strong ecosystem where entrepreneurs and professionals can connect, learn, and build together.'
        },
        {
            icon: <Lightbulb size={32} />,
            title: 'Innovation',
            description: 'We foster creativity and innovation by connecting forward-thinking startups with passionate, skilled individuals.'
        },
        {
            icon: <Rocket size={32} />,
            title: 'Growth',
            description: 'We are committed to helping both startups and individuals achieve their full potential through strategic connections.'
        }
    ];

    return (
        <section id="about" className="about-us-section">
            <div className="container">
                <div className="about-us-header">
                    <h2 className="section-title">About StartupConnect</h2>
                    <p className="section-subtitle">
                        Empowering the next generation of entrepreneurs and innovators
                    </p>
                </div>

                <div className="about-us-content">
                    <div className="about-us-story">
                        <h3>Our Story</h3>
                        <p>
                            StartupConnect was born from a simple observation: great ideas die without the right team.
                            We realized that talented individuals and innovative startups often struggle to find each other in a noisy market.
                            We created a platform that cuts through the noise to make connections seamless, meaningful, and impactful.
                        </p>
                        <p>
                            Whether you're a visionary founder looking for your technical counterpart or a skilled professional
                            seeking equity and purpose in the startup ecosystem, StartupConnect is
                            your gateway to building the next big thing.
                        </p>
                    </div>

                    <div className="about-us-values">
                        <h3>What We Stand For</h3>
                        <div className="values-grid">
                            {values.map((value, index) => (
                                <div key={index} className="value-card">
                                    <div className="value-icon">{value.icon}</div>
                                    <h4>{value.title}</h4>
                                    <p>{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutUs;
