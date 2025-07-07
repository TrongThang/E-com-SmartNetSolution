import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axiosPrivate from '../../apis/clients/private.client';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../../config/firebase';
import { jwtDecode } from 'jwt-decode';

const FCMTest = () => {

    const { isAuthenticated, isAdminAuthenticated, user } = useAuth();
    const [fcmToken, setFcmToken] = useState(null);
    const [permission, setPermission] = useState('default');
    const [isLoading, setIsLoading] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [error, setError] = useState(null);
    const [receivedMessages, setReceivedMessages] = useState([]);

    // Kiểm tra permission khi component mount
    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    // Test 1: Kiểm tra Firebase Messaging
    const testFirebaseMessaging = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            if (!messaging) {
                throw new Error('Firebase messaging chưa được khởi tạo');
            }
            
            addTestResult('✅ Firebase Messaging', 'Firebase messaging đã được khởi tạo thành công');
            return true;
        } catch (error) {
            addTestResult('❌ Firebase Messaging', `Lỗi: ${error.message}`);
            setError(error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Test 2: Kiểm tra Notification Permission
    const testNotificationPermission = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            if (!('Notification' in window)) {
                throw new Error('Trình duyệt này không hỗ trợ notifications');
            }

            if (Notification.permission === 'granted') {
                addTestResult('✅ Notification Permission', 'Quyền thông báo đã được cấp');
                setPermission('granted');
                return true;
            } else if (Notification.permission === 'denied') {
                addTestResult('❌ Notification Permission', 'Quyền thông báo bị từ chối');
                setPermission('denied');
                return false;
            } else {
                addTestResult('⚠️ Notification Permission', 'Quyền thông báo chưa được cấp');
                setPermission('default');
                return false;
            }
        } catch (error) {
            addTestResult('❌ Notification Permission', `Lỗi: ${error.message}`);
            setError(error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Test 3: Request Permission
    const requestPermission = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const permission = await Notification.requestPermission();
            setPermission(permission);
            
            if (permission === 'granted') {
                addTestResult('✅ Request Permission', 'Quyền thông báo đã được cấp thành công');
                return true;
            } else {
                addTestResult('❌ Request Permission', 'Quyền thông báo bị từ chối');
                return false;
            }
        } catch (error) {
            addTestResult('❌ Request Permission', `Lỗi: ${error.message}`);
            setError(error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Test 4: Lấy FCM Token
    const testGetFCMToken = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            if (!messaging) {
                throw new Error('Firebase messaging chưa được khởi tạo');
            }

            const token = await getToken(messaging, {
                vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
            });

            if (token) {
                setFcmToken(token);
                addTestResult('✅ Get FCM Token', `Token nhận được: ${token.substring(0, 20)}...`);
                return true;
            } else {
                addTestResult('❌ Get FCM Token', 'Không nhận được FCM token');
                return false;
            }
        } catch (error) {
            addTestResult('❌ Get FCM Token', `Lỗi: ${error.message}`);
            setError(error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Test 5: Cập nhật FCM Token lên Server
    const testUpdateFCMToken = async () => {
        setIsLoading(true);
        setError(null);
        
        try {   
            if (!fcmToken) {
                throw new Error('Chưa có FCM token');
            }   

            const authToken = localStorage.getItem('authToken');
            const decoded = jwtDecode(authToken);
            const deviceId = decoded.deviceId;
            console.log('decoded', decoded)

            const response = await axiosPrivate.put('notification/fcm-token', {
                deviceToken: fcmToken,
                deviceId: deviceId
            });

            if (response.success) {
                addTestResult('✅ Update FCM Token', 'FCM token đã được cập nhật lên server thành công');
                return true;
            } else {
                addTestResult('❌ Update FCM Token', `Lỗi server: ${response.message}`);
                return false;
            }
        } catch (error) {
            addTestResult('❌ Update FCM Token', `Lỗi: ${error.response?.data?.message || error.message}`);
            setError(error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Test 6: Gửi Test Notification
    const testSendNotification = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axiosPrivate.post('notification/test');

            if (response.success) {
                addTestResult('✅ Send Test Notification', 'Thông báo test đã được gửi thành công');
                return true;
            } else {
                addTestResult('❌ Send Test Notification', `Lỗi server: ${response.message}`);
                return false;
            }
        } catch (error) {
            addTestResult('❌ Send Test Notification', `Lỗi: ${error.response?.data?.message || error.message}`);
            setError(error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Test 7: Kiểm tra Service Worker
    const testServiceWorker = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration();
                
                if (registration) {
                    addTestResult('✅ Service Worker', 'Service worker đã được đăng ký');
                    return true;
                } else {
                    addTestResult('⚠️ Service Worker', 'Service worker chưa được đăng ký');
                    return false;
                }
            } else {
                addTestResult('❌ Service Worker', 'Trình duyệt không hỗ trợ service worker');
                return false;
            }
        } catch (error) {
            addTestResult('❌ Service Worker', `Lỗi: ${error.message}`);
            setError(error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Test 8: Kiểm tra VAPID Key
    const testVAPIDKey = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
            
            if (!vapidKey || vapidKey === 'your-vapid-key-here') {
                addTestResult('❌ VAPID Key', 'VAPID key chưa được cấu hình. Vui lòng tạo file .env với REACT_APP_FIREBASE_VAPID_KEY');
                return false;
            }
            
            if (vapidKey.length < 100) {
                addTestResult('❌ VAPID Key', 'VAPID key không hợp lệ (quá ngắn)');
                return false;
            }
            
            addTestResult('✅ VAPID Key', 'VAPID key đã được cấu hình');
            return true;
        } catch (error) {
            addTestResult('❌ VAPID Key', `Lỗi: ${error.message}`);
            setError(error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Test 9: Kiểm tra Foreground Message Listener
    const testForegroundListener = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            if (!messaging) {
                throw new Error('Firebase messaging chưa được khởi tạo');
            }

            // Setup foreground message listener
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Foreground message received:', payload);
                setReceivedMessages(prev => [...prev, {
                    ...payload,
                    timestamp: new Date().toLocaleTimeString()
                }]);
                
                // Show notification
                if (Notification.permission === 'granted') {
                    new Notification(payload.notification.title, {
                        body: payload.notification.body,
                        icon: '/favicon.ico',
                        data: payload.data
                    });
                }
            });

            addTestResult('✅ Foreground Listener', 'Foreground message listener đã được setup');
            
            // Cleanup function
            setTimeout(() => {
                unsubscribe();
            }, 30000); // Cleanup after 30 seconds
            
            return true;
        } catch (error) {
            addTestResult('❌ Foreground Listener', `Lỗi: ${error.message}`);
            setError(error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Chạy tất cả test
    const runAllTests = async () => {
        setTestResults([]);
        setError(null);
        
        const tests = [
            { name: 'Firebase Messaging', fn: testFirebaseMessaging },
            { name: 'VAPID Key', fn: testVAPIDKey },
            { name: 'Notification Permission', fn: testNotificationPermission },
            { name: 'Service Worker', fn: testServiceWorker },
            { name: 'Get FCM Token', fn: testGetFCMToken },
            { name: 'Update FCM Token', fn: testUpdateFCMToken },
            { name: 'Foreground Listener', fn: testForegroundListener },
            { name: 'Send Test Notification', fn: testSendNotification }
        ];

        for (const test of tests) {
            addTestResult(`🔄 ${test.name}`, 'Đang kiểm tra...');
            const result = await test.fn();
            
            if (!result && test.name === 'Notification Permission') {
                // Nếu permission chưa được cấp, thử request
                await requestPermission();
                await test.fn(); // Chạy lại test
            }
        }
    };

    // Thêm kết quả test
    const addTestResult = (test, result) => {
        setTestResults(prev => [...prev, { test, result, timestamp: new Date().toLocaleTimeString() }]);
    };

    // Xóa kết quả test
    const clearResults = () => {
        setTestResults([]);
        setError(null);
        setReceivedMessages([]);
    };

    // Xóa messages đã nhận
    const clearMessages = () => {
        setReceivedMessages([]);
    };

    if (!isAuthenticated && !isAdminAuthenticated) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">FCM Test</h3>
                <p className="text-yellow-700">Vui lòng đăng nhập để test FCM</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">FCM Connection Test</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={runAllTests}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Đang test...' : 'Chạy tất cả test'}
                    </button>
                    <button
                        onClick={clearResults}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Xóa kết quả
                    </button>
                </div>
            </div>

            {/* Thông tin trạng thái */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700">Authentication</h4>
                    <p className="text-sm text-gray-600">
                        {isAuthenticated ? '✅ User' : isAdminAuthenticated ? '✅ Employee' : '❌ Not authenticated'}
                    </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700">Notification Permission</h4>
                    <p className="text-sm text-gray-600">
                        {permission === 'granted' ? '✅ Granted' : permission === 'denied' ? '❌ Denied' : '⚠️ Default'}
                    </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700">FCM Token</h4>
                    <p className="text-sm text-gray-600">
                        {fcmToken ? `✅ ${fcmToken.substring(0, 20)}...` : '❌ Not available'}
                    </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700">VAPID Key</h4>
                    <p className="text-sm text-gray-600">
                        {process.env.REACT_APP_FIREBASE_VAPID_KEY && process.env.REACT_APP_FIREBASE_VAPID_KEY !== 'your-vapid-key-here' ? '✅ Configured' : '❌ Not configured'}
                    </p>
                </div>
            </div>

            {/* Kết quả test */}
            {testResults.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Test Results:</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {testResults.map((result, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-start justify-between">
                                    <span className="font-medium text-gray-800">{result.test}</span>
                                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{result.result}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages đã nhận */}
            {receivedMessages.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700">Received Messages:</h4>
                        <button
                            onClick={clearMessages}
                            className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {receivedMessages.map((message, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start justify-between">
                                    <span className="font-medium text-green-800">
                                        {message.notification?.title || 'No title'}
                                    </span>
                                    <span className="text-xs text-green-600">{message.timestamp}</span>
                                </div>
                                <p className="text-sm text-green-700 mt-1">
                                    {message.notification?.body || 'No body'}
                                </p>
                                {message.data && (
                                    <p className="text-xs text-green-600 mt-1">
                                        Data: {JSON.stringify(message.data)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lỗi */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Error:</h4>
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Hướng dẫn */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Hướng dẫn:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Click "Chạy tất cả test" để kiểm tra toàn bộ quá trình FCM</li>
                    <li>• Nếu permission bị từ chối, hãy cấp quyền thông báo trong trình duyệt</li>
                    <li>• Tạo file .env với REACT_APP_FIREBASE_VAPID_KEY=your-vapid-key</li>
                    <li>• Kiểm tra console để xem log chi tiết</li>
                    <li>• Messages nhận được sẽ hiển thị trong phần "Received Messages"</li>
                </ul>
            </div>
        </div>
    );
};

export default FCMTest; 