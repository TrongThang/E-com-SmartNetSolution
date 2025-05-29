const express = require('express');
const { login, getMe, register,
    sendOtpEmail, verifyOtpEmail,
    changedPassword
} = require('../controllers/auth.controller');
const { validateMiddleware } = require('../middleware/validate.middleware');
const authRouter = express.Router();

const { loginSchema, registerCustomerSchema, sendOtpSchema, verifyOtpSchema } = require('../schemas/account.schema');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Đăng nhập và đăng ký
authRouter.post('/login', validateMiddleware(loginSchema), asyncHandler(login));
authRouter.post('/register', validateMiddleware(registerCustomerSchema), asyncHandler(register));

// Xác minh tài khoản
authRouter.post('/send-otp', validateMiddleware(sendOtpSchema), asyncHandler(sendOtpEmail));
authRouter.post('/verify-otp', validateMiddleware(verifyOtpSchema), asyncHandler(verifyOtpEmail));

// Đổi mật khẩu
authRouter.post('/account/change-password', asyncHandler(changedPassword));

// Lấy thông tin tài khoản hiện tại
authRouter.post('/account/get-me', getMe);


module.exports = authRouter;