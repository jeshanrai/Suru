import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Camera, Plus, X, ArrowRight } from 'lucide-react';
import './FirstTimeSetup.css';

const FirstTimeSetup = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [profilePicture, setProfilePicture] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [bio, setBio] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [skills, setSkills] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
                setPreviewUrl(reader.result);
                setError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleSkip = () => {
        if (currentStep === 1) {
            setCurrentStep(2); // Skip photo, go to bio
        } else if (currentStep === 2) {
            setCurrentStep(3); // Skip bio, go to skills
        } else if (currentStep === 3) {
            navigate('/dashboard'); // Skip skills, go to dashboard
        }
    };

    const handleNext = () => {
        if (currentStep === 1) {
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (!bio.trim()) {
                setError('Please enter a bio to continue');
                return;
            }
            setError('');
            setCurrentStep(3);
        }
    };

    const handleBack = () => {
        setError('');
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (skills.length === 0) {
            setError('Please add at least one skill');
            return;
        }

        setLoading(true);

        try {
            const { data } = await api.post('/users/complete-profile', {
                profilePicture,
                bio: bio.trim(),
                skills
            });

            updateUser(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to complete profile');
            setLoading(false);
        }
    };

    return (
        <div className="setup-container">
            <div className="setup-card">
                {/* Header */}
                <div className="setup-header">
                    <h1>Welcome to Startup Connect</h1>
                    <p>Complete your profile to get the most out of your experience</p>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Photo</div>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Bio</div>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <div className="step-label">Skills</div>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {/* Step 1: Profile Picture */}
                {currentStep === 1 && (
                    <div className="step-content">
                        <h2>Add a profile photo</h2>
                        <p className="step-description">Help people recognize you</p>

                        <div className="profile-upload-center">
                            <div className="profile-preview-large">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Profile preview" />
                                ) : (
                                    <div className="preview-placeholder-large">
                                        <Camera size={60} />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                id="profile-picture"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="profile-picture" className="upload-btn-large">
                                <Camera size={20} />
                                {previewUrl ? 'Change Photo' : 'Upload Photo'}
                            </label>
                        </div>

                        <div className="step-actions">
                            <button type="button" onClick={handleSkip} className="btn-skip">
                                Skip
                            </button>
                            <button type="button" onClick={handleNext} className="btn-next">
                                Next <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Bio */}
                {currentStep === 2 && (
                    <div className="step-content">
                        <h2>Tell us about yourself</h2>
                        <p className="step-description">Share your interests and what you're looking for</p>

                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="I'm a passionate developer interested in building innovative startups..."
                            maxLength={500}
                            rows={6}
                            className="bio-input"
                        />
                        <div className="char-counter">
                            {bio.length}/500 characters
                        </div>

                        <div className="step-actions">
                            <button type="button" onClick={handleBack} className="btn-back">
                                Back
                            </button>
                            <button type="button" onClick={handleSkip} className="btn-skip">
                                Skip
                            </button>
                            <button type="button" onClick={handleNext} className="btn-next">
                                Next <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Skills */}
                {currentStep === 3 && (
                    <div className="step-content">
                        <h2>Add your skills</h2>
                        <p className="step-description">Let others know what you're good at</p>

                        <div className="skills-input-wrapper">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddSkill(e);
                                    }
                                }}
                                placeholder="e.g., React, Node.js, UI/UX Design"
                                className="skill-input"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="add-skill-btn-inline"
                                disabled={!skillInput.trim()}
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="skills-tags-wrapper">
                            {skills.map((skill, index) => (
                                <span key={index} className="skill-tag-modern">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="remove-skill-modern"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>

                        {skills.length === 0 && (
                            <p className="hint-text-center">Add at least one skill to complete your profile</p>
                        )}

                        <div className="step-actions">
                            <button type="button" onClick={handleBack} className="btn-back">
                                Back
                            </button>
                            <button type="button" onClick={handleSkip} className="btn-skip">
                                Skip
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="btn-finish"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Finish'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FirstTimeSetup;
