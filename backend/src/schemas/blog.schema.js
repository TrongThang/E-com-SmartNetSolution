const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const BaseBlogSchema = z.object({
    body: z.object({
        category_id: z.coerce.number().int().positive().optional(),
        product_id: z.coerce.string().min(1, {
            message: `[${ERROR_CODES.PRODUCT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.PRODUCT_ID_REQUIRED]}`
        }).optional(),
        title: z.string().max(500, {
            message: `[${ERROR_CODES.BLOG_TITLE_TOO_LONG}]${ERROR_MESSAGES[ERROR_CODES.BLOG_TITLE_TOO_LONG]}`
        }),
        author: z.string().max(12, {
            message: `[${ERROR_CODES.BLOG_AUTHOR_TOO_LONG}]${ERROR_MESSAGES[ERROR_CODES.BLOG_AUTHOR_TOO_LONG]}`
        }),
        content: z.string().max(500, {
            message: `[${ERROR_CODES.BLOG_CONTENT_TOO_LONG}]${ERROR_MESSAGES[ERROR_CODES.BLOG_CONTENT_TOO_LONG]}`
        }),
        content_normal: z.string().optional(),
        image: z.string().optional(),
        score: z.coerce.number().int().optional(),
        is_hide: z.union([
            z.boolean(),
            z.string().transform((val) => val === "true")
        ], {
            invalid_type_error: `[${ERROR_CODES.BLOG_IS_HIDE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.BLOG_IS_HIDE_INVALID]}`
        }).optional()
    })
});

const CreateBlogSchema = BaseBlogSchema;

const UpdateBlogSchema = BaseBlogSchema.extend({
    body: z.object({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.BLOG_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.BLOG_ID_REQUIRED]}`
        })
    })
});

const DeleteBlogSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.BLOG_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.BLOG_ID_REQUIRED]}`
        })
    })
});

module.exports = {
    CreateBlogSchema,
    UpdateBlogSchema,
    DeleteBlogSchema
};
