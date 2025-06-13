const express = require('express');
const { login, getMe, register,
    sendOtpEmail, verifyOtpEmail,
    ChangedPasswordForgot,
    ChangedPassword,
    verifyOtpEmailForChangeEmail,
    loginEmployee,
    getMeEmployee
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
authRouter.post('/login-employee', validateMiddleware(loginSchema), asyncHandler(loginEmployee));

// Xác minh tài khoản
authRouter.post('/send-otp', validateMiddleware(sendOtpSchema), asyncHandler(sendOtpEmail));
authRouter.post('/verify-otp', validateMiddleware(verifyOtpSchema), asyncHandler(verifyOtpEmail));

// Đổi email
authRouter.post('/verify-otp-change-email', validateMiddleware(verifyOtpSchema), asyncHandler(verifyOtpEmailForChangeEmail));

// Đổi mật khẩu - quên
authRouter.post('/account/change-password-forgot', asyncHandler(ChangedPasswordForgot));

// Đổi mật khẩu - quên
authRouter.patch('/account/changed-password', asyncHandler(ChangedPassword));

// Lấy thông tin tài khoản hiện tại
authRouter.get('/getme', getMe);
authRouter.get('/getme-employee', getMeEmployee);


module.exports = authRouter;