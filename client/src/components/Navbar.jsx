import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
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

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    StartUp<span>Connect</span>
                </Link>

                <div className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </div>

                <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    <li><Link to="/startups">Browse Startups</Link></li>
                    {user ? (
                        <>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/chat">Messages</Link></li>
                            <li><Link to="/profile">Profile</Link></li>
                            <li className="user-menu" onClick={handleLogout}>
                                <LogOut size={18} /> Logout
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login" className="btn btn-outline">Login</Link></li>
                            <li><Link to="/register" className="btn btn-primary">Get Started</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
