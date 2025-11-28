import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Edit2, Save, X, Plus, Trash2, Camera } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user, updateUser, logout } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        skills: [],
        portfolio: [],
        profilePicture: ''
    });
    const [newSkill, setNewSkill] = useState('');
    const [newPortfolio, setNewPortfolio] = useState({ title: '', link: '' });
    const fileInputRef = useRef(null);

    // --- 1. Initialization and Data Sync ---
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                skills: user.skills || [],
                portfolio: user.portfolio || [],
                profilePicture: user.profilePicture || ''
            });
        }
    }, [user]);

    // --- 2. Input Change Handlers ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handlePictureChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Limit file size to 5MB to avoid payload issues
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size too large. Please choose an image under 5MB.");
                return;
            }

            try {
                const base64 = await convertToBase64(file);
                setFormData({ ...formData, profilePicture: base64 });
                setError(null);
            } catch (err) {
                console.error("Error converting to base64", err);
                setError("Failed to load image. Please try another one.");
            }
        }
    };

    const handlePictureUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (index) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((_, i) => i !== index)
        });
    };

    const handleAddPortfolio = () => {
        if (newPortfolio.title.trim() && newPortfolio.link.trim()) {
            setFormData({
                ...formData,
                portfolio: [...formData.portfolio, { ...newPortfolio }]
            });
            setNewPortfolio({ title: '', link: '' });
        }
    };

    const handleRemovePortfolio = (index) => {
        setFormData({
            ...formData,
            portfolio: formData.portfolio.filter((_, i) => i !== index)
        });
    };

    // --- 3. Form Submission and Cancelation ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const updateData = { ...formData };
        console.log(updateData);
        delete updateData.email;

        try {
            // Update profile data (including profilePicture as base64)
            const { data } = await api.put(`/users/${user._id}`, updateData);

            // Update User Context/Local Storage
            const updatedUserData = { ...user, ...data };
            updateUser(updatedUserData);

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please ensure all fields are valid and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            bio: user.bio || '',
            skills: user.skills || [],
            portfolio: user.portfolio || '',
            profilePicture: user.profilePicture || ''
        });
        setIsEditing(false);
        setError(null);
    };

    // --- 4. Rendering Logic ---
    if (!user) return <div className="loading">Loading...</div>;

    const avatarSrc = formData.profilePicture || user.profilePicture || null;
    const avatarContent = avatarSrc
        ? <img src={avatarSrc} alt="Profile" className="profile-image" />
        : <span className="avatar-initials">{user.name?.charAt(0).toUpperCase()}</span>;

    return (
        <div className="container page-container">
            <div className="profile-page">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className={`profile-avatar ${isEditing ? 'editing' : ''}`}>
                        {avatarContent}
                        {isEditing && (
                            <div className="avatar-overlay" onClick={handlePictureUploadClick}>
                                <Camera size={24} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handlePictureChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="profile-header-info">
                        <h1 className="name-display">{user.name}</h1>
                        <p className="role-display">{user.role}</p>
                        <p className="email-display">{user.email}</p>
                    </div>
                    {!isEditing && (
                        <button className="btn btn-primary edit-btn" onClick={() => setIsEditing(true)}>
                            <Edit2 size={18} /> Edit Profile
                        </button>
                    )}
                </div>

                <hr className="profile-divider" />

                {error && <div className="alert alert-error">{error}</div>}

                {/* Profile Content (View or Edit) */}
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="profile-edit-form">
                        <div className="profile-content-grid">
                            {/* LEFT COLUMN: Basic Information */}
                            <div className="main-info-column">
                                <div className="card profile-section-edit">
                                    <h2 className="section-title">Basic Information</h2>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="input-text"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="input-text input-disabled"
                                        />
                                        <small className="form-hint">Email cannot be changed.</small>
                                    </div>
                                    <div className="form-group">
                                        <label>Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows="4"
                                            placeholder="Tell us about yourself..."
                                            className="input-textarea"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Skills and Portfolio */}
                            <div className="secondary-info-column">
                                <div className="card profile-section-edit skills-card">
                                    <h2 className="section-title">Skills</h2>
                                    <div className="skills-edit-container">
                                        {formData.skills.map((skill, index) => (
                                            <div key={index} className="skill-tag-edit">
                                                <span className="skill-name">{skill}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(index)}
                                                    className="btn-icon-remove"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="add-item-form">
                                        <input
                                            type="text"
                                            placeholder="Add a skill (e.g., React, Node.js)"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                            className="input-text"
                                        />
                                        <button type="button" onClick={handleAddSkill} className="btn btn-secondary">
                                            <Plus size={18} /> Add
                                        </button>
                                    </div>
                                </div>

                                <div className="card profile-section-edit portfolio-card">
                                    <h2 className="section-title">Portfolio</h2>
                                    <div className="portfolio-list-edit">
                                        {formData.portfolio.map((item, index) => (
                                            <div key={index} className="portfolio-item-edit-row">
                                                <div className="item-details">
                                                    <strong>{item.title}</strong>
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="item-link">
                                                        {item.link}
                                                    </a>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePortfolio(index)}
                                                    className="btn-icon-remove"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="add-item-form portfolio-add-form">
                                        <input
                                            type="text"
                                            placeholder="Project title..."
                                            value={newPortfolio.title}
                                            onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                                            className="input-text"
                                        />
                                        <input
                                            type="url"
                                            placeholder="Project link (URL)..."
                                            value={newPortfolio.link}
                                            onChange={(e) => setNewPortfolio({ ...newPortfolio, link: e.target.value })}
                                            className="input-text"
                                        />
                                        <button type="button" onClick={handleAddPortfolio} className="btn btn-secondary">
                                            <Plus size={18} /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions-sticky">
                            <button type="button" onClick={handleCancel} className="btn btn-outline-danger">
                                <X size={18} /> Cancel
                            </button>
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {/* View Mode Sections */}
                        <div className="card profile-section-view">
                            <h2 className="section-title">About Me 📖</h2>
                            <p className="profile-bio-text">{user.bio || 'No bio added yet. Click "Edit Profile" to add one.'}</p>
                        </div>

                        <div className="card profile-section-view">
                            <h2 className="section-title">Skills 🛠️</h2>
                            <div className="skills-display-container">
                                {user.skills && user.skills.length > 0 ? (
                                    user.skills.map((skill, index) => (
                                        <span key={index} className="skill-badge-view">{skill}</span>
                                    ))
                                ) : (
                                    <p className="empty-state">No skills added yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="card profile-section-view">
                            <h2 className="section-title">Portfolio 🔗</h2>
                            <div className="portfolio-display-container">
                                {user.portfolio && user.portfolio.length > 0 ? (
                                    user.portfolio.map((item, index) => (
                                        <div key={index} className="portfolio-item-view">
                                            <h4 className="item-title">{item.title}</h4>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="item-link-view">
                                                {item.link}
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty-state">No portfolio items added yet.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile; 