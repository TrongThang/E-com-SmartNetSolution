# VAPID Key Setup Guide

## Bước 1: Lấy VAPID Key từ Firebase Console

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project của bạn
3. Vào **Project Settings** (⚙️ icon)
4. Tab **Cloud Messaging**
5. Scroll xuống phần **Web Push certificates**
6. Click **Generate Key Pair**
7. Copy **Key pair** (VAPID key)

## Bước 2: Tạo file .env

Tạo file `.env` trong thư mục `frontend`:

```env
REACT_APP_FIREBASE_VAPID_KEY=your-actual-vapid-key-here
```

## Bước 3: Restart Development Server

```bash
npm start
```

## Bước 4: Test FCM

1. Đăng nhập vào ứng dụng
2. Truy cập trang FCM Test
3. Click "Chạy tất cả test"
4. Kiểm tra kết quả

## Troubleshooting

- **VAPID key không hợp lệ**: Đảm bảo key có độ dài >100 ký tự
- **Permission denied**: Cấp quyền thông báo trong trình duyệt
- **Service worker lỗi**: Kiểm tra file `firebase-messaging-sw.js` 