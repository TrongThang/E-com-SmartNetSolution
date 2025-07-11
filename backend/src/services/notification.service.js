
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { generateVerificationOTPCode } = require('../helpers/generate.helper');
const { get_error_response } = require('../helpers/response.helper');

const transporter = require('../config/nodemailer');
const prisma = require('../config/database');
const { getVietnamTimeNow, addVietnamMinutes } = require('../helpers/time.helper');
const admin = require('firebase-admin');

const mailOptions = (toEmail, verificationCode) => ({
    from: process.env.EMAIL_USER, // Email người gửi
    to: toEmail,                  // Email người nhận
    subject: "Xác minh tài khoản của bạn",
    text: `Mã xác minh của bạn là: ${verificationCode}\nVui lòng sử dụng mã này để xác minh tài khoản. Mã có hiệu lực trong 10 phút.`,
    html: `<p>Mã xác minh của bạn là: <strong>${verificationCode}</strong></p><p>Vui lòng sử dụng mã này để xác minh tài khoản. Mã có hiệu lực trong 10 phút.</p>`,
});
class NotificationService {
    constructor() {
        this.prisma = prisma;
        this.otpStore = new Map();
    }

    async getNotificationByAccountService(account_id) {
        let user = await this.prisma.account.findFirst({
            where: {
                account_id: account_id,
                deleted_at: null
            }
        });
        if (!user) {
            return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        const notifications = await this.prisma.notification.findMany({
            where: {
                account_id: account_id,
                deleted_at: null
            }
        });

        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, notifications);
    }

    async isReadNotification(notification_id, account_id) {
        let user = await this.prisma.account.findFirst({
            where: {
                account_id: account_id,
                deleted_at: null
            }
        });
        if (!user) {
            return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }



        const notifications = await this.prisma.notification.findFirst({
            where: {
                notification_id: notification_id,
            }
        });

        await this.prisma.notification.update({
            where: {
                notification_id: notification_id
            },
            data: {
                is_read: true
            }
        });

        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, { message: "Đã đọc thông báo" });
    }
    
    async createNotification({
        account_id,
        role_id,
        text,
        type,
    }) {
        if (account_id) {
            const account = await this.prisma.account.findFirst({
                where: { account_id, deleted_at: null },
            });
            if (!account) return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        if (role_id) {
            const role = await this.prisma.role.findUnique({
                where: { id: role_id },
            });
            if (!role) return get_error_response(ERROR_CODES.ROLE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        // Tạo notification trong database trước (business logic chính)
        const notification = await this.prisma.notification.create({
            data: {
                account_id: account_id || null,
                role_id: role_id || null,
                text: text,
                type: type,
                is_read: false,
                created_at: new Date(),
                updated_at: new Date(),
            }
        });

        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, { message: "Thông báo đã được tạo" });
    }   

    async checkAccountEmail(data) {
        const { account_id, email, username } = data;

        let account;

        // Nếu có account_id hoặc username, sử dụng findUnique vì chúng là trường unique
        if (account_id || username) {
            const whereCondition = account_id
                ? { account_id: account_id }
                : { username: username };

            account = await this.prisma.account.findUnique({
                where: whereCondition,
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
        } else {
            // Nếu chỉ có email, sử dụng findFirst để tìm qua quan hệ Customer
            account = await this.prisma.account.findFirst({
                where: {
                    customer: {
                        email: email,
                    },
                },
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
        }

        if (!account) {
            return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        // Nếu có email trong input, kiểm tra email khớp với tài khoản
        if (email && account.customer.email !== email) {
            return get_error_response(ERROR_CODES.ACCOUNT_EMAIL_NOT_MATCH, STATUS_CODE.BAD_REQUEST);
        }

        return account;
    }

    async sendOtpEmail(payload) {
        const { account_id, email } = payload;
        const result_check = await this.checkAccountEmail(payload);

        if (result_check.status_code) {
            return result_check; // Trả về lỗi nếu có
        }
        const account = result_check;
        const targetEmail = email || account.customer.email; // Sử dụng email từ input hoặc từ tài khoản
        const targetAccountId = account.account_id;
        try {
            let otp = generateVerificationOTPCode(); // Tạo mã OTP mới
            const expirationTime = addVietnamMinutes(10); // Thời gian hết hạn là 10 phút sau

            account.verification_code = otp; // Cập nhật mã OTP vào tài khoản
            account.verification_expiry = expirationTime; // Cập nhật thời gian hết hạn mã OTP

            await this.prisma.account.update({
                where: { account_id: targetAccountId },
                data: {
                    verification_code: otp,
                    verification_expiry: expirationTime,
                },
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: targetEmail,
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

    async sendOtpEmailForChangeEmail(payload) {
        const { account_id, email } = payload;

        const account = await this.prisma.account.findFirst({
            where: {
                account_id: account_id,
                deleted_at: null,
            },
        });

        if (!account) {
            return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        const ex_email = await this.prisma.customer.findFirst({
            where: {
                email: email,
                deleted_at: null,
            }
        })

        if (ex_email) {
            return get_error_response(ERROR_CODES.EMAIL_ALREADY_EXISTS, STATUS_CODE.BAD_REQUEST);
        }

        let otp = generateVerificationOTPCode(); // Tạo mã OTP mới
        const expirationTime = addVietnamMinutes(10); // Thời gian hết hạn là 10 phút sau

        account.verification_code = otp; // Cập nhật mã OTP vào tài khoản
        account.verification_expiry = expirationTime; // Cập nhật thời gian hết hạn mã OTP

        await this.prisma.account.update({
            where: { account_id: targetAccountId },
            data: {
                verification_code: otp,
                verification_expiry: expirationTime,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: targetEmail,
            subject: "Mã xác minh đổi email - SmartNet Solution",
            template: "otp", // Tên file template (không cần .handlebars)
            context: {
                otp: otp, // Giá trị thay thế {{otp}}
                currentYear: 2025, // Giá trị thay thế {{currentYear}}
            },
        });

        const result = { success: true, message: "Đã gửi OTP", email };
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, result);
    }

    async verifyOtpEmail(account_id, email, otp) {
        const account = await this.checkAccountEmail({ account_id, email });

        if (account.status_code) {
            return account; // Trả về lỗi nếu có
        }

        const targetAccountId = account.account_id;

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
                where: { account_id: targetAccountId },
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

    async verifyOtpEmailForChangeEmail(payload) {
        const { account_id, email, otp } = payload;
        const account = await this.checkAccountEmail({ account_id, email });

        if (account.status_code) {
            return account; // Trả về lỗi nếu có
        }

        const targetAccountId = account.account_id;

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
                where: { account_id: targetAccountId },
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
                    email: email,
                },
            });

            return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, { message: "Xác minh thành công" });
        } catch (error) {
            console.error("Lỗi xác minh OTP:", error);
            return get_error_response(ERROR_CODES.ACCOUNT_VERIFICATION_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR);
        }
    }

    /* FCM */
    /**
     * Gửi thông báo FCM đến nhân viên bán hàng
     */
    async sendOrderNotificationToRoleEmployees(roleId, title, body, data = {}) {
        try {
            // Lấy tất cả nhân viên bán hàng
            const employees = await this.prisma.account.findMany({
                where: {
                    role_id: roleId,
                    is_active: true,
                    deleted_at: null,
                    employee: {
                        status: 1
                    }
                },
                include: {
                    employee: true,
                    user_devices: {
                        where: {
                            is_deleted: false,
                            device_token: { not: null }
                        }
                    }
                }
            });

            if (employees.length === 0) {
                console.log('No sales staff found with FCM tokens');
                return { success: false, message: 'No sales staff available' };
            }



            // Gửi thông báo đến tất cả nhân viên bán hàng
            const results = await Promise.allSettled(
                employees.map(employee =>
                    this.sendFCMToUser(employee.account_id, title, body, data)
                )
            );

            const successCount = results.filter(r => r.status === 'fulfilled').length;
            const failCount = results.filter(r => r.status === 'rejected').length;

            console.log(`Notification sent: ${successCount} success, ${failCount} failed`);

            return {
                success: true,
                details: {
                    total_employees: employees.length,
                    success: successCount,
                    failed: failCount
                }
            };

        } catch (error) {
            console.error('Failed to send notification:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Gửi FCM đến một user cụ thể
     */
    async sendFCMToUser(accountId, title, body, data = {}) {
        try {
            // Lấy tất cả thiết bị của user
            const userDevices = await this.prisma.user_devices.findMany({
                where: {
                    user_id: accountId,
                    is_deleted: false,
                    device_token: { not: null }
                }
            });

            if (userDevices.length === 0) {
                console.log(`No FCM tokens for user ${accountId}`);
                return { success: false, message: 'No devices found' };
            }

            // Gửi đến tất cả thiết bị của user
            const results = await Promise.allSettled(
                userDevices.map(device =>
                    this.sendFCMToDevice(device, title, body, data)
                )
            );

            const successCount = results.filter(r => r.status === 'fulfilled').length;
            const failCount = results.filter(r => r.status === 'rejected').length;

            return {
                success: true,
                details: {
                    total_devices: userDevices.length,
                    success: successCount,
                    failed: failCount
                }
            };

        } catch (error) {
            console.error(`FCM failed for user ${accountId}:`, error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Validate FCM token format
     */
    isValidFCMToken(token) {
        if (!token || typeof token !== 'string') return false;
        return token.length > 100 && !token.includes('@') && !token.includes(' ');
    }

    /**
     * Kiểm tra lỗi token không hợp lệ
     */
    isInvalidTokenError(error) {
        const invalidTokenCodes = [
            'messaging/invalid-argument',
            'messaging/registration-token-not-registered',
            'messaging/invalid-registration-token'
        ];
        return error?.code && invalidTokenCodes.includes(error.code);
    }

    /**
     * Xóa FCM token không hợp lệ
     */
    async removeDeviceFCMToken(userDeviceId) {
        try {
            await this.prisma.user_devices.update({
                where: { user_device_id: userDeviceId },
                data: {
                    device_token: null,
                    updated_at: new Date()
                }
            });
            console.log(`Cleaned up invalid token for device ${userDeviceId}`);
        } catch (error) {
            console.log('Error cleaning up FCM token:', error.message);
        }
    }

    /**
     * Update FCM token cho thiết bị
     */
    async updateFCMToken(accountId, deviceToken, userDeviceId) {
        const account = await this.prisma.account.findFirst({ where: { account_id: accountId } });
        if (!account) {
            return { success: false, message: 'Account not found' };
        }
    
        if (userDeviceId) {
            // Update specific device
            await this.updateDeviceFCMToken(userDeviceId, deviceToken);
            return {
                success: true,
                message: 'FCM token updated successfully for specific device',
                deviceId: userDeviceId
            };
        } else {
            // Find and update latest device
            const latestDevice = await this.prisma.user_devices.findFirst({
                where: {
                    user_id: accountId,
                    is_deleted: false
                },
                orderBy: { last_login: 'desc' }
            });
    
            if (latestDevice) {
                await this.updateDeviceFCMToken(latestDevice.user_device_id, deviceToken);
                return {
                    success: true,
                    message: 'FCM token updated successfully for latest device',
                    deviceId: latestDevice.user_device_id
                };
            } else {
                return {
                    success: false,
                    message: 'No device found for user'
                };
            }
        }
    }
    
    /**
     * Update FCM token cho thiết bị cụ thể
     */
    async updateDeviceFCMToken(userDeviceId, deviceToken) {
        try {
            if (!userDeviceId || !deviceToken) {
                throw new Error('Missing required parameters');
            }

            await this.prisma.user_devices.update({
                where: { user_device_id: userDeviceId },
                data: {
                    device_token: deviceToken,
                    updated_at: new Date()
                }
            });

            console.log(`FCM token updated for device ${userDeviceId}`);
            return { success: true };
        } catch (error) {
            console.error('Error updating FCM token:', error);
            throw error;
        }
    }

    /**
     * Lấy FCM tokens của user (cho debugging)
     */
    async getUserFCMTokens(accountId) {
        try {
            return await this.prisma.user_devices.findMany({
                where: {
                    user_id: accountId,
                    is_deleted: false,
                    device_token: { not: null }
                },
                select: {
                    user_device_id: true,
                    device_name: true,
                    device_token: true,
                    last_login: true
                }
            });
        } catch (error) {
            console.warn('Failed to get user FCM tokens:', error);
            return [];
        }
    }

    /**
     * Test FCM connection
     */
    async testFCMConnection() {
        try {
            const app = admin.app();
            return !!app;
        } catch (error) {
            console.warn('FCM connection test failed:', error);
            return false;
        }
    }

    /**
     * Xóa device của user
     */
    async deleteDevice(accountId) {
        try {
            if (!accountId) {
                return {
                    success: false,
                    message: 'Unauthorized'
                };
            }

            // Soft delete all devices of user
            await this.prisma.user_devices.updateMany({
                where: {
                    user_id: accountId,
                    is_deleted: false
                },
                data: {
                    is_deleted: true,
                    updated_at: new Date()
                }
            });

            return {
                success: true,
                message: 'Device deleted successfully'
            };

        } catch (error) {
            console.error('Error deleting device:', error);
            return {
                success: false,
                message: 'Internal server error',
                error: error.message
            };
        }
    }

    /**
     * Gửi test notification cho user
     */
    async sendTestNotification(accountId) {
        try {
            if (!accountId) {
                return {
                    success: false,
                    message: 'Unauthorized'
                };
            }

            const result = await this.sendFCMToUser(
                accountId,
                '🧪 Test Notification',
                'Đây là thông báo test từ server Ecom',
                {
                    type: 'test',
                    timestamp: Date.now().toString()
                }
            );

            return {
                success: true,
                message: 'Test notification sent',
                data: result
            };

        } catch (error) {
            console.error('Error sending test notification:', error);
            return {
                success: false,
                message: 'Internal server error',
                error: error.message
            };
        }
    }

    /**
     * Gửi FCM đến device cụ thể
     */
    async sendFCMToDevice(device, title, body, data = {}) {
        if (!device.device_token || !this.isValidFCMToken(device.device_token)) {
            console.log(`Invalid FCM token for device ${device.device_name}`);
            return Promise.resolve();
        }

        try {
            const message = {
                token: device.device_token,
                notification: {
                    title: title,
                    body: body
                },
                data: this.sanitizeDataForFCM(data),
                android: {
                    notification: {
                        sound: 'default',
                        priority: 'high',
                        channelId: 'ecom_orders'
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1
                        }
                    }
                }
            };

            const response = await admin.messaging().send(message);
            console.log(`✓ FCM sent to ${device.device_name}: ${response}`);

        } catch (error) {
            console.log(`✗ FCM failed for ${device.device_name}:`, error.message);

            // Xóa token không hợp lệ
            if (this.isInvalidTokenError(error)) {
                await this.removeDeviceFCMToken(device.user_device_id);
            }
        }
    }

    /**
     * Sanitize data cho FCM
     */
    sanitizeDataForFCM(data) {
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            sanitized[key] = String(value);
        }
        return sanitized;
    }
    
    /**
     * Get device name from user agent
     */
    getDeviceName(userAgent) {
        if (!userAgent) return 'Web Browser';
        
        if (userAgent.includes('Chrome')) return 'Chrome Browser';
        if (userAgent.includes('Firefox')) return 'Firefox Browser';
        if (userAgent.includes('Safari')) return 'Safari Browser';
        if (userAgent.includes('Edge')) return 'Edge Browser';
        return 'Web Browser';
    }

    /**
     * Generate device ID
     */
    getDeviceId() {
        return `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

module.exports = new NotificationService();