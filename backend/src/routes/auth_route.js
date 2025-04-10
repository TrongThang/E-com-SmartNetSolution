const express = require('express');
const { login, getMe, register } = require('../controllers/authController');
const { validateMiddleware } = require('../middleware/validate.middleware');
const authRouter = express.Router();

const { loginSchema, registerCustomoerSchema } = require('../schemas/account.schema');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

authRouter.post('/login', validateMiddleware(loginSchema), asyncHandler(login));
authRouter.post('/register', validateMiddleware(registerCustomoerSchema), asyncHandler(register));
authRouter.post('/account/get-me', getMe);


module.exports = authRouter;