// Cập nhật lại
const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const BaseLikedSchema = z.object({
    body: z.object({
        product_id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.LIKED_PRODUCT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.LIKED_PRODUCT_ID_REQUIRED]}`,
        }),
        customer_id: z.string({
            message: `[${ERROR_CODES.LIKED_CUSTOMER_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.LIKED_CUSTOMER_ID_REQUIRED]}`,
        }),
    }),
});

const CreateLikedSchema = BaseLikedSchema;

const UpdateLikedSchema = BaseLikedSchema.extend({
    body: BaseLikedSchema.shape.body.extend({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.LIKED_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.LIKED_ID_REQUIRED]}`,
        }),
    }),
});

const DeleteLikedSchema = z.object({
    params: z.object({
        customer_id: z.string({
            message: `[${ERROR_CODES.LIKED_CUSTOMER_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.LIKED_CUSTOMER_ID_REQUIRED]}`,
        }),
        product_id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.LIKED_PRODUCT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.LIKED_PRODUCT_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    CreateLikedSchema,
    UpdateLikedSchema,
    DeleteLikedSchema,
};