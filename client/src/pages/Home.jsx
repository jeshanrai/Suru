import React from 'react';

const Home = () => {
    return (
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h1>Find the Perfect Partner to Build Your Dream Startup</h1>
            <p style={{ margin: '1rem 0 2rem', fontSize: '1.2rem', color: 'var(--text-light)' }}>
                Connect with founders, investors, and skilled professionals.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <a href="/register" className="btn btn-primary">Post Your Startup</a>
                <a href="/startups" className="btn btn-outline">Find a Startup</a>
            </div>
        </div>
    );
};

export default Home;
