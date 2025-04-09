const express = require('express');
const {
    login, getMe, register 
} = require('../controllers/authController');
const authRouter = express.Router();


authRouter.post('/login', login);
authRouter.post('/account/get-me', getMe);
authRouter.post('/register', register);


module.exports = authRouter;