import React from 'react';
import './LoadingFallback.css';

const LoadingFallback = () => {
    return (
        <div className="loading-fallback">
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        </div>
    );
};

export default LoadingFallback;
