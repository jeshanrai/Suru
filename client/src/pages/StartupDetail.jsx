import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, DollarSign, Calendar, User, CheckCircle, Upload, X } from 'lucide-react';
import './StartupDetail.css';

const StartupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeError, setResumeError] = useState('');

    useEffect(() => {
        fetchStartup();
    }, [id]);

    const fetchStartup = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/startups/${id}`);
            setStartup(data);
        } catch (err) {
            console.error('Error fetching startup:', err);
            setStartup(null);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            setResumeError('Please upload a PDF, DOC, or DOCX file');
            e.target.value = '';
            return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            setResumeError('File size must be less than 5MB');
            e.target.value = '';
            return;
        }

        setResumeError('');
        setResumeFile(file);
    };

    const removeResume = () => {
        setResumeFile(null);
        setResumeError('');
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        setError('');
        try {
            let resumeData = null;
            let resumeFileName = null;
            let resumeFileType = null;

            // Convert resume to Base64 if file is selected
            if (resumeFile) {
                const reader = new FileReader();
                resumeData = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(resumeFile);
                });
                resumeFileName = resumeFile.name;
                resumeFileType = resumeFile.type;
            }

            await api.post('/applications', {
                startupId: id,
                message,
                resume: resumeData,
                resumeFileName,
                resumeFileType
            });
            setSuccess(true);
            setApplying(false);
            setMessage('');
            setResumeFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Application failed');
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'hiring': return 'status-hiring';
            case 'raising funds': return 'status-raising';
            case 'seeking cofounder': return 'status-seeking';
            default: return 'status-default';
        }
    };

    if (loading) return null;

    if (!startup) return <div className="no-results">Startup not found</div>;

    return (
        <div className="container-page-container">
            <div className="startup-detail-header card">
                <div className="startup-header-row">
                    <div className="startup-logo-container">
                        {(startup.logoUrl || startup.founder?.profilePicture) ? (
                            <img
                                src={startup.logoUrl || startup.founder?.profilePicture}
                                alt={startup.title}
                                className="startup-logo"
                            />
                        ) : startup.founder?.name ? (
                            <div className="startup-logo-placeholder">
                                {startup.founder.name.charAt(0).toUpperCase()}
                            </div>
                        ) : null}
                    </div>

                    <div className="header-content">
                        <div className="header-top-row">
                            <h1 className="startup-title-large">{startup.title}</h1>
                            <span className={`status-badge ${getStatusClass(startup.status)}`}>
                                {startup.status || "Open"}
                            </span>
                        </div>

                        <div className="meta-row">
                            <span className="category-badge">{startup.category}</span>
                            <div className="meta-item">
                                <MapPin size={18} />
                                <span>{startup.location || 'Remote'}</span>
                            </div>
                            <div className="meta-item">
                                <Calendar size={18} />
                                <span>Founded: {new Date(startup.createdAt).toLocaleDateString()}</span>
                            </div>
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
                                {startup.founder?.profilePicture ? (
                                    <img
                                        src={startup.founder.profilePicture}
                                        alt={startup.founder.name}
                                        className="founder-avatar-img"
                                    />
                                ) : (
                                    <User size={32} />
                                )}
                            </div>
                            <div>
                                <h4>{startup.founder?.name}</h4>
                                <p>{startup.founder?.email}</p>
                            </div>
                        </div>
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

                                <div className="resume-upload-section">
                                    <label className="resume-upload-label">
                                        <Upload size={18} />
                                        <span>Upload Resume (Optional)</span>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="resume-file-input"
                                        />
                                    </label>

                                    {resumeFile && (
                                        <div className="resume-file-preview">
                                            <div className="file-info">
                                                <span className="file-name">{resumeFile.name}</span>
                                                <span className="file-size">({(resumeFile.size / 1024).toFixed(1)} KB)</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeResume}
                                                className="remove-file-btn"
                                                title="Remove file"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {resumeError && <div className="resume-error">{resumeError}</div>}
                                </div>
                                {error && <div className="error-text">{error}</div>}
                                <div className="button-group">
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => setApplying(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Send Application
                                    </button>
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
