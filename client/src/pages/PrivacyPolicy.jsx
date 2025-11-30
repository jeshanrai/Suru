import React from 'react';
import './Legal.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page">
            <div className="container legal-container">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: November 29, 2025</p>

                <section>
                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us when you create an account, post a startup, send messages, or otherwise use our services.</p>
                    <ul>
                        <li>Account information (name, email, password)</li>
                        <li>Profile information (bio, location, profile picture)</li>
                        <li>Startup information (business details, descriptions, images)</li>
                        <li>Communications and messages sent through our platform</li>
                    </ul>
                </section>

                <section>
                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Provide, maintain, and improve our services</li>
                        <li>Connect entrepreneurs with investors</li>
                        <li>Send you technical notices and support messages</li>
                        <li>Respond to your comments and questions</li>
                        <li>Protect against fraudulent or illegal activity</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Information Sharing</h2>
                    <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
                    <ul>
                        <li>With other users when you post startup information publicly</li>
                        <li>With service providers who assist in our operations</li>
                        <li>When required by law or to protect our rights</li>
                        <li>With your consent or at your direction</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Data Security</h2>
                    <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
                </section>

                <section>
                    <h2>5. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access and update your personal information</li>
                        <li>Delete your account and associated data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Request a copy of your data</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Cookies</h2>
                    <p>We use cookies and similar technologies to provide and support our services and to improve your experience.</p>
                </section>

                <section>
                    <h2>7. Contact Us</h2>
                    <p>If you have questions about this Privacy Policy, please contact us at:</p>
                    <p><strong>Email:</strong> suru@gmail.com</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
