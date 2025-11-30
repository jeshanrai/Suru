import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import api from '../utils/api';
import { Send, Search, User, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import './Chat.css';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const { socket, fetchUnreadCount } = useContext(SocketContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const selectedUserId = searchParams.get('user');

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user) fetchConversations();
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', (data) => {
            if (selectedUserId && (data.sender === selectedUserId || data.receiver === selectedUserId)) {
                setMessages((prev) => [...prev, data]);

                if (data.sender === selectedUserId && data.receiver === user._id) {
                    // Mark as seen in backend - this resets the unread count
                    api.put(`/messages/seen/${data.sender}`)
                        .then(() => {
                            // Fetch count AFTER marking as seen to avoid flicker
                            fetchUnreadCount();
                        })
                        .catch(err => console.error('Error marking as seen:', err));

                    // Emit socket event to sender for blue checkmarks
                    socket.emit('mark_seen', {
                        senderId: data.sender,
                        receiverId: user._id,
                        conversationId: data.conversationId,
                    });
                }
            } else {
                // Update sidebar for messages not in current chat
                setConversations(prev =>
                    prev
                        .map(conv => {
                            if (conv.otherUser._id === data.sender) {
                                return {
                                    ...conv,
                                    lastMessage: data,
                                    unreadCount: (conv.unreadCount || 0) + 1,
                                    updatedAt: new Date(),
                                };
                            }
                            return conv;
                        })
                        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                );
                fetchUnreadCount();
            }
        });

        socket.on('message_seen', (data) => {
            if (selectedUserId && data.readerId === selectedUserId) {
                setMessages(prev =>
                    prev.map(msg =>
                        msg.sender === user._id && !msg.read
                            ? { ...msg, read: true, readAt: data.readAt }
                            : msg
                    )
                );
            }
        });

        socket.on('message_notification', (notification) => {
            // Update sidebar when notification received (user on messages page but not in this chat)
            const newMessage = notification.message;

            setConversations(prev =>
                prev
                    .map(conv => {
                        if (conv.otherUser._id === newMessage.sender) {
                            return {
                                ...conv,
                                lastMessage: newMessage,
                                unreadCount: (conv.unreadCount || 0) + 1,
                                updatedAt: new Date(),
                            };
                        }
                        return conv;
                    })
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            );
        });

        return () => {
            socket.off('receive_message');
            socket.off('message_seen');
            socket.off('message_notification');
        };
    }, [socket, selectedUserId, user, fetchUnreadCount]);

    useEffect(() => {
        if (selectedUserId) fetchUserAndMessages(selectedUserId);
        else {
            setSelectedUser(null);
            setMessages([]);
        }
    }, [selectedUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (socket && user && selectedUserId) {
            const roomId = [user._id, selectedUserId].sort().join('-');
            socket.emit('join_chat', roomId);

            return () => socket.emit('leave_chat', roomId);
        }
    }, [socket, user, selectedUserId]);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/messages/conversations');

            // Fetch profile pictures for each user
            const conversationsWithProfiles = await Promise.all(
                data.map(async (conv) => {
                    if (conv.otherUser && conv.otherUser._id) {
                        try {
                            const { data: userData } = await api.get(`/users/${conv.otherUser._id}`);
                            return {
                                ...conv,
                                otherUser: {
                                    ...conv.otherUser,
                                    profilePicture: userData.profilePicture
                                }
                            };
                        } catch (error) {
                            console.error(`Error fetching profile for user ${conv.otherUser._id}:`, error);
                            return conv;
                        }
                    }
                    return conv;
                })
            );

            setConversations(conversationsWithProfiles);
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

            await api.put(`/messages/seen/${userId}`);

            setConversations(prev =>
                prev.map(conv =>
                    conv.otherUser._id === userId ? { ...conv, unreadCount: 0 } : conv
                )
            );

            if (socket) {
                socket.emit('mark_seen', {
                    senderId: userId,
                    receiverId: user._id,
                });
            }

            fetchUnreadCount();
        } catch (error) {
            console.error('Error fetching user and messages:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const { data } = await api.post('/messages', {
                receiverId: selectedUser._id,
                content: newMessage,
            });

            const roomId = [user._id, selectedUser._id].sort().join('-');

            if (socket) {
                socket.emit('send_message', {
                    ...data,
                    room: roomId,
                    sender: user._id,
                    receiver: selectedUser._id
                });
            }

            setMessages(prev => [...prev, data]);
            setNewMessage('');

            setConversations(prev =>
                prev.map(conv =>
                    conv.otherUser._id === selectedUser._id
                        ? { ...conv, lastMessage: data, updatedAt: new Date() }
                        : conv
                )
            );
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSelectConversation = (userId) => {
        navigate(`/chat?user=${userId}`);
    };

    const handleBackToConversations = () => {
        navigate('/chat');
    };

    const filteredConversations = conversations.filter(conv =>
        conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (dateString) =>
        new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="chat-page">
            <div className={`chat-sidebar ${selectedUserId ? 'mobile-hidden' : 'mobile-show'}`}>
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
                                className={`conversation-item ${selectedUserId === conv.otherUser._id ? 'active' : ''}`}
                                onClick={() => handleSelectConversation(conv.otherUser._id)}
                            >
                                <div className="conversation-avatar">
                                    {conv.otherUser.profilePicture ? (
                                        <img
                                            src={conv.otherUser.profilePicture}
                                            alt={conv.otherUser.name}
                                        />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {conv.otherUser.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>


                                <div className="conversation-info">
                                    <div className="conversation-top">
                                        <h4>{conv.otherUser.name}</h4>
                                        {conv.lastMessage && (
                                            <span className="conversation-time">
                                                {formatTime(conv.lastMessage.createdAt)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="conversation-bottom">
                                        <p className={`conversation-preview ${conv.unreadCount > 0 ? 'unread' : ''}`}>
                                            {conv.lastMessage ? (
                                                <>
                                                    {conv.lastMessage.sender === user._id && 'You: '}
                                                    {conv.lastMessage.content.substring(0, 30)}
                                                    {conv.lastMessage.content.length > 30 && '...'}
                                                </>
                                            ) : (
                                                'Start a conversation'
                                            )}
                                        </p>

                                        {conv.unreadCount > 0 && (
                                            <span className="unread-badge">{conv.unreadCount}</span>
                                        )}
                                    </div>
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

            <div className={`chat-area ${!selectedUserId ? 'mobile-hidden' : 'mobile-show'}`}>
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <button className="back-btn mobile-only" onClick={handleBackToConversations}>
                                <ArrowLeft size={24} />
                            </button>

                            <div className="chat-user-info">
                                <div className="chat-avatar">
                                    {selectedUser.profilePicture ? (
                                        <img src={selectedUser.profilePicture} alt={selectedUser.name} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {selectedUser.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3>{selectedUser.name}</h3>
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
                                            <div className="message-meta">
                                                <span className="message-time">
                                                    {formatTime(msg.createdAt)}
                                                </span>
                                                {(msg.sender === user._id || msg.sender?._id === user._id) && (
                                                    <span className="message-status">
                                                        {msg.read ? (
                                                            <CheckCheck size={14} className="read" />
                                                        ) : (
                                                            <Check size={14} className="delivered" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
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
