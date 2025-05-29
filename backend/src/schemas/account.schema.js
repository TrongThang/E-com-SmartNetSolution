const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');
const { REGEX } = require('../contants/format_contants');

const sendOtpSchema = z.object({
    body: z.object({
        email: z.string().email({
            message: `[${ERROR_CODES.CUSTOMER_EMAIL_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_EMAIL_INVALID]}`,
        }),
        account_id: z.string().optional(),
        username: z.string().optional(),
    })
});

const verifyOtpSchema = z.object({
    body: z.object({
        account_id: z.string().uuid({
            message: `[${ERROR_CODES.ACCOUNT_ID_INVALID}]${ERROR_MESSAGES[ERROR_CODES.ACCOUNT_ID_INVALID]}`,
        }).optional(), // Làm account_id tùy chọn
        email: z.string().email({
            message: `[${ERROR_CODES.CUSTOMER_EMAIL_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_EMAIL_INVALID]}`,
        }),
        otp: z.string().regex(/^\d{6}$/, {
            message: `[${ERROR_CODES.ACCOUNT_VERIFICATION_CODE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.ACCOUNT_VERIFICATION_CODE_INVALID]}`,
        }),
        purpose: z.enum(["activate", "forgot_password"]).optional().default("activate"), // Thêm purpose với giá trị mặc định
    }).refine(
        (data) => data.account_id || data.email, // Phải có ít nhất account_id hoặc email
        {
            message: `[CUSTOM_VALIDATION_ERROR] Phải cung cấp ít nhất account_id hoặc email`,
            path: ['account_id'],
        }
    ),
});

const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, {
            // message: `[${ERROR_CODES.ACCOUNT_USERNAME_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ACCOUNT_USERNAME_REQUIRED]}`,
            message: '[' + ERROR_CODES.ACCOUNT_USERNAME_REQUIRED + ']' + ERROR_MESSAGES[ERROR_CODES.ACCOUNT_USERNAME_REQUIRED],
        }),
        password: z.string().min(1, {
            message: `[${ERROR_CODES.ACCOUNT_PASSWORD_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ACCOUNT_PASSWORD_REQUIRED]}`,
        }),
        remember_me: z.boolean({
            invalid_type_error: {
                message: `[${ERROR_CODES.ACCOUNT_REMEMBER_ME_INVALID}]${ERROR_MESSAGES[ERROR_CODES.ACCOUNT_REMEMBER_ME_INVALID]}`,
            },
        }).optional()
    }),
});


const registerCustomerSchema = z.object({
    body: z.object({
        username: z.string().min(1, {
            message: `[${ERROR_CODES.ACCOUNT_USERNAME_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ACCOUNT_USERNAME_REQUIRED]}`,
        }),
        password: z.string().min(1, {
            message: `[${ERROR_CODES.ACCOUNT_PASSWORD_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ACCOUNT_PASSWORD_REQUIRED]}`,
        }),
        confirm_password: z.string().min(1, {
            message: `[${ERROR_CODES.ACCOUNT_CONFIRM_PASSWORD_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ACCOUNT_CONFIRM_PASSWORD_REQUIRED]}`,
        }),
        surname: z.string().optional(),
        lastname: z.string()
            .min(1, {
                message: `[${ERROR_CODES.CUSTOMER_LASTNAME_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_LASTNAME_INVALID]}`,
            })
            .max(500, {
                message: `[${ERROR_CODES.CUSTOMER_LASTNAME_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_LASTNAME_INVALID]}`,
            }),
        phone: z.string()
            .min(1, {
                message: `[${ERROR_CODES.CUSTOMER_PHONE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_PHONE_INVALID]}`,
            })
            .regex(REGEX.PHONE, {
                message: `[${ERROR_CODES.CUSTOMER_PHONE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_PHONE_INVALID]}`,
            }),
        email: z.string().email({
            message: `[${ERROR_CODES.CUSTOMER_EMAIL_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_EMAIL_INVALID]}`,
        }),
        gender: z.boolean({ message: `[${ERROR_CODES.CUSTOMER_GENDER_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_GENDER_INVALID]}`, })
        // birthdate:
    }),
});



module.exports = {
    loginSchema, registerCustomerSchema,
    sendOtpSchema, verifyOtpSchema,
}