import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3>StartUpConnect</h3>
                    <p>Connecting visionaries with builders.</p>
                </div>
                <div className="footer-section">
                    <h4>Platform</h4>
                    <ul>
                        <li>Browse Startups</li>
                        <li>How it Works</li>
                        <li>Pricing</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Company</h4>
                    <ul>
                        <li>About Us</li>
                        <li>Contact</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 StartUp Connect Hub. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
