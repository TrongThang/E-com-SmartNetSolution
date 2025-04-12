const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');
const { REGEX } = require('../contants/format_contants');

const BaseEmployeeSchema = z.object({
    body: z.object({
        surname: z.string().max(500, {
            message: `[${ERROR_CODES.EMPLOYEE_SURNAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_SURNAME_MAX_LENGTH]}`,
        }).optional(),
        lastname: z.string()
            .max(500, {
                message: `[${ERROR_CODES.EMPLOYEE_LASTNAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_LASTNAME_MAX_LENGTH]}`,
            }).optional(),
        image: z.string().optional(),
        email: z.string()
            .email({
                message: `[${ERROR_CODES.EMPLOYEE_EMAIL_INVALID}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_EMAIL_INVALID]}`,
            })
            .max(500, {
                message: `[${ERROR_CODES.EMPLOYEE_EMAIL_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_EMAIL_MAX_LENGTH]}`,
            }).optional(),
        birthdate: z.string()
            .regex(REGEX.BIRTHDAY, {
                message: `[${ERROR_CODES.EMPLOYEE_BIRTHDATE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_BIRTHDATE_INVALID]}`,
            }).optional(),
        gender: z.boolean({
            invalid_type_error: {
                message: `[${ERROR_CODES.EMPLOYEE_GENDER_INVALID}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_GENDER_INVALID]}`,
            },
        }).optional(),
        phone: z.string()
            .max(12, {
                message: `[${ERROR_CODES.EMPLOYEE_PHONE_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_PHONE_MAX_LENGTH]}`,
            })
            .regex(REGEX.PHONE, {
                message: `[${ERROR_CODES.EMPLOYEE_PHONE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_PHONE_INVALID]}`,
            }),
        status: z.number()
            .int({
                message: `[${ERROR_CODES.EMPLOYEE_STATUS_INVALID}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_STATUS_INVALID]}`,
            }).optional(),
        username: z.string()
            .min(1, {
                message: `[${ERROR_CODES.EMPLOYEE_USERNAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_USERNAME_MIN_LENGTH]}`,
            })
            .max(70, {
                message: `[${ERROR_CODES.EMPLOYEE_USERNAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_USERNAME_MAX_LENGTH]}`,
            }),
    }),
});

const CreateEmployeeSchema = BaseEmployeeSchema;

const UpdateEmployeeSchema = BaseEmployeeSchema.extend({
    body: BaseEmployeeSchema.shape.body.extend({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.EMPLOYEE_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_ID_REQUIRED]}`,
        }),
    }),
});

const DeleteEmployeeSchema = z.object({
    params: z.object({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.EMPLOYEE_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    CreateEmployeeSchema,
    UpdateEmployeeSchema,
    DeleteEmployeeSchema,
};