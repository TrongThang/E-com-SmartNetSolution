const jwt = require('jsonwebtoken');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');

/**
 * Middleware xác thực JWT cho các route yêu cầu đăng nhập.
 *
 * - Kiểm tra header Authorization có định dạng 'Bearer <token>'.
 * - Giải mã và xác thực token bằng secret key từ biến môi trường JWT_SECRET.
 * - Nếu token hợp lệ, gán payload vào req.account và gọi next().
 * - Nếu token không hợp lệ hoặc hết hạn, trả về lỗi UNAUTHORIZED với thông báo phù hợp.
 *
 * @param {Object} req Request từ Express
 * @param {Object} res Response từ Express
 * @param {Function} next Hàm next để chuyển sang middleware tiếp theo
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('authHeader', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response = get_error_response(ERROR_CODES.ACCOUNT_UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
        return res.status(response.status_code).json(response);
    }
    
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
        const response = get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
        return res.status(response.status_code).json(response);
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;

        next();
    } catch (error) {
        console.log('error', error);
        
        let errorCode = ERROR_CODES.ACCOUNT_UNAUTHORIZED;
        
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                errorCode = ERROR_CODES.ACCOUNT_TOKEN_EXPIRED;
            } else if (error.name === 'JsonWebTokenError') {
                errorCode = ERROR_CODES.ACCOUNT_UNAUTHORIZED;
            }
        }
        
        const response = get_error_response(errorCode, STATUS_CODE.UNAUTHORIZED);
        return res.status(response.status_code).json(response);
    }
};

module.exports = authMiddleware;