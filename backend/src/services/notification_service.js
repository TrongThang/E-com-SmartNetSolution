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
    
    async sendOtpEmail(account_id, email) {
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
                    },
                },
            },
        });
        if (!account) {
            return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        console.log('account: ', account)   
        console.log('send: ',email)
        console.log('gốc: ', account.customer.email)
        if (account.customer.email !== email) {
            return get_error_response(ERROR_CODES.ACCOUNT_EMAIL_NOT_MATCH, STATUS_CODE.BAD_REQUEST);
        }

        if (account.email_verified) {
            return get_error_response(ERROR_CODES.ACCOUNT_EMAIL_IS_VERIFIED, STATUS_CODE.BAD_REQUEST);
        }
        
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
}

module.exports = NotificationService;