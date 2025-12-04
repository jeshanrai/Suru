import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
    };

    const register = async (name, email, password, role) => {
        const { data } = await api.post('/auth/register', { name, email, password, role });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
    };

    const googleLogin = async (token) => {
        const { data } = await api.post('/auth/google', { token });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const updateUser = (updatedUserData) => {
        localStorage.setItem('userInfo', JSON.stringify(updatedUserData));
        setUser(updatedUserData);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
