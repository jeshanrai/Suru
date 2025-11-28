import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, MessageSquare, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    // Placeholder for user profile picture
    const profilePic = user?.profilePicture || '/images/default-profile.png';

    // The links that will be inside the hamburger menu on mobile
    const toggledLinks = (
        <ul className={`navbar-mobile-toggled ${isOpen ? 'active' : ''}`}>
            <li><Link to="/startups" onClick={toggleMenu}>Browse Startups</Link></li>
            {user && (
                <>
                    <li><Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link></li>
                    {/* Logout moved inside the mobile-toggled menu */}
                    <li className="user-menu mobile-only" onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                    </li>
                </>
            )}
            {!user && (
                <>
                    <li><Link to="/login" className="btn btn-outline" onClick={toggleMenu}>Login</Link></li>
                    <li><Link to="/register" className="btn btn-primary" onClick={toggleMenu}>Get Started</Link></li>
                </>
            )}
        </ul>
    );

    // The icons/buttons that remain visible on mobile
    const iconLinks = (
        <ul className="navbar-links-right">
            {user ? (
                <>
                    {/* Message Icon - Visible on desktop AND mobile */}
                    <li className="navbar-icon-link-container">
                        <Link to="/chat" className="navbar-icon-link" aria-label="Messages">
                            <MessageSquare size={20} />
                        </Link>
                    </li>

                    {/* Profile Link - Visible on desktop AND mobile */}
                    <li className="navbar-profile-container">
                        <Link to="/profile" className="navbar-profile-link" aria-label="Profile">
                            <img
                                src={profilePic}
                                alt="Profile"
                                className="navbar-profile-pic"
                            />
                        </Link>
                    </li>

                    {/* Logout remains here for desktop view only */}
                    <li className="user-menu desktop-only" onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                    </li>
                </>
            ) : (
                // Auth buttons remain here for desktop view only
                <>
                    <li className="desktop-only"><Link to="/login" className="btn btn-outline" onClick={() => setIsOpen(false)}>Login</Link></li>
                    <li className="desktop-only"><Link to="/register" className="btn btn-primary" onClick={() => setIsOpen(false)}>Get Started</Link></li>
                </>
            )}
        </ul>
    );

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
                    <img src="/images/web_logo.png" alt="StartUp Connect" className="logo-image" />
                    <span className="logo-text">SuRu</span>
                </Link>

                {/* Desktop-only: Primary Navigation */}
                <ul className="navbar-links-left desktop-only">
                    <li><Link to="/startups">Browse Startups</Link></li>
                    {user && (
                        <li><Link to="/dashboard">Dashboard</Link></li>
                    )}
                </ul>

                {/* Right Side Icons (Always visible) */}
                {iconLinks}

                {/* Mobile Menu Button */}
                <div className="mobile-menu-btn" onClick={toggleMenu}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </div>

                {/* Mobile Toggled Links (Hamburger Content) */}
                {toggledLinks}
            </div>
        </nav>
    );
};

export default Navbar;