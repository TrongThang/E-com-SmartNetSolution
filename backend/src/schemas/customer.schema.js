const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');
const { REGEX } = require('../contants/format_contants');

const BaseCustomerSchema = z.object({
    body: z.object({
        surname: z.string()
            .min(1, {
                message: `[${ERROR_CODES.CUSTOMER_SURNAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_SURNAME_MIN_LENGTH]}`
            })
            .max(50, {
                message: `[${ERROR_CODES.CUSTOMER_SURNAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_SURNAME_MAX_LENGTH]}`
            }),
        lastname: z.string()
            .min(1, {
                message: `[${ERROR_CODES.CUSTOMER_LASTNAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_LASTNAME_MIN_LENGTH]}`
            })
            .max(50, {
                message: `[${ERROR_CODES.CUSTOMER_LASTNAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_LASTNAME_MAX_LENGTH]}`
            }),
        image: z.string().optional(),
        phone: z.string()
            .regex(REGEX.PHONE, {
                message: `[${ERROR_CODES.CUSTOMER_PHONE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_PHONE_INVALID]}`
            })
            .optional(),
        email: z.string()
            .email({
                message: `[${ERROR_CODES.CUSTOMER_EMAIL_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_EMAIL_INVALID]}`
            })
            .optional(),
        gender: z.union([
            z.boolean(),
            z.string().refine(val => val === "true" || val === "false", {
                message: `[${ERROR_CODES.CUSTOMER_GENDER_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_GENDER_INVALID]}`
            })
        ], {
            message: `[${ERROR_CODES.CUSTOMER_GENDER_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_GENDER_INVALID]}`
        }).optional(),
        birthdate: z.coerce.date({
                message: `[${ERROR_CODES.CUSTOMER_BIRTHDATE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_BIRTHDATE_INVALID]}`
            })
            .optional()
    })
});

const CreateCustomerSchema = BaseCustomerSchema;

const UpdateCustomerSchema = BaseCustomerSchema.extend({
    body: BaseCustomerSchema.shape.body.extend({
        id: z.string({
            message: `[${ERROR_CODES.CUSTOMER_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_ID_REQUIRED]}`
        })
    })
});

const DeleteCustomerSchema = z.object({
    params: z.object({
        id: z.string({
            message: `[${ERROR_CODES.CUSTOMER_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.CUSTOMER_ID_REQUIRED]}`
        })
    })
});

module.exports = {
    CreateCustomerSchema,
    UpdateCustomerSchema,
    DeleteCustomerSchema,
}; 