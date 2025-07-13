import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosPublic from '@/apis/clients/public.client';
import axiosIOTPublic from '@/apis/clients/iot.public.client';
import axiosPrivate from '@/apis/clients/private.client';
import { getToken } from 'firebase/messaging';
import { messaging, FIREBASE_CONFIG } from '../config/firebase';

const AuthContext = createContext();

const updateFCMTokenToServer = async (token, deviceId) => {
    console.log('token', token)
    if (!token) return;
    try {
        await axiosPrivate.put('notification/fcm-token', { deviceToken: token, deviceId: deviceId });
        console.log('FCM token updated to server');
    } catch (err) {
        console.error('Failed to update FCM token:', err);
    }
};

// Thêm hàm request notification permission
const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        console.log('Notification permission denied');
        return false;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    return permission === 'granted';
};

// Thêm hàm lấy và cập nhật FCM token
const getAndUpdateFCMToken = async (deviceId) => {
    try {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
            console.log('Notification permission not granted');
            return;
        }

        // Kiểm tra messaging có tồn tại không
        if (!messaging) {
            console.log('Firebase messaging not initialized');
            return;
        }

        const token = await getToken(messaging, {
            vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
        });

        if (token) {
            await updateFCMTokenToServer(token, deviceId);
            console.log('deviceId', deviceId)
            console.log('FCM token obtained and updated:', token);
            return token;
        } else {
            console.log('No FCM token available');
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
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

    const fetchEmployeeInfo = async (token) => {
        try {
            const employeeToken = token || localStorage.getItem('employeeToken');
            if (!employeeToken) {
                console.error('No employee token found');
                return;
            }

            const response = await axiosIOTPublic.get('auth/employee/get-me', {
                headers: {
                    Authorization: `Bearer ${employeeToken}`,
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
                    if (decoded.exp * 1000 > Date.now()) {
                        setIsAuthenticated(true);
                        await fetchUserInfo(token);

                        // Lấy FCM token sau khi đã xác thực user
                        await getAndUpdateFCMToken();
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
                        await fetchEmployeeInfo(employeeToken);

                        // Lấy FCM token cho employee
                        await getAndUpdateFCMToken();
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
            setAuthInitialized(true);
        }
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const login = async (payload) => {
        try {
            const response = await axiosIOTPublic.post('auth/login', payload);

            if (response) {
                const { accessToken, refreshToken, deviceUuid } = response;

                // Lưu token trước khi gọi API
                localStorage.setItem('authToken', accessToken);
                if (payload.rememberMe && refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken)
                }

                // Đợi một chút để đảm bảo token đã được lưu
                await new Promise(resolve => setTimeout(resolve, 100));

                setIsAuthenticated(true);
                await fetchUserInfo(accessToken);

                const deviceMap = JSON.parse(localStorage.getItem("deviceMap") || "{}");
                deviceMap[payload.username] = deviceUuid;
                localStorage.setItem("deviceMap", JSON.stringify(deviceMap));

                // Lấy FCM token sau khi đăng nhập thành công
                await getAndUpdateFCMToken(deviceUuid);
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
            const response = await axiosIOTPublic.post('auth/employee/login', {
                username,
                password,
            });

            if (response) {
                const { accessToken, refreshToken } = response;

                // Lưu token trước khi gọi API
                localStorage.setItem('employeeToken', accessToken);
                
                // Lưu refresh token nếu có
                if (refreshToken) {
                    localStorage.setItem('employeeRefreshToken', refreshToken);
                }
                
                // Đợi một chút để đảm bảo token đã được lưu
                await new Promise(resolve => setTimeout(resolve, 100));

                setIsAdminAuthenticated(true);
                await fetchEmployeeInfo(accessToken);

                // Lấy FCM token sau khi đăng nhập employee thành công
                await getAndUpdateFCMToken();
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

    // Cập nhật hàm logout để xóa FCM token
    const logout = () => {
        // Xóa FCM token khỏi server trước khi logout
        axiosPrivate.delete('notification/device').catch(console.error);
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    const logoutEmployee = () => {
        // Xóa FCM token khỏi server trước khi logout
        axiosPrivate.delete('notification/device').catch(console.error);
        
        localStorage.removeItem('employeeToken');
        localStorage.removeItem('employeeRefreshToken');
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

    // Hàm refresh token
    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token found');
            }

            const response = await axiosIOTPublic.post('auth/refresh', {
                refreshToken: refreshToken
            });

            if (response && response.accessToken) {
                // Cập nhật token mới
                localStorage.setItem('authToken', response.accessToken);
                console.log('Token refreshed successfully');
                return response.accessToken;
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.error('Refresh token error:', error);
            
            // Nếu refresh token hết hạn hoặc không hợp lệ, đăng xuất người dùng
            logout();
            throw error;
        }
    };

    // Hàm refresh token cho employee
    const refreshEmployeeToken = async () => {
        try {
            const refreshToken = localStorage.getItem('employeeRefreshToken');
            if (!refreshToken) {
                throw new Error('No employee refresh token found');
            }

            const response = await axiosIOTPublic.post('auth/employee/refresh', {
                refreshToken: refreshToken
            });

            if (response && response.accessToken) {
                // Cập nhật token mới
                localStorage.setItem('employeeToken', response.accessToken);
                console.log('Employee token refreshed successfully');
                return response.accessToken;
            } else {
                throw new Error('Failed to refresh employee token');
            }
        } catch (error) {
            console.error('Refresh employee token error:', error);
            
            // Nếu refresh token hết hạn hoặc không hợp lệ, đăng xuất employee
            logoutEmployee();
            throw error;
        }
    };

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
        changePasswordEmployee,
        refreshToken,
        refreshEmployeeToken
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