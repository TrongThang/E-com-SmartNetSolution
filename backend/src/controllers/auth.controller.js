const { PrismaClient } = require('@prisma/client');
const {
    loginAPI,
    refreshTokenAPI,
    register_service,
    ChangedPasswordAccountForgot,
    ChangedPasswordAccount,
    loginEmployee
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
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await this.prisma.user.findUnique({
                where: {
                    id: decoded.id
                },
                select: {
                    account_id: true,
                    id: true,
                    username: true,
                    role: true,
                },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            email: true,
                        }
                    }
                }
            });

            return get_error_response(
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

    async getMeEmployee(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await this.prisma.employee.findUnique({
                where: {
                    id: decoded.employeeId
                },
                select: {
                    account_id: true,
                    id: true,
                    username: true,
                    role: true,
                },
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            surname: true,
                            lastname: true,
                            phone: true,
                            email: true,
                        }
                    }
                }
            });

            return get_error_response(
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

    async ChangedPassword(req, res) {
        console.log(1233123)
        const response = await ChangedPasswordAccount(req.body)

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