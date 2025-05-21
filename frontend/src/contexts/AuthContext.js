import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import axiosPublic from '@/apis/clients/public.client';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // const fetchUserInfo = async (token) => {
    //     try {
    //         const response = await axios.get('http://localhost:8081/api/auth/getme', {
    //             headers: {
    //                 Authorization: `${token}`,
    //             },
    //         });
    //         if (response.data.status_code === 200) {
    //             setUser(response.data.data);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching user info:', error);
    //     }
    // };

    useEffect(() => {
        // Kiểm tra token khi component mount
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    // fetchUserInfo(decoded);
                    setIsAuthenticated(true);
                    setUser(decoded);
                    console.log('decoded', decoded)
                } else {
                    // Token hết hạn
                    localStorage.removeItem('authToken');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('authToken');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axiosPublic.post('auth/login', {
                username,
                password,
                type: "CUSTOMER"
            });

            if (response.status_code === 200) {
                const token = response.data.accessToken;
                localStorage.setItem('authToken', token);
                console.log('token', token);
                const decoded = jwtDecode(token);
                console.log('decoded', decoded);    
                setUser(decoded);
                setIsAuthenticated(true);
                return { success: true };   
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Đăng nhập thất bại'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('http://localhost:8081/api/auth/register', userData);

            if (response.data.errorCode === 0) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Đăng ký thất bại'
                };
            }
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};