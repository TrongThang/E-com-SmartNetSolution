// backend/src/controllers/connection.controller.js
const { generateExportSocketQRId, generateVerificationOTPCode } = require('../helpers/generate.helper');
const jwt = require('jsonwebtoken');

class SocketQRController {
    async generateConnectionCode(req, res) {
        try {
            const { customer_id } = req.body;
            // Tạo room code và password
            const roomCode = generateExportSocketQRId();
            const password = generateVerificationOTPCode();
            
            // Lưu tạm thời vào memory (có thể dùng Redis nếu cần)
            // Giả sử có một Map để lưu trữ
            global.activeConnections = global.activeConnections || new Map();
            global.activeConnections.set(roomCode, {
                password,
                createdAt: Date.now(),
                // Có thể thêm các thông tin khác nếu cần
            });

            // Tự động xóa sau 10 phút
            setTimeout(() => {
                global.activeConnections.delete(roomCode);
            }, 10 * 60 * 1000);

            return res.json({
                success: true,
                data: {
                    customer_id: customer_id,
                    roomCode,
                    password
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async verifyConnection(req, res) {
        try {
            const { employee_id, roomCode, password } = req.body;
            
            // Kiểm tra mã kết nối
            const connection = global.activeConnections.get(roomCode);
            if (!connection || connection.password !== password) {
                return res.status(400).json({
                    success: false,
                    error: 'Mã kết nối không hợp lệ'
                });
            }

            // Tạo socket token
            const token = jwt.sign(
                { employee_id, roomCode },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            console.log('Token:', token);
            return res.json({
                success: true,
                data: { token }
            });
        } catch (error) {
            console.log('Error:', error);
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new SocketQRController();