const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');
const { REGEX } = require('../contants/format_contants');

const BaseProductSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: `[${ERROR_CODES.PRODUCT_NAME_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_NAME_REQUIRED]}`
        })
            .max(500, {
                message: `[${ERROR_CODES.PRODUCT_NAME_TOO_LONG}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_NAME_TOO_LONG]}`
            }),
        slug: z.string()
            .max(500, {
                message: `[${ERROR_CODES.PRODUCT_NAME_TOO_LONG}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_NAME_TOO_LONG]}`
            })
            .optional(),
        description: z.string()
            .optional(),
        description_normal: z.string()
            .optional(),
        image: z.string()
            .optional(),
        selling_price: z.number({
            invalid_type_error: `[${ERROR_CODES.SHARED_NOT_NUMBER}]${ERROR_MESSAGES[ERROR_CODES.SHARED_NOT_NUMBER]}`,
            required_error: `[${ERROR_CODES.PRODUCT_PRICE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_PRICE_INVALID]}`
        })
            .nonnegative({
                message: `[${ERROR_CODES.PRODUCT_PRICE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_PRICE_INVALID]}`
            })
            .optional(),
        category_id: z.number({
            invalid_type_error: `[${ERROR_CODES.SHARED_NOT_NUMBER}]${ERROR_MESSAGES[ERROR_CODES.SHARED_NOT_NUMBER]}`,
            required_error: `[${ERROR_CODES.PRODUCT_CATEGORY_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_CATEGORY_REQUIRED]}`
        })
            .int({
                message: `[${ERROR_CODES.PRODUCT_CATEGORY_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_CATEGORY_REQUIRED]}`
            }),
        unit_id: z.number({
            invalid_type_error: `[${ERROR_CODES.SHARED_NOT_NUMBER}]${ERROR_MESSAGES[ERROR_CODES.SHARED_NOT_NUMBER]}`,
            required_error: `[${ERROR_CODES.PRODUCT_UNIT_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_UNIT_REQUIRED]}`
        })
            .int({
                message: `[${ERROR_CODES.PRODUCT_UNIT_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_UNIT_REQUIRED]}`
            }),
        warrenty_time_id: z.number({
            invalid_type_error: `[${ERROR_CODES.SHARED_NOT_NUMBER}]${ERROR_MESSAGES[ERROR_CODES.SHARED_NOT_NUMBER]}`
        })
            .int()
            .optional(),
        views: z.number({
            invalid_type_error: `[${ERROR_CODES.SHARED_NOT_NUMBER}]${ERROR_MESSAGES[ERROR_CODES.SHARED_NOT_NUMBER]}`
        })
            .int()
            .nonnegative()
            .optional(),
        is_hide: z.union([
            z.boolean(),
            z.string().refine(val => val === "true" || val === "false", {
                message: `[${ERROR_CODES.PRODUCT_IS_HIDE}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_IS_HIDE]}`
            })
        ], {
            message: `[${ERROR_CODES.PRODUCT_IS_HIDE}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_IS_HIDE]}`
        }).optional(),
        status: z.number({
            invalid_type_error: `[${ERROR_CODES.SHARED_NOT_NUMBER}]${ERROR_MESSAGES[ERROR_CODES.SHARED_NOT_NUMBER]}`
        })
            .int({
                message: `[${ERROR_CODES.PRODUCT_STATUS_INVALID}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_STATUS_INVALID]}`
            })
            .optional(),
        created_at: z.coerce.date()
            .optional(),
        updated_at: z.coerce.date()
            .optional(),
        deleted_at: z.coerce.date()
            .optional()
    })
});

const CreateProductSchema = BaseProductSchema;

const UpdateProductSchema = BaseProductSchema.extend({
    body: BaseProductSchema.shape.body.extend({
        id: z.number({
            invalid_type_error: `[${ERROR_CODES.SHARED_NOT_NUMBER}]${ERROR_MESSAGES[ERROR_CODES.SHARED_NOT_NUMBER]}`,
            required_error: `[${ERROR_CODES.PRODUCT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_ID_REQUIRED]}`
        })
    })
});

const DeleteProductSchema = z.object({
    params: z.object({
        id: z.number({
            invalid_type_error: `[${ERROR_CODES.SHARED_NOT_NUMBER}]${ERROR_MESSAGES[ERROR_CODES.SHARED_NOT_NUMBER]}`,
            required_error: `[${ERROR_CODES.PRODUCT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_ID_REQUIRED]}`
        })
    })
});

module.exports = {
    CreateProductSchema,
    UpdateProductSchema,
    DeleteProductSchema,
};