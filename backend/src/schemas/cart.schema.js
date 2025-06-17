const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const BaseCartSchema = z.object({
    body: z.object({
        customer_id: z.string().min(1, {
            message: `[${ERROR_CODES.CART_CUSTOMER_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.CART_CUSTOMER_ID_REQUIRED]}`,
        }).max(12, {
            message: `[${ERROR_CODES.CART_CUSTOMER_ID_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CART_CUSTOMER_ID_MAX_LENGTH]}`,
        }),
        product_id: z.string().min(1, {
            message: `[${ERROR_CODES.CART_PRODUCT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.CART_PRODUCT_ID_REQUIRED]}`,
        }),
        quantity: z.number().int().min(1, {
            message: `[${ERROR_CODES.CART_QUANTITY_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CART_QUANTITY_INVALID]}`,
        }).default(1),
    }),
});

const CreateCartSchema = BaseCartSchema;

const UpdateCartSchema = BaseCartSchema.extend({
    body: BaseCartSchema.shape.body.extend({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.CART_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.CART_ID_REQUIRED]}`,
        }),
    }),
});

const DeleteCartSchema = z.object({
    params: z.object({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.CART_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.CART_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    CreateCartSchema,
    UpdateCartSchema,
    DeleteCartSchema,
};