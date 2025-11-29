import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section footer-about">
                    <h3>SuRu</h3>
                    <p>Bridging the gap between visionary founders and exceptional talent to build the next generation of innovation.</p>
                    <div className="footer-social">
                        <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                        <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
                <div className="footer-section">
                    <h4>Platform</h4>
                    <ul>
                        <li><Link to="/browse-startups">Browse Startups</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/careers">Careers</Link></li>

                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact</h4>
                    <ul>
                        <li><i className="fas fa-envelope"></i> <a href="mailto:info@startupconnect.com">info@startupconnect.com</a></li>
                        <li><i className="fas fa-phone"></i> <a href="tel:+1234567890">+1 (234) 567-890</a></li>
                        <li><i className="fas fa-map-marker-alt"></i> 123 Innovation Street, Tech Valley, CA 94025</li>
                    </ul>
                </div>

            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 SuRu. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
