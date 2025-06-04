import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import axiosPublic from '@/apis/clients/public.client';
import axiosIOTPublic from '@/apis/clients/iot.private.client';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

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
                } else {
                    // Token hết hạn
                    localStorage.removeItem('authToken');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('authToken');
            }
        }

        const employeeToken = localStorage.getItem('employeeToken');
        
        if(employeeToken){
            try {
                const decoded = jwtDecode(employeeToken);
                if (decoded.exp * 1000 > Date.now()) {
                    // fetchUserInfo(decoded);
                    setIsAdminAuthenticated(true);
                    setEmployee(decoded);
                } else {
                    // Token hết hạn
                    localStorage.removeItem('employeeToken');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('employeeToken');
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
                
                const decoded = jwtDecode(token);
                
                setUser(decoded);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response?.message || response?.errors[0]?.message || 'Đăng nhập thất bại'
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

    const loginEmployee = async (username, password) => {
        try {
            const response = await axiosPublic.post('auth/login-employee', {
                username,
                password,
            });
            if (response.data.accessToken) {
                const token = response.data.accessToken;
                localStorage.setItem('employeeToken', token);
                
                const decoded = jwtDecode(token);
                console.log('decoded', decoded);
                setIsAdminAuthenticated(true);
                setEmployee(decoded);
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data?.message || response.data?.errors[0]?.message || 'Đăng nhập thất bại'
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

    const sendOtp = async (email) => {
        try {
            const response = await axiosPublic.post('auth/send-otp', { email });

            if (response.status_code === 200 || response.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Gửi OTP thất bại'
                };
            }
        } catch (error) {
            console.error('Send OTP error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi gửi OTP'
            };
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            const response = await axiosPublic.post('auth/verify-otp', { email, otp });
            if (response.status_code === 200 || response.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Xác thực OTP thất bại'
                };
            }
        } catch (error) {
            console.error('Verify OTP error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi xác thực OTP'
            };
        }
    };

    const changePassword = async (email, newPassword, confirmPassword) => {
        if (newPassword !== confirmPassword) {
            return {
                success: false,
                message: 'Mật khẩu mới và xác nhận mật khẩu không khớp'
            };
        }

        try {
            const response = await axiosIOTPublic.patch('auth/account/changed-password', { email, newPassword, confirmPassword });
            if (response.data.status_code === 200) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Đổi mật khẩu thất bại'
                };
            }
        } catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
            };
        }
    };

    const verifyOtpForChangeEmail = async (email, otp) => {
        try {
            const response = await axiosPublic.post('auth/verify-otp-change-email', { account_id: user.account_id, email, otp });
            if (response.status_code === 200 || response.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Xác thực OTP thất bại'
                };
            }
        } catch (error) {
            console.error('Verify OTP for change email error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi xác thực OTP'
            };
        }
    }

    const value = {
        user,
        isAuthenticated,
        isAdminAuthenticated,
        loading,
        login,
        loginEmployee,
        register,
        logout,
        sendOtp,
        verifyOtp,
        changePassword
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