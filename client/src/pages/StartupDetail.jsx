import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, DollarSign, Calendar, User, CheckCircle } from 'lucide-react';
import './StartupDetail.css';

const StartupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStartup();
    }, [id]);

    const fetchStartup = async () => {
        try {
            const { data } = await api.get(`/startups/${id}`);
            setStartup(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching startup:', error);
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await api.post('/applications', { startupId: id, message });
            setSuccess(true);
            setApplying(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Application failed');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!startup) return <div className="no-results">Startup not found</div>;

    return (
        <div className="container page-container">
            <div className="startup-detail-header card">
                <div className="header-content">
                    <span className="category-badge">{startup.category}</span>
                    <h1>{startup.title}</h1>
                    <div className="meta-row">
                        <div className="meta-item">
                            <MapPin size={18} />
                            <span>{startup.location || 'Remote'}</span>
                        </div>
                        <div className="meta-item">
                            <DollarSign size={18} />
                            <span>Investment: ${startup.investmentNeeded?.toLocaleString()}</span>
                        </div>
                        <div className="meta-item">
                            <Calendar size={18} />
                            <span>Founded: {new Date(startup.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-grid">
                <div className="main-content">
                    <div className="card section">
                        <h2>About the Startup</h2>
                        <p className="description-text">{startup.description}</p>
                    </div>

                    <div className="card section">
                        <h2>Skills Required</h2>
                        <div className="skills-list">
                            {startup.skillsRequired?.map((skill, index) => (
                                <span key={index} className="skill-badge">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="sidebar">
                    <div className="card founder-card">
                        <h3>About the Founder</h3>
                        <div className="founder-info">
                            <div className="founder-avatar">
                                <User size={32} />
                            </div>
                            <div>
                                <h4>{startup.founder?.name}</h4>
                                <p>{startup.founder?.email}</p>
                            </div>
                        </div>
                        {startup.founder?.bio && <p className="founder-bio">{startup.founder.bio}</p>}
                    </div>

                    <div className="card action-card">
                        <h3>Interested?</h3>
                        {success ? (
                            <div className="success-message">
                                <CheckCircle size={24} />
                                <p>Application Sent Successfully!</p>
                            </div>
                        ) : applying ? (
                            <form onSubmit={handleApply}>
                                <textarea
                                    placeholder="Why are you a good fit?"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows="4"
                                    className="apply-textarea"
                                />
                                {error && <div className="error-text">{error}</div>}
                                <div className="button-group">
                                    <button type="button" className="btn btn-outline" onClick={() => setApplying(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Send Application</button>
                                </div>
                            </form>
                        ) : (
                            <button
                                className="btn btn-primary full-width"
                                onClick={() => setApplying(true)}
                                disabled={user?._id === startup.founder?._id}
                            >
                                {user?._id === startup.founder?._id ? 'You Own This' : 'Apply to Join'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupDetail;
