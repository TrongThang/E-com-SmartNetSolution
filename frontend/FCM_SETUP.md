# Firebase Cloud Messaging (FCM) Setup Guide

## Tổng quan
Hướng dẫn cài đặt và cấu hình Firebase Cloud Messaging cho ứng dụng React.

## 1. Cài đặt Dependencies

```bash
npm install firebase
```

## 2. Cấu hình Firebase

### 2.1. Tạo project Firebase
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Thêm ứng dụng web vào project

### 2.2. Cấu hình Firebase Config
File: `src/config/firebase.js`
```javascript
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { app, messaging };
```

### 2.3. Tạo VAPID Key
1. Trong Firebase Console, vào **Project Settings**
2. Tab **Cloud Messaging**
3. Tạo **Web Push certificates**
4. Copy **Key pair** (VAPID key)

### 2.4. Cấu hình Environment Variables
File: `.env`
```env
REACT_APP_FIREBASE_VAPID_KEY=your-vapid-key-here
```

## 3. Service Worker

### 3.1. Tạo Service Worker
File: `public/firebase-messaging-sw.js`
```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    // Your Firebase config
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon.ico',
        data: payload.data
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## 4. Cấu hình Frontend

### 4.1. AuthContext Integration
File: `src/contexts/AuthContext.js`
```javascript
import { getToken } from 'firebase/messaging';
import { messaging } from '../config/firebase';

// Hàm lấy và cập nhật FCM token
const getAndUpdateFCMToken = async () => {
    try {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) return;

        const token = await getToken(messaging, {
            vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
        });

        if (token) {
            await updateFCMTokenToServer(token);
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
    }
};
```

### 4.2. Component Test
File: `src/components/common/FCMTest.js`
- Component để test toàn bộ quá trình FCM
- Kiểm tra permission, token, service worker
- Gửi test notification

## 5. Cấu hình Backend

### 5.1. API Endpoints
```javascript
// Cập nhật FCM token
PUT /notification/fcm-token
{
    "fcm_token": "token-here"
}

// Gửi test notification
POST /notification/test

// Xóa device
DELETE /notification/device
```

### 5.2. Notification Service
```javascript
// Gửi FCM notification
async sendFCMToUser(accountId, title, body, data = {}) {
    // Implementation
}
```

## 6. Testing

### 6.1. Sử dụng FCMTest Component
1. Import component vào trang admin
2. Click "Chạy tất cả test"
3. Kiểm tra kết quả từng bước

### 6.2. Manual Testing
```javascript
// Test trong console
import { getToken } from 'firebase/messaging';
import { messaging } from './config/firebase';

getToken(messaging, {
    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
}).then(token => {
    console.log('FCM Token:', token);
});
```

## 7. Troubleshooting

### 7.1. Common Issues

**VAPID Key Error:**
- Kiểm tra VAPID key đã được cấu hình đúng
- Đảm bảo key có độ dài hợp lệ (>100 ký tự)

**Permission Denied:**
- Kiểm tra quyền thông báo trong trình duyệt
- Request permission lại nếu cần

**Service Worker Not Found:**
- Kiểm tra file `firebase-messaging-sw.js` trong thư mục `public`
- Đảm bảo file được serve đúng cách

**Token Not Generated:**
- Kiểm tra Firebase config
- Kiểm tra VAPID key
- Kiểm tra console errors

### 7.2. Debug Steps
1. Mở Developer Tools
2. Kiểm tra Console tab
3. Kiểm tra Application > Service Workers
4. Kiểm tra Network tab cho API calls

## 8. Production Checklist

- [ ] VAPID key được cấu hình
- [ ] Service worker được deploy
- [ ] Firebase config đúng
- [ ] API endpoints hoạt động
- [ ] Test notifications thành công
- [ ] Background notifications hoạt động
- [ ] Error handling đầy đủ

## 9. Security Considerations

- Không expose VAPID key trong client code
- Validate FCM tokens trên server
- Implement rate limiting cho API calls
- Log và monitor FCM usage

## 10. Performance Tips

- Cache FCM token locally
- Implement token refresh logic
- Batch notification sends
- Monitor delivery rates

---

**Lưu ý:** Đảm bảo test kỹ lưỡng trước khi deploy lên production! 