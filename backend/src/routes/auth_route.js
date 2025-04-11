const express = require('express');
const { login, getMe, register, sendOtpEmail } = require('../controllers/authController');
const { validateMiddleware } = require('../middleware/validate.middleware');
const authRouter = express.Router();

const { loginSchema, registerCustomerSchema, sendOtpSchema } = require('../schemas/account.schema');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

authRouter.post('/login', validateMiddleware(loginSchema), asyncHandler(login));
authRouter.post('/register', validateMiddleware(registerCustomerSchema), asyncHandler(register));
authRouter.post('/send-otp', validateMiddleware(sendOtpSchema), asyncHandler(sendOtpEmail));
// authRouter.post('/verify-otp', validateMiddleware(sendOtpSchema), asyncHandler(verifyOtpEmail));
authRouter.post('/account/get-me', getMe);


module.exports = authRouter;