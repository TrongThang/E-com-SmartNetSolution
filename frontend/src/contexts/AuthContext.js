import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosPublic from '@/apis/clients/public.client';
import axiosIOTPublic from '@/apis/clients/iot.private.client';
import axiosPrivate from '@/apis/clients/private.client';
import { getToken } from 'firebase/messaging';
import { messaging } from '../config/firebase';

const AuthContext = createContext();

const updateFCMTokenToServer = async (token) => {
    if (!token) return;
    try {
        await axiosPrivate.put('auth/update-fcm-token', { deviceToken: token });
        console.log('FCM token updated to server');
    } catch (err) {
        console.error('Failed to update FCM token:', err);
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [authInitialized, setAuthInitialized] = useState(false);

    const fetchUserInfo = async (token) => {
        try {
            const response = await axiosPublic.get('auth/getme', {
                headers: {
                    Authorization: `BEARER ${token}`,
                },
            });
            
            if (response.status_code === 200) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const fetchEmployeeInfo = async () => {
        try {
            const token = localStorage.getItem('employeeToken');
            const response = await axiosIOTPublic.get('auth/employee/get-me', { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.success) {
                console.log('response Employee', response)
                setEmployee(response.data);
            }
        } catch (error) {
            console.error('Error fetching employee info:', error);
        }
    }

        // Hàm khởi tạo authentication
        const initializeAuth = async () => {
            setLoading(true);
            
            try {
                // Kiểm tra user token
                const token = localStorage.getItem('authToken');
                if (token) {
                    try {
                        const decoded = jwtDecode(token);
                        console.log('decoded', decoded)
                        if (decoded.exp * 1000 > Date.now()) {
                            setIsAuthenticated(true);
                            await fetchUserInfo(token);
                        } else {
                            localStorage.removeItem('authToken');
                        }
                    } catch (error) {
                        console.error('Error decoding user token:', error);
                        localStorage.removeItem('authToken');
                    }
                }
    
                // Kiểm tra employee token
                const employeeToken = localStorage.getItem('employeeToken');
                if (employeeToken) {
                    try {
                        const decoded = jwtDecode(employeeToken);
                        if (decoded.exp * 1000 > Date.now()) {
                            setIsAdminAuthenticated(true);
                            await fetchEmployeeInfo();
                        } else {
                            localStorage.removeItem('employeeToken');
                        }
                    } catch (error) {
                        console.error('Error decoding employee token:', error);
                        localStorage.removeItem('employeeToken');
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setLoading(false);
                setAuthInitialized(true); // Đánh dấu đã khởi tạo xong
            }
        };
    
        useEffect(() => {
            initializeAuth();
        }, []);

    const login = async (username, password) => {
        try {
            const response = await axiosPublic.post('auth/login', {
                username,
                password
            });
            
            if (response.status_code === 200) {
                const token = response.data.accessToken;
                localStorage.setItem('authToken', token);

                const decoded = jwtDecode(token);
                setUser(decoded);
                setIsAuthenticated(true);
                
                // === LẤY FCM TOKEN VÀ UPDATE LÊN SERVER ===
                // if (window.Notification && window.Notification.permission === 'granted') {
                //     // Nếu đã granted thì lấy luôn
                //     getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY })
                //         .then(updateFCMTokenToServer)
                //         .catch(console.error);
                // } else if (window.Notification) {
                //     // Nếu chưa granted thì request permission
                //     Notification.requestPermission().then(permission => {
                //         if (permission === 'granted') {
                //             getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY })
                //                 .then(updateFCMTokenToServer)
                //                 .catch(console.error);
                //         }
                //     });
                // }
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
            // const response = await axiosPublic.post('auth/login-employee', {
            //     username,
            //     password,
            // });
            const response = await axiosIOTPublic.post('auth/employee/login', {
                username,
                password,
            });

            if (response) {
                const token = response.accessToken;
                
                localStorage.setItem('employeeToken', token);
                setIsAdminAuthenticated(true);
                fetchEmployeeInfo();
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
            console.log('userData', userData)
            const response = await axiosPublic.post('auth/register', userData);

            if (response.status_code === 200) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.errors[0].message || 'Đăng ký thất bại'
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

    const logoutEmployee = () => {
        localStorage.removeItem('employeeToken');
        setEmployee(null);
        setIsAdminAuthenticated(false);
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
            const response = await axiosPrivate.patch('auth/account/changed-password', { email, newPassword, confirmPassword });
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

    const changePasswordEmployee = async (currentPassword, newPassword, confirmPassword) => {

        try {
            const response = await axiosIOTPublic.patch('auth/employee/change-password', { currentPassword, newPassword, confirmPassword });
            if (response.status_code === 200) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.message || 'Đổi mật khẩu thất bại'
                };
            }
        } catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
            };
        }
    }

    const value = {
        user,
        employee,
        isAuthenticated,
        isAdminAuthenticated,
        loading,
        login,
        loginEmployee,
        register,
        logout,
        logoutEmployee,
        sendOtp,
        verifyOtp,
        changePassword,
        fetchEmployeeInfo,
        changePasswordEmployee
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