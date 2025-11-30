import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Auth.css'; // Reuse auth styles for form

const CreateStartup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Tech',
        status: 'Hiring',
        location: '',
        skillsRequired: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const skillsArray = formData.skillsRequired.split(',').map(s => s.trim());
            await api.post('/startups', {
                ...formData,
                skillsRequired: skillsArray
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create startup');
        }
    };

    return (
        <div className="container page-container">
            <div className="auth-card card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2>Post Your Startup Idea</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Startup Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="Tech">Tech</option>
                            <option value="Ecommerce">Ecommerce</option>
                            <option value="Health">Health</option>
                            <option value="Finance">Finance</option>
                            <option value="Education">Education</option>
                            <option value="Agriculture">Agriculture</option>
                            <option value="Real Estate">Real Estate</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="5"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="Hiring">Hiring</option>
                            <option value="Raising Funds">Raising Funds</option>
                            <option value="Seeking Cofounder">Seeking Cofounder</option>
                            <option value="Open">Open</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. New York or Remote"
                        />
                    </div>
                    <div className="form-group">
                        <label>Skills Required (comma separated)</label>
                        <input
                            type="text"
                            name="skillsRequired"
                            value={formData.skillsRequired}
                            onChange={handleChange}
                            placeholder="e.g. React, Marketing, Sales"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary full-width">Post Startup</button>
                </form>
            </div>
        </div>
    );
};

export default CreateStartup;
