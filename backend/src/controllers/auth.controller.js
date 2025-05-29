const { PrismaClient } = require('@prisma/client');
const {
    loginAPI,
    refreshTokenAPI,
    register_service,
    ChangedPasswordAccount
} = require('../services/auth.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const { loginSchema, sendOtpSchema } = require('../schemas/account.schema');
const NotificationService = require("../services/notification.service");

const notificationService = new NotificationService(); // Truyền Prisma client vào

class AuthController {
    constructor() {
        this.prisma = new PrismaClient();
    }

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
        const { username, password, type } = req.body;

        const response = await loginAPI(username, password, type);

        return res.status(response.status_code).json(response);
    }

    async changedPassword(req, res) {
        const response = await ChangedPasswordAccount(req.body)

        return res.status(response.status_code).json(response)
    }

    async getMe(req, res) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: req.user.id },
            });

            get_error_response(
                ERROR_CODES.SUCCESS,
                STATUS_CODE.OK,
                user
            );
        } catch (error) {
            console.error(error);
            return get_error_response(
                ERROR_CODES.INTERNAL_SERVER_ERROR,
                STATUS_CODE.INTERNAL_SERVER_ERROR,
            );
        }
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
    async sendOtpForgotPassword(req, res) {
        const { email } = req.body;

        const response = await notificationService.sendOtpForgotPassword(email);

        return res.status(response.status_code).json(response);
    }
    async verifyOtpForgotPassword(req, res) {
        const { email, otp } = req.body;

        const response = await notificationService.verifyOtpForgotPassword(email, otp);

        return res.status(response.status_code).json(response);
    }
}

module.exports = new AuthController();