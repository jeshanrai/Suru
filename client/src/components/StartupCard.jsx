import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import './StartupCard.css';

const StartupCard = memo(({ startup }) => {
    const {
        _id,
        title,
        category,
        description,
        location,
        status,
        skillsRequired,
        createdAt,
        founderName,
        logoUrl
    } = startup;

    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'hiring': return 'status-hiring';
            case 'raising funds': return 'status-raising';
            case 'seeking cofounder': return 'status-seeking';
            default: return 'status-default';
        }
    };

    return (
        <div className="startup-card card">
            <div className="startup-card-header-row">
                <div className="startup-logo-container">
                    {(logoUrl || startup.founder?.profilePicture) ? (
                        <img
                            src={logoUrl || startup.founder?.profilePicture}
                            alt={title}
                            className="startup-logo"
                        />
                    ) : startup.founder?.name ? (
                        <div className="startup-logo-placeholder">
                            {startup.founder.name.charAt(0).toUpperCase()}
                        </div>
                    ) : null}
                </div>

                <div className="startup-title-section">
                    <Link to={`/startups/${_id}`}>
                        <h3 className="startup-title">{title || "Untitled Startup"}</h3>
                    </Link>
                    <div className="startup-header">
                        <span className="category-tag">{category || "General"}</span>
                        <span className="date">{formattedDate}</span>
                    </div>
                </div>
            </div>

            <p className="startup-description">
                {description || "No description available."}
            </p>

            <div className="startup-meta">
                <div className="meta-item">
                    <MapPin size={16} />
                    <span>{location || "Remote"}</span>
                </div>

                <div className="meta-item">
                    <span className={`status-badge ${getStatusClass(status)}`}>
                        {status || "Open"}
                    </span>
                </div>
            </div>

            {founderName && (
                <div className="meta-item founder-info">
                    <Users size={16} />
                    <span>{founderName}</span>
                </div>
            )}

            <div className="startup-tags">
                {skillsRequired?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                ))}

                {skillsRequired?.length > 3 && (
                    <span className="skill-tag">
                        +{skillsRequired.length - 3}
                    </span>
                )}
            </div>

            <Link to={`/startups/${_id}`} className="btn btn-outline full-width">
                View Details
            </Link>
        </div>
    );
});

StartupCard.displayName = "StartupCard";

export default StartupCard;