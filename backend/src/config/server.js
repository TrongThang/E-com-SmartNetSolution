const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');

const configServer = (app) => {
    // Middleware để phục vụ file tĩnh (nếu cần, ví dụ: public assets)
    app.use(express.static('./src/public'));

    // Middleware để xử lý JSON và form data
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Middleware để xử lý cookies
    app.use(cookieParser());

    // Middleware CORS để cho phép truy cập từ các domain khác
    app.use(cors({
        origin: '*', // Cho phép tất cả origin (có thể giới hạn cụ thể nếu cần)
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Middleware session để quản lý phiên người dùng
    app.use(session({
        secret: 'ddc5b6c8f8a7e3e3c4b5e6d7c8a9f1f2e3c4a5b6e7c8a9f0f1a2b3c4d5e6f7g8', // Chuỗi bí mật để mã hóa session
        resave: false,            // Không lưu lại session nếu không có thay đổi
        saveUninitialized: true,  // Lưu session ngay cả khi chưa khởi tạo
        cookie: {
            secure: false,          // Đặt thành `true` nếu dùng HTTPS
            maxAge: 24 * 60 * 60 * 1000 // Thời gian sống của cookie: 1 ngày (tùy chỉnh nếu cần)
        }
    }));
};

module.exports = configServer;