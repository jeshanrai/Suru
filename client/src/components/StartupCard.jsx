import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Users } from 'lucide-react';
import './StartupCard.css';

const StartupCard = memo(({ startup }) => {
    return (
        <div className="startup-card card">
            <div className="startup-header">
                <span className="category-tag">{startup.category}</span>
                <span className="date">{new Date(startup.createdAt).toLocaleDateString()}</span>
            </div>
            <Link to={`/startups/${startup._id}`}>
                <h3 className="startup-title">{startup.title}</h3>
            </Link>
            <p className="startup-description">{startup.description.substring(0, 100)}...</p>

            <div className="startup-meta">
                <div className="meta-item">
                    <MapPin size={16} />
                    <span>{startup.location || 'Remote'}</span>
                </div>
                <div className="meta-item">
                    <DollarSign size={16} />
                    <span>${startup.investmentNeeded?.toLocaleString()}</span>
                </div>
            </div>

            <div className="startup-tags">
                {startup.skillsRequired?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                ))}
                {startup.skillsRequired?.length > 3 && (
                    <span className="skill-tag">+{startup.skillsRequired.length - 3}</span>
                )}
            </div>

            <Link to={`/startups/${startup._id}`} className="btn btn-outline full-width">
                View Details
            </Link>
        </div>
    );
});

StartupCard.displayName = 'StartupCard';

export default StartupCard;
