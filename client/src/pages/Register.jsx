import React, { useState, useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props.js";
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [error, setError] = useState('');
    const { googleLogin, facebookLogin } = useContext(AuthContext);
    const navigate = useNavigate();

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

    const handleFacebookResponse = async (response) => {
        if (response.accessToken) {
            try {
                await facebookLogin(response.accessToken, response.userID);
                navigate('/dashboard');
            } catch (err) {
                setError('Facebook registration failed');
            }
        } else {
            setError('Facebook registration failed');
        }
    };

    const handleEmailRegister = () => {
        navigate('/register/email');
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
                        <FacebookLogin
                            appId={import.meta.env.VITE_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID"}
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={handleFacebookResponse}
                            render={renderProps => (
                                <button
                                    className="social-btn facebook-btn"
                                    onClick={renderProps.onClick}
                                    title="Continue with Facebook"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                </button>
                            )}
                        />
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

                <button
                    className="btn btn-secondary full-width"
                    onClick={handleEmailRegister}
                >
                    Continue with Email
                </button>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

