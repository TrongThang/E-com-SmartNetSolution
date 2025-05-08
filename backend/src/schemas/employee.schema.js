const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');
const { REGEX } = require('../contants/format_contants');

const BaseEmployeeSchema = z.object({
    body: z.object({
        surname: z.string()
            .min(3, {
                message: `[${ERROR_CODES.EMPLOYEE_SURNAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_SURNAME_MIN_LENGTH]}`,
            })
            .max(500, {
                message: `[${ERROR_CODES.EMPLOYEE_SURNAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_SURNAME_MAX_LENGTH]}`,
            })
            .optional(),
        lastname: z.string()
            .min(3, {
                message: `[${ERROR_CODES.EMPLOYEE_LASTNAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_LASTNAME_MIN_LENGTH]}`,
            })
            .max(500, {
                message: `[${ERROR_CODES.EMPLOYEE_LASTNAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_LASTNAME_MAX_LENGTH]}`,
            })
            .optional(),
        image: z.string().optional(),
        email: z.string()
            .max(500, {
                message: `[${ERROR_CODES.EMPLOYEE_EMAIL_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_EMAIL_MAX_LENGTH]}`,
            })
            .regex(REGEX.EMAIL, ({
                message: `[${ERROR_CODES.EMPLOYEE_INVALID_EMAIL_FORMAT}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_INVALID_EMAIL_FORMAT]}`,
            }))
            .optional(),
        birthdate: z.string()
            .regex(REGEX.BIRTHDAY, {
                message: `[${ERROR_CODES.EMPLOYEE_BIRTHDATE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_BIRTHDATE_INVALID]}`,
            })
            .optional(),
        phone: z.string()
            .max(12, {
                message: `[${ERROR_CODES.EMPLOYEE_PHONE_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_PHONE_MAX_LENGTH]}`,
            })
            .regex(REGEX.PHONE, {
                message: `[${ERROR_CODES.EMPLOYEE_PHONE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_PHONE_INVALID]}`,
            }).optional(),
    }),
});

const CreateEmployeeSchema = BaseEmployeeSchema;

const UpdateEmployeeSchema = BaseEmployeeSchema.extend({
    params: z.object({
        id: z.string().min(1, {
            message: `[${ERROR_CODES.EMPLOYEE_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_ID_REQUIRED]}`,
        }),
    }),
});

const DeleteEmployeeSchema = z.object({
    params: z.object({
        id: z.string().min(1, {
            message: `[${ERROR_CODES.EMPLOYEE_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.EMPLOYEE_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    CreateEmployeeSchema,
    UpdateEmployeeSchema,
    DeleteEmployeeSchema,
};