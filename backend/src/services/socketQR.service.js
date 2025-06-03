// backend/src/socket/index.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:3001"],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Middleware xác thực
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.roomCode = decoded.roomCode;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        const roomCode = socket.roomCode;
        
        // Join room
        socket.join(roomCode);

        // Xử lý khi mobile kết nối
        socket.on('mobile_connect', (data) => {
            // Thông báo cho FE biết mobile đã kết nối
            io.to(roomCode).emit('mobile_connected', {
                deviceInfo: data.deviceInfo,
                timestamp: new Date()
            });
        });

        // Xử lý khi mobile gửi dữ liệu
        socket.on('mobile_data', (data) => {
            // Chuyển tiếp dữ liệu đến FE
            console.log('Dữ liệu từ mobile:', data);
            io.to(roomCode).emit('server_message', data);
        });

        // Xử lý khi client ngắt kết nối
        socket.on('disconnect', () => {
            if (socket.handshake.query.roomCode) {
                io.to(roomCode).emit('mobile_disconnected');
            }
        });
    });

    return io;
}

module.exports = { initializeSocket };