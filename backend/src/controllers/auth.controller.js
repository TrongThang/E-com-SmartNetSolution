const {
    loginAPI,
    refreshTokenAPI,
    register_service,
    ChangedPasswordAccountForgot,
    ChangedPasswordAccount,
    loginEmployee,
    getMe,
    getMeEmployee
} = require('../services/auth.service');

const jwt = require('jsonwebtoken');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const { loginSchema, sendOtpSchema } = require('../schemas/account.schema');
const notificationService = require("../services/notification.service");
class AuthController {
    async register(req, res) {
        const { username, password, confirm_password, surname, lastname, phone, email, gender } = req.body;

        const response = await register_service({
            username,
            password,
            confirm_password,
            surname,
            lastname,
            phone,
            email,
            gender
        })

        return res.status(response.status_code).json(response);
    }

    async login(req, res) {
        const { username, password, remember_me } = req.body;

        const response = await loginAPI(username, password, remember_me);
        return res.status(response.status_code).json(response);
    }

    async loginEmployee(req, res) {
        const { username, password } = req.body;

        const response = await loginEmployee({ username, password });

        return res.status(response.status_code).json(response);
    }

    async ChangedPasswordForgot(req, res) {
        const response = await ChangedPasswordAccountForgot(req.body)

        return res.status(response.status_code).json(response)
    }

    async getMe(req, res) {
        const token = req.headers.authorization.split(' ')[1];
        console.log('TOKEN',token)

        console.log('decoded', jwt.decode(token)) 
        const response = await getMe(token);

        return res.status(response.status_code).json(response);
    }

    async getMeEmployee(req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const response = await getMeEmployee(token);

        return res.status(response.status_code).json(response);
    }

    async sendOtpEmail(req, res) {
        const response = await notificationService.sendOtpEmail(req.body);

        return res.status(response.status_code).json(response);
    }

    async verifyOtpEmail(req, res) {
        const { account_id, email, otp } = req.body;

        const response = await notificationService.verifyOtpEmail(account_id, email, otp);

        return res.status(response.status_code).json(response);
    }

    async ChangedPassword(req, res) {

        const userId = req.user.userId;
        if(!userId) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(get_error_response(ERROR_CODES.ACCOUNT_INVALID, STATUS_CODE.BAD_REQUEST))
        }
        const response = await ChangedPasswordAccount(req.body, userId)

        return res.status(response.status_code).json(response)
    }

    async sendOtpEmailForChangeEmail(req, res) {
        const response = await notificationService.sendOtpEmailForChangeEmail(req.body);

        return res.status(response.status_code).json(response);
    }

    async verifyOtpEmailForChangeEmail(req, res) {
        const response = await notificationService.verifyOtpEmailForChangeEmail(req.body);

        return res.status(response.status_code).json(response);
    }
}

module.exports = new AuthController();