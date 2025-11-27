import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import io from 'socket.io-client';
import { Send, Search, User } from 'lucide-react';
import './Chat.css';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const selectedUserId = searchParams.get('user');

    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    useEffect(() => {
        if (selectedUserId) {
            fetchUserAndMessages(selectedUserId);
        }
    }, [selectedUserId]);

    useEffect(() => {
        if (socket && user && selectedUserId) {
            const roomId = [user._id, selectedUserId].sort().join('-');
            socket.emit('join_chat', roomId);

            socket.on('receive_message', (data) => {
                if (data.sender === selectedUserId || data.receiver === selectedUserId) {
                    setMessages((prev) => [...prev, data]);
                }
            });

            return () => {
                socket.off('receive_message');
            };
        }
    }, [socket, user, selectedUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            // Fetch all accepted applications to get conversation partners
            const { data: myApps } = await api.get('/applications/my');
            const acceptedApps = myApps.filter(app => app.status === 'accepted');

            // Get unique users from accepted applications
            const conversationUsers = acceptedApps.map(app => ({
                _id: app.startup?.founder,
                name: 'Founder', // Will be updated when we fetch user details
                role: 'founder'
            }));

            // If user is founder, get accepted applicants
            if (user.role === 'founder') {
                const { data: startups } = await api.get(`/startups?founder=${user._id}`);
                if (startups.length > 0) {
                    const allApps = await Promise.all(
                        startups.map(startup => api.get(`/applications/startup/${startup._id}`))
                    );
                    const acceptedApplicants = allApps.flatMap(res =>
                        res.data.filter(app => app.status === 'accepted').map(app => app.applicant)
                    );
                    conversationUsers.push(...acceptedApplicants);
                }
            }

            // Remove duplicates and fetch full user details
            const uniqueUsers = Array.from(new Map(conversationUsers.map(u => [u._id, u])).values());
            setConversations(uniqueUsers.filter(u => u._id));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setLoading(false);
        }
    };

    const fetchUserAndMessages = async (userId) => {
        try {
            const { data: userData } = await api.get(`/users/${userId}`);
            setSelectedUser(userData);

            const { data: messagesData } = await api.get(`/messages/${userId}`);
            setMessages(messagesData);
        } catch (error) {
            console.error('Error fetching user and messages:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUserId) return;

        try {
            const messageData = {
                receiverId: selectedUserId,
                content: newMessage
            };

            const { data } = await api.post('/messages', messageData);

            const roomId = [user._id, selectedUserId].sort().join('-');
            socket.emit('send_message', {
                room: roomId,
                sender: user._id,
                receiver: selectedUserId,
                content: newMessage,
                createdAt: new Date()
            });

            setMessages([...messages, data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSelectConversation = (userId) => {
        navigate(`/chat?user=${userId}`);
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="chat-page">
            {/* Sidebar */}
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <h2>Messages</h2>
                </div>
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="conversations-list">
                    {loading ? (
                        <div className="loading-conversations">Loading...</div>
                    ) : filteredConversations.length > 0 ? (
                        filteredConversations.map((conv) => (
                            <div
                                key={conv._id}
                                className={`conversation-item ${selectedUserId === conv._id ? 'active' : ''}`}
                                onClick={() => handleSelectConversation(conv._id)}
                            >
                                <div className="conversation-avatar">
                                    {conv.name?.charAt(0).toUpperCase() || <User size={20} />}
                                </div>
                                <div className="conversation-info">
                                    <h4>{conv.name || 'User'}</h4>
                                    <p className="conversation-role">{conv.role}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-conversations">
                            <p>No conversations yet</p>
                            <small>Accept applications to start chatting</small>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="chat-area">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-user-info">
                                <div className="chat-avatar">
                                    {selectedUser.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3>{selectedUser.name}</h3>
                                    <p className="user-role">{selectedUser.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {messages.length === 0 ? (
                                <div className="no-messages">
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`message ${msg.sender === user._id || msg.sender?._id === user._id ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-content">
                                            <p>{msg.content}</p>
                                            <span className="message-time">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-form" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="chat-input"
                            />
                            <button type="submit" className="btn btn-primary send-btn">
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <User size={64} />
                        <h3>Select a conversation</h3>
                        <p>Choose a conversation from the sidebar to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
