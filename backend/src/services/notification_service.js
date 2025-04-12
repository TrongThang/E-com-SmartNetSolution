const { PrismaClient } = require('@prisma/client');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { generateVerificationOTPCode } = require('../helpers/generate.helper');
const { get_error_response } = require('../helpers/response');

const transporter = require('../config/nodemailer');
const { getVietnamTimeNow, addVietnamMinutes } = require('../helpers/time.helper');

const mailOptions = (toEmail, verificationCode) => ({
    from: process.env.EMAIL_USER, // Email người gửi
    to: toEmail,                  // Email người nhận
    subject: "Xác minh tài khoản của bạn",
    text: `Mã xác minh của bạn là: ${verificationCode}\nVui lòng sử dụng mã này để xác minh tài khoản. Mã có hiệu lực trong 10 phút.`,
    html: `<p>Mã xác minh của bạn là: <strong>${verificationCode}</strong></p><p>Vui lòng sử dụng mã này để xác minh tài khoản. Mã có hiệu lực trong 10 phút.</p>`,
});

class NotificationService {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async checkAccountEmail (account_id, email) {
        const account = await this.prisma.account.findUnique({
            where: { account_id: account_id },
            select: {
                account_id: true,
                verification_code: true,
                verification_expiry: true,
                customer: {
                    select: {
                        id: true,
                        email: true,
                        email_verified: true,
                    },
                },
            },
        });
        
        if (!account) {
            return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        
        if (account.customer.email !== email) {
            return get_error_response(ERROR_CODES.ACCOUNT_EMAIL_NOT_MATCH, STATUS_CODE.BAD_REQUEST);
        }
    
        if (account.customer.email_verified) {
            return get_error_response(ERROR_CODES.ACCOUNT_EMAIL_IS_VERIFIED, STATUS_CODE.BAD_REQUEST);
        }
    
        return account;
    }
    
    async sendOtpEmail(account_id, email) {
        const result_check = await this.checkAccountEmail(account_id, email);

        if (result_check.status_code) {
            return result_check; // Trả về lỗi nếu có
        }
        console.log("result_check", result_check);
        const account = result_check;
        
        try {
            let otp = generateVerificationOTPCode(); // Tạo mã OTP mới
            const expirationTime = addVietnamMinutes(10); // Thời gian hết hạn là 10 phút sau

            account.verification_code = otp; // Cập nhật mã OTP vào tài khoản
            account.verification_expiry = expirationTime; // Cập nhật thời gian hết hạn mã OTP
            
            await this.prisma.account.update({
                where: { account_id: account_id },
                data: {
                    verification_code: otp,
                    verification_expiry: expirationTime,
                },
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Xác minh tài khoản của bạn",
                template: "otp", // Tên file template (không cần .handlebars)
                context: {
                    otp: otp, // Giá trị thay thế {{otp}}
                    currentYear: 2025, // Giá trị thay thế {{currentYear}}
                },
            });

            const result = { message: "Đã gửi OTP", email, otp };
            return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, result);
        } catch (error) {
            console.error("Lỗi gửi email:", error);
            return get_error_response(ERROR_CODES.EMAIL_SEND_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR);
        }
        
    }

    async verifyOtpEmail(account_id, email, otp) {
        const account = await this.checkAccountEmail(account_id, email);

        if (account.status_code) {
            return account; // Trả về lỗi nếu có
        }

        if (!account.verification_code) {
            return get_error_response(ERROR_CODES.ACCOUNT_VERIFICATION_CODE_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
        }

        if (account.verification_code !== otp.toString()) {
            return get_error_response(ERROR_CODES.ACCOUNT_VERIFICATION_CODE_NOT_MATCH, STATUS_CODE.BAD_REQUEST);
        }

        if (getVietnamTimeNow() > account.verification_expiry) {
            return get_error_response(ERROR_CODES.ACCOUNT_VERIFICATION_CODE_EXPIRED, STATUS_CODE.BAD_REQUEST);
        }
        
        try {
            // Cập nhật bảng account
            await this.prisma.account.update({
                where: { account_id: account_id },
                data: {
                    verification_code: null,
                    verification_expiry: null,
                },
            });

            // Cập nhật bảng customer
            await this.prisma.customer.update({
                where: { id: account.customer.id },
                data: {
                    email_verified: true,
                },
            });
            
            return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, { message: "Xác minh thành công" });
        } catch (error) {
            console.error("Lỗi xác minh OTP:", error);
            return get_error_response(ERROR_CODES.ACCOUNT_VERIFICATION_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR);
        }

    
    }
}

module.exports = NotificationService;