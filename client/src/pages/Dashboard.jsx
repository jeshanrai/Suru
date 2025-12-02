import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Briefcase, FileText, Users, CheckCircle, XCircle, Download, X } from 'lucide-react';
import StartupCard from '../components/StartupCard';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [myStartups, setMyStartups] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [receivedApplications, setReceivedApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [modal, setModal] = useState({ show: false, type: '', message: '', onConfirm: null });

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            if (user.role === 'founder') {
                const { data } = await api.get(`/startups?founder=${user._id}`);
                setMyStartups(data);

                // Fetch applications for all my startups
                if (data.length > 0) {
                    const allApps = await Promise.all(
                        data.map(startup => api.get(`/applications/startup/${startup._id}`))
                    );
                    const flatApps = allApps.flatMap(res => res.data.map(app => ({
                        ...app,
                        startupTitle: data.find(s => s._id === app.startup)?.title
                    })));
                    setReceivedApplications(flatApps);
                }
            }

            const { data: apps } = await api.get('/applications/my');
            setMyApplications(apps);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const showConfirmModal = (message, onConfirm) => {
        setModal({ show: true, type: 'confirm', message, onConfirm });
    };

    const showAlertModal = (message) => {
        setModal({ show: true, type: 'alert', message, onConfirm: null });
    };

    const closeModal = () => {
        setModal({ show: false, type: '', message: '', onConfirm: null });
    };

    const handleModalConfirm = () => {
        if (modal.onConfirm) {
            modal.onConfirm();
        }
        closeModal();
    };

    const handleApplicationStatus = async (applicationId, status, applicantName) => {
        const action = status === 'accepted' ? 'accept' : 'reject';
        const confirmMessage = `Are you sure you want to ${action} ${applicantName}'s application?`;

        showConfirmModal(confirmMessage, async () => {
            try {
                await api.put(`/applications/${applicationId}`, { status });
                // Refresh applications
                fetchData();
            } catch (error) {
                console.error('Error updating application:', error);
                showAlertModal('Failed to update application status. Please try again.');
            }
        });
    };

    const handleDownloadResume = (resume, fileName, fileType) => {
        if (!resume) return;

        // Convert Base64 to blob
        const byteCharacters = atob(resume.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: fileType });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <>
            {/* Custom Modal */}
            {modal.show && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            <X size={20} />
                        </button>
                        <div className="modal-body">
                            <p className="modal-message">{modal.message}</p>
                        </div>
                        <div className="modal-footer">
                            {modal.type === 'confirm' ? (
                                <>
                                    <button className="btn btn-outline" onClick={closeModal}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-primary" onClick={handleModalConfirm}>
                                        Confirm
                                    </button>
                                </>
                            ) : (
                                <button className="btn btn-primary" onClick={closeModal}>
                                    OK
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="page-container-dashboard">
                <div className="dashboard-header">
                    <div className="user-welcome">
                        <h1>Welcome, {user.name}</h1>
                        <p>{user.role === 'founder' ? 'Manage your startups and find partners.' : 'Find your dream startup to join.'}</p>
                    </div>
                    {user.role === 'founder' && (
                        <Link to="/startups/create" className="btn btn-primary">
                            <Plus size={18} /> Post New Startup
                        </Link>
                    )}
                </div>

                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    {user.role === 'founder' && (
                        <>
                            <button
                                className={`tab-btn ${activeTab === 'startups' ? 'active' : ''}`}
                                onClick={() => setActiveTab('startups')}
                            >
                                My Startups
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
                                onClick={() => setActiveTab('received')}
                            >
                                Applications Received ({receivedApplications.length})
                            </button>
                        </>
                    )}
                    <button
                        className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        My Applications
                    </button>
                </div>

                <div className="dashboard-content">
                    {activeTab === 'overview' && (
                        <div className="overview-grid">
                            <div className="stat-card card">
                                <div className="stat-icon"><Briefcase /></div>
                                <div className="stat-info">
                                    <h3>{user.role === 'founder' ? myStartups.length : '0'}</h3>
                                    <p>{user.role === 'founder' ? 'Active Startups' : 'Startups Joined'}</p>
                                </div>
                            </div>
                            <div className="stat-card card">
                                <div className="stat-icon"><FileText /></div>
                                <div className="stat-info">
                                    <h3>{myApplications.length}</h3>
                                    <p>Applications Sent</p>
                                </div>
                            </div>
                            {user.role === 'founder' && (
                                <div className="stat-card card">
                                    <div className="stat-icon"><Users /></div>
                                    <div className="stat-info">
                                        <h3>{receivedApplications.length}</h3>
                                        <p>Applications Received</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'startups' && user.role === 'founder' && (
                        <div className="startups-grid">
                            {myStartups.map(startup => (
                                <StartupCard key={startup._id} startup={startup} />
                            ))}
                            {myStartups.length === 0 && <p>You haven't posted any startups yet.</p>}
                        </div>
                    )}

                    {activeTab === 'received' && user.role === 'founder' && (
                        <div className="applications-list card">
                            <h2>Applications Received</h2>
                            {receivedApplications.length > 0 ? (
                                <div className="applications-table-wrapper">
                                    <table className="apps-table">
                                        <thead>
                                            <tr>
                                                <th>Applicant</th>
                                                <th>Startup</th>
                                                <th>Message</th>
                                                <th>Skills</th>
                                                <th>Resume</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {receivedApplications.map(app => (
                                                <tr key={app._id}>
                                                    <td>
                                                        <div className="applicant-info">
                                                            <strong>{app.applicant?.name}</strong>
                                                            <small>{app.applicant?.email}</small>
                                                        </div>
                                                    </td>
                                                    <td>{app.startupTitle}</td>
                                                    <td className="message-cell">{app.message || 'No message'}</td>
                                                    <td>
                                                        <div className="skills-cell">
                                                            {app.applicant?.skills?.slice(0, 2).map((skill, i) => (
                                                                <span key={i} className="skill-tag-small">{skill}</span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {app.resume ? (
                                                            <button
                                                                onClick={() => handleDownloadResume(app.resume, app.resumeFileName, app.resumeFileType)}
                                                                className="btn-download-resume"
                                                                title="Download Resume"
                                                            >
                                                                <Download size={16} />
                                                                <span>Download</span>
                                                            </button>
                                                        ) : (
                                                            <span className="no-resume">No resume</span>
                                                        )}
                                                    </td>
                                                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`status-badge ${app.status}`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {app.status === 'pending' && (
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="btn-icon btn-accept"
                                                                    onClick={() => handleApplicationStatus(app._id, 'accepted', app.applicant?.name)}
                                                                    title="Accept"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                                <button
                                                                    className="btn-icon btn-reject"
                                                                    onClick={() => handleApplicationStatus(app._id, 'rejected', app.applicant?.name)}
                                                                    title="Reject"
                                                                >
                                                                    <XCircle size={18} />
                                                                </button>
                                                            </div>
                                                        )}
                                                        {app.status === 'accepted' && (
                                                            <Link to={`/chat?user=${app.applicant._id}`} className="btn-chat">
                                                                Chat
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No applications received yet.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'applications' && (
                        <div className="applications-list card">
                            <h2>Applications Sent</h2>
                            {myApplications.length > 0 ? (
                                <table className="apps-table">
                                    <thead>
                                        <tr>
                                            <th>Startup</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myApplications.map(app => (
                                            <tr key={app._id}>
                                                <td>{app.startup?.title || 'Unknown Startup'}</td>
                                                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status-badge ${app.status}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {app.status === 'accepted' && (
                                                        <Link to={`/chat?user=${app.startup?.founder}`} className="btn-chat">
                                                            Chat with Founder
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>You haven't applied to any startups yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
