const { PrismaClient } = require('@prisma/client');
const {
    loginAPI,
    refreshTokenAPI,
    register_service
} = require('../services/auth_service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response');
const { loginSchema, sendOtpSchema } = require('../schemas/account.schema');
const NotificationService = require("../services/notification_service");

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

    // Phương thức để đóng kết nối Prisma khi cần
    async disconnect() {
        await this.prisma.$disconnect();
    }

    async sendOtpEmail(req, res) {
        const { account_id, email } = req.body;

        const response = await notificationService.sendOtpEmail(account_id, email);
        
        return res.status(response.status_code).json(response);
    }
}

module.exports = new AuthController();