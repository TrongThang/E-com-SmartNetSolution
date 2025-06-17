const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const BaseImageProductSchema = z.object({
    body: z.object({
        product_id: z.string().min(1, {
            message: `[${ERROR_CODES.IMAGE_PRODUCT_PRODUCT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.IMAGE_PRODUCT_PRODUCT_ID_REQUIRED]}`,
        }),
        image: z.string().min(1, {
            message: `[${ERROR_CODES.IMAGE_PRODUCT_IMAGE_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.IMAGE_PRODUCT_IMAGE_REQUIRED]}`,
        }),
    }),
});

const CreateImageProductSchema = BaseImageProductSchema;

const UpdateImageProductSchema = BaseImageProductSchema.extend({
    body: BaseImageProductSchema.shape.body.extend({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.IMAGE_PRODUCT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.IMAGE_PRODUCT_ID_REQUIRED]}`,
        }),
    }),
});

const DeleteImageProductSchema = z.object({
    params: z.object({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.IMAGE_PRODUCT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.IMAGE_PRODUCT_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    CreateImageProductSchema,
    UpdateImageProductSchema,
    DeleteImageProductSchema,
};