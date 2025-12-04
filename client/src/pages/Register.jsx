import React, { useState, useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('partner');
    const [error, setError] = useState('');
    const [showManualRegister, setShowManualRegister] = useState(false);
    const { register, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/dashboard');
        } catch (err) {
            setError('Google registration failed');
        }
    };

    const handleGoogleError = () => {
        setError('Google registration failed');
    };

    return (
        <div className="auth-container">
            <div className="auth-card card">
                <h2>Create Account</h2>
                <p>Join the community of innovators</p>
                {error && <div className="error-message">{error}</div>}

                <div className="social-login-section">
                    <p className="register-with-text">Register with</p>
                    <div className="social-buttons-container">
                        <div className="google-btn-wrapper">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                type="icon"
                                shape="circle"
                            />
                        </div>
                        <button className="social-btn facebook-btn" title="Continue with Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        </button>
                        <button className="social-btn github-btn" title="Continue with GitHub">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                        </button>
                    </div>
                </div>

                <div className="divider-container">
                    <div className="divider-line"></div>
                    <span className="divider-text">OR</span>
                    <div className="divider-line"></div>
                </div>

                {!showManualRegister ? (
                    <button
                        className="btn btn-secondary full-width"
                        onClick={() => setShowManualRegister(true)}
                    >
                        Continue with Email
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="manual-register-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>I want to...</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="partner">Find a Startup to Join</option>
                                <option value="founder">Post a Startup Idea</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary full-width">Register</button>
                        <button
                            type="button"
                            className="btn-text"
                            onClick={() => setShowManualRegister(false)}
                        >
                            Cancel
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
