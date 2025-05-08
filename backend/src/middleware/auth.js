// const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const {prisma} = require('../config/database');
const { STATUS_CODE, ERROR_CODES, ERROR_MESSAGES } = require('../docs/contants');
const { get_error_response } = require('../helpers/response.helper');

async function verify_token(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throwError(ErrorCodes.UNAUTHORIZED, 'Invalid authorization format');
        return;
    }

    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
        throw new Error('JWT_SECRET is not set in environment variables');
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.account = decoded;
        next();
        
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                throwError(ERROR_CODES.UNAUTHORIZED, 'Token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throwError(ERROR_CODES.UNAUTHORIZED, 'Invalid token');
            } else {
                throwError(ERROR_CODES.UNAUTHORIZED, 'Authentication failed');
            }
        } else {
            throwError(ERROR_CODES.UNAUTHORIZED, 'Authentication failed');
        }
    }
}

export { get_user_from_token };