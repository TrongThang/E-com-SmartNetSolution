import { useState, useEffect, useCallback } from 'react';
import { messaging, getToken, onMessage } from '../config/firebase';
import { useAuth } from './useAuth';
import axiosPrivate from '../apis/clients/private.client';

export const useFCM = () => {
    // States
    const [fcmToken, setFcmToken] = useState(null);
    const [permission, setPermission] = useState('default');
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);

    // Hooks
    const { user, isAuthenticated } = useAuth();

    // ===== CORE FCM FUNCTIONS =====

    /**
     * Request notification permission
     */
    const requestPermission = useCallback(async () => {
        try {
            setError(null);

            if (!('Notification' in window)) {
                throw new Error('Trình duyệt này không hỗ trợ thông báo');
            }

            const permission = await Notification.requestPermission();
            setPermission(permission);

            if (permission === 'granted') {
                console.log('Notification permission granted');
                return true;
            } else if (permission === 'denied') {
                throw new Error('Quyền thông báo bị từ chối');
            } else {
                throw new Error('Quyền thông báo chưa được cấp');
            }
        } catch (error) {
            console.error('Error requesting permission:', error);
            setError(error.message);
            return false;
        }
    }, []);

    /**
     * Get FCM token from Firebase
     */
    const getFCMToken = useCallback(async () => {
        try {
            if (!messaging) {
                throw new Error('Firebase messaging chưa được khởi tạo');
            }

            const token = await getToken(messaging, {
                vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
            });

            if (token) {
                console.log('FCM Token received:', token.substring(0, 20) + '...');
                setFcmToken(token);
                return token;
            } else {
                throw new Error('Không nhận được FCM token');
            }
        } catch (error) {
            console.error('Error getting FCM token:', error);
            setError(error.message);
            return null;
        }
    }, []);

    /**
     * Update FCM token on server
     */
    const updateFCMToken = useCallback(async (token) => {
        try {
            const result = await axiosPrivate.put('/notification/fcm-token', {
                fcm_token: token
            });

            if (result.success) {
                console.log('FCM token updated successfully');
                return true;
            } else {
                throw new Error(result.message || 'Cập nhật FCM token thất bại');
            }
        } catch (error) {
            console.error('Error updating FCM token:', error);
            setError(error.message || 'Cập nhật FCM token thất bại');
            return false;
        }
    }, []);

    /**
     * Delete device
     */
    const deleteDevice = useCallback(async () => {
        try {
            const result = await axiosPrivate.delete('/notification/device');

            if (result.success) {
                console.log('Device deleted successfully');
                setFcmToken(null);
                return true;
            } else {
                throw new Error(result.message || 'Xóa thiết bị thất bại');
            }
        } catch (error) {
            console.error('Error deleting device:', error);
            setError(error.message || 'Xóa thiết bị thất bại');
            return false;
        }
    }, []);

    /**
     * Send test notification
     */
    const sendTestNotification = useCallback(async () => {
        try {
            const result = await axiosPrivate.post('/notification/test');

            if (result.success) {
                console.log('Test notification sent successfully');
                return true;
            } else {
                throw new Error(result.message || 'Gửi thông báo test thất bại');
            }
        } catch (error) {
            console.error('Error sending test notification:', error);
            setError(error.message || 'Gửi thông báo test thất bại');
            return false;
        }
    }, []);

    // ===== INITIALIZATION =====

    /**
     * Initialize FCM
     */
    const initializeFCM = useCallback(async () => {
        if (!isAuthenticated || isInitialized) return;

        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Request permission
            const permissionGranted = await requestPermission();
            if (!permissionGranted) {
                setIsLoading(false);
                return;
            }

            // Step 2: Get FCM token
            const token = await getFCMToken();
            if (!token) {
                setIsLoading(false);
                return;
            }

            // Step 3: Update token on server
            const success = await updateFCMToken(token);
            if (!success) {
                setIsLoading(false);
                return;
            }

            setIsInitialized(true);
            console.log('FCM initialized successfully');

        } catch (error) {
            console.error('Error initializing FCM:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, isInitialized, requestPermission, getFCMToken, updateFCMToken]);

    // ===== TOKEN REFRESH HANDLING =====

    /**
     * Handle token refresh
     */
    const handleTokenRefresh = useCallback(async () => {
        console.log('FCM token refresh triggered');

        try {
            const newToken = await getFCMToken();
            if (newToken) {
                await updateFCMToken(newToken);
            }
        } catch (error) {
            console.error('Error handling token refresh:', error);
            setError(error.message);
        }
    }, [getFCMToken, updateFCMToken]);

    // ===== FOREGROUND MESSAGE HANDLING =====

    /**
     * Handle foreground messages
     */
    const handleForegroundMessage = useCallback((payload) => {
        console.log('Foreground message received:', payload);

        // Show notification if app is in foreground
        if (Notification.permission === 'granted') {
            const notification = new Notification(payload.notification.title, {
                body: payload.notification.body,
                icon: '/logo192.png',
                badge: '/badge.png',
                data: payload.data,
                actions: [
                    {
                        action: 'view',
                        title: 'Xem chi tiết'
                    },
                    {
                        action: 'dismiss',
                        title: 'Đóng'
                    }
                ],
                requireInteraction: true
            });

            // Handle notification click
            notification.onclick = (event) => {
                event.preventDefault();
                notification.close();

                if (event.action === 'view') {
                    const { type, order_id, ...data } = payload.data;

                    switch (type) {
                        case 'new_order':
                            window.location.href = `/admin/orders/${order_id}`;
                            break;
                        case 'order_update':
                            window.location.href = `/admin/orders/${order_id}`;
                            break;
                        default:
                            window.location.href = '/admin/dashboard';
                    }
                }
            };

            // Auto close after 10 seconds
            setTimeout(() => {
                notification.close();
            }, 10000);
        }

        // Emit custom event for other components to listen
        window.dispatchEvent(new CustomEvent('fcm-message', {
            detail: payload
        }));
    }, []);

    // ===== EFFECTS =====

    // Initialize FCM when user is authenticated
    useEffect(() => {
        if (isAuthenticated && !isInitialized) {
            initializeFCM();
        }
    }, [isAuthenticated, isInitialized, initializeFCM]);

    // Setup token refresh listener
    useEffect(() => {
        if (!messaging || !isInitialized) return;

        const unsubscribe = messaging.onTokenRefresh(() => {
            console.log('FCM token refresh event received');
            handleTokenRefresh();
        });

        return () => unsubscribe();
    }, [messaging, isInitialized, handleTokenRefresh]);

    // Setup foreground message listener
    useEffect(() => {
        if (!messaging || !isInitialized) return;

        const unsubscribe = onMessage(messaging, handleForegroundMessage);

        return () => unsubscribe();
    }, [messaging, isInitialized, handleForegroundMessage]);

    // ===== RETURN VALUES =====

    return {
        // States
        fcmToken,
        permission,
        isLoading,
        isInitialized,
        error,

        // Functions
        requestPermission,
        getFCMToken,
        updateFCMToken,
        deleteDevice,
        sendTestNotification,
        initializeFCM,

        // Utility
        isSupported: 'Notification' in window,
        isGranted: permission === 'granted',
        isDenied: permission === 'denied',
        hasToken: !!fcmToken
    };
};