import React from 'react';
import './Loading.css';

const Loading = ({ fullScreen = false }) => {
    return (
        <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
            <div className="loading-spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export default Loading;
