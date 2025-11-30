import React from 'react';
import './Legal.css';

const TermsOfService = () => {
    return (
        <div className="legal-page">
            <div className="container legal-container">
                <h1>Terms of Service</h1>
                <p className="last-updated">Last Updated: November 29, 2025</p>

                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using StartUpConnect, you accept and agree to be bound by the terms and provisions of this agreement.</p>
                </section>

                <section>
                    <h2>2. Use of Service</h2>
                    <p>SuRu provides a platform for entrepreneurs and investors to connect. You agree to:</p>
                    <ul>
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Not use the service for any illegal purposes</li>
                        <li>Not impersonate others or provide false information</li>
                        <li>Respect the intellectual property rights of others</li>
                    </ul>
                </section>

                <section>
                    <h2>3. User Content</h2>
                    <p>You retain ownership of content you post on SuRu. By posting content, you grant us a license to use, modify, and display that content in connection with our services.</p>
                    <ul>
                        <li>You are responsible for the content you post</li>
                        <li>Content must not violate any laws or third-party rights</li>
                        <li>We reserve the right to remove content that violates these terms</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Account Termination</h2>
                    <p>We reserve the right to suspend or terminate your account if you violate these terms or engage in fraudulent or illegal activities.</p>
                </section>

                <section>
                    <h2>5. Disclaimer of Warranties</h2>
                    <p>SuRu is provided "as is" without warranties of any kind. We do not guarantee:</p>
                    <ul>
                        <li>The accuracy or reliability of user-posted content</li>
                        <li>Uninterrupted or error-free service</li>
                        <li>The success of any business connections made through our platform</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Limitation of Liability</h2>
                    <p>SuRu shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</p>
                </section>

                <section>
                    <h2>7. Investment Disclaimer</h2>
                    <p>SuRu does not provide investment advice. All investment decisions are made at your own risk. We recommend consulting with financial advisors before making any investment decisions.</p>
                </section>

                <section>
                    <h2>8. Changes to Terms</h2>
                    <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.</p>
                </section>

                <section>
                    <h2>9. Contact Information</h2>
                    <p>For questions about these Terms of Service, please contact us at:</p>
                    <p><strong>Email:</strong> suru@gmail.com</p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
