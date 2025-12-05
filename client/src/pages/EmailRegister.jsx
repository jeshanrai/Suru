import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const EmailRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('partner');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
            // New users always need to complete setup
            navigate('/setup');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleBack = () => {
        navigate('/register');
    };

    return (
        <div className="auth-container">
            <div className="auth-card card">
                <h2>Create Account</h2>
                <p>Register with your email address</p>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="manual-register-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a strong password"
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
                    <button type="submit" className="btn btn-primary full-width">
                        Create Account
                    </button>
                    <button
                        type="button"
                        className="btn-text"
                        onClick={handleBack}
                    >
                        ← Back to other options
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default EmailRegister;
