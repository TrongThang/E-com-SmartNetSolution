const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const BaseWarrantyTimeSchema = z.object({
    body: z.object({
        name: z.string().min(1, {
            message: `[${ERROR_CODES.WARRANTY_TIME_NAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.WARRANTY_TIME_NAME_MIN_LENGTH]}`,
        }).max(150, {
            message: `[${ERROR_CODES.WARRANTY_TIME_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.WARRANTY_TIME_NAME_MAX_LENGTH]}`,
        }),
        time: z.coerce.number().int().nonnegative({
            message: `[${ERROR_CODES.WARRANTY_TIME_INVALID}]${ERROR_MESSAGES[ERROR_CODES.WARRANTY_TIME_INVALID]}`,
        }),
    }),
});

const CreateWarrantyTimeSchema = BaseWarrantyTimeSchema;

const UpdateWarrantyTimeSchema = BaseWarrantyTimeSchema.extend({
    body: BaseWarrantyTimeSchema.shape.body.extend({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.WARRANTY_TIME_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.WARRANTY_TIME_ID_REQUIRED]}`,
        }),
    }),
});

const DeleteWarrantyTimeSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.WARRANTY_TIME_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.WARRANTY_TIME_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    CreateWarrantyTimeSchema,
    UpdateWarrantyTimeSchema,
    DeleteWarrantyTimeSchema,
};