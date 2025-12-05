import React, { useState, useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props.js";
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, googleLogin, facebookLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(email, password);
            if (userData.isProfileComplete) {
                navigate('/dashboard');
            } else {
                navigate('/setup');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const userData = await googleLogin(credentialResponse.credential);
            if (userData.isProfileComplete) {
                navigate('/dashboard');
            } else {
                navigate('/setup');
            }
        } catch (err) {
            setError('Google login failed');
        }
    };

    const handleGoogleError = () => {
        setError('Google login failed');
    };

    const handleFacebookResponse = async (response) => {
        if (response.accessToken) {
            try {
                const userData = await facebookLogin(response.accessToken, response.userID);
                if (userData.isProfileComplete) {
                    navigate('/dashboard');
                } else {
                    navigate('/setup');
                }
            } catch (err) {
                setError('Facebook login failed');
            }
        } else {
            setError('Facebook login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card card">
                <h2>Welcome Back</h2>
                <p>Login to continue your journey</p>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-primary full-width">Login</button>
                </form>

                <div className="google-login-divider">OR</div>

                <div className="social-buttons-full">
                    {/* Google Button */}
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap={false}
                        render={renderProps => (
                            <button
                                className="social-btn-full google-btn-full"
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                    </g>
                                </svg>
                                <span>Continue with Google</span>
                            </button>
                        )}
                    />

                    {/* Facebook Button */}
                    <FacebookLogin
                        appId={import.meta.env.VITE_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID"}
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={handleFacebookResponse}
                        render={renderProps => (
                            <button
                                className="social-btn-full facebook-btn-full"
                                onClick={renderProps.onClick}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span>Sign in with Facebook</span>
                            </button>
                        )}
                    />
                </div>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
