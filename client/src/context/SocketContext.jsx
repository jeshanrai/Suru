import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import api from '../utils/api';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
            const newSocket = io(SOCKET_URL);

            newSocket.emit('setup', user);
            newSocket.on('connected', () => console.log('Socket connected'));

            newSocket.on('message_notification', () => {
                fetchUnreadCount();
            });

            setSocket(newSocket);

            // Fetch initial unread count
            fetchUnreadCount();

            return () => {
                newSocket.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const { data } = await api.get('/messages/unread/count');
            setUnreadCount(data.count);
        } catch (error) {
            console.error("Failed to fetch unread count", error);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, unreadCount, setUnreadCount, fetchUnreadCount }}>
            {children}
        </SocketContext.Provider>
    );
};
