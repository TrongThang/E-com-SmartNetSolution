# Service Worker Fix Guide

## Lỗi thường gặp và cách khắc phục

### 1. Lỗi 'importScripts' is not defined
**Nguyên nhân:** ESLint không nhận diện được service worker context

**Giải pháp:**
- Đã thêm `/* eslint-disable */` vào đầu file service worker
- Đã tạo file `.eslintrc.js` với cấu hình service worker

### 2. Lỗi 'firebase' is not defined
**Nguyên nhân:** Firebase chưa được load trong service worker

**Giải pháp:**
- Đảm bảo importScripts được gọi trước khi sử dụng firebase
- Kiểm tra version Firebase trong importScripts

### 3. Service Worker không hoạt động
**Nguyên nhân:** Service worker không được đăng ký đúng cách

**Giải pháp:**
1. Clear browser cache
2. Unregister service worker cũ:
   ```javascript
   // Trong browser console
   navigator.serviceWorker.getRegistrations().then(function(registrations) {
       for(let registration of registrations) {
           registration.unregister();
       }
   });
   ```
3. Reload trang

### 4. VAPID Key không hoạt động
**Nguyên nhân:** VAPID key không đúng hoặc chưa được cấu hình

**Giải pháp:**
1. Tạo file `.env` trong thư mục `frontend`
2. Thêm VAPID key:
   ```env
   REACT_APP_FIREBASE_VAPID_KEY=your-actual-vapid-key
   ```
3. Restart development server

### 5. Test Service Worker
```javascript
// Trong browser console
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(function(registration) {
            console.log('Service Worker registered:', registration);
        })
        .catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
}
```

### 6. Debug Service Worker
1. Mở Chrome DevTools
2. Vào tab Application
3. Chọn Service Workers
4. Kiểm tra status và logs

### 7. Force Update Service Worker
```javascript
// Trong browser console
navigator.serviceWorker.getRegistration().then(function(registration) {
    if (registration) {
        registration.update();
    }
});
```

## Cấu trúc file đã được tạo:
- ✅ `public/firebase-messaging-sw.js` - Service worker với eslint-disable
- ✅ `.eslintrc.js` - Cấu hình ESLint cho service worker
- ✅ `src/components/common/FCMTest.js` - Component test FCM
- ✅ `src/pages/Admin/FCMTestPage.js` - Trang demo

## Bước tiếp theo:
1. Tạo file `.env` với VAPID key
2. Restart development server
3. Test FCM bằng component FCMTest 