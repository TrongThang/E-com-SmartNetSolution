const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const createCategoriesSchema = z.object({
    body: z.object({
        name: z.string().min(3, {
            message: `[${ERROR_CODES.CATEGORY_NAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CATEGORY_NAME_MIN_LENGTH]}`,
        }).max(500, {
            message: `[${ERROR_CODES.CATEGORY_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CATEGORY_NAME_MAX_LENGTH]}`,
        }),

        description: z.string().min(1, {
            message: `[${ERROR_CODES.CATEGORY_DESCRIPTION_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CATEGORY_DESCRIPTION_MIN_LENGTH]}`,
        }).max(500, {
            message: `[${ERROR_CODES.CATEGORY_DESCRIPTION_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CATEGORY_DESCRIPTION_MAX_LENGTH]}`,
        }),
        image: z.string().min(1, {
            message: `[${ERROR_CODES.CATEGORY_IMAGE_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.CATEGORY_IMAGE_REQUIRED]}`,
        }),
        is_hide: z.boolean().optional(),
    }),
});

const updateCategoriesSchema = createCategoriesSchema.extend({
    params: z.object({
        id: z.coerce.number()
    }),
    body: z.object({
        name: z.string().min(3, {
            message: `[${ERROR_CODES.CATEGORY_NAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CATEGORY_NAME_MIN_LENGTH]}`,
        }).max(500, {
            message: `[${ERROR_CODES.CATEGORY_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CATEGORY_NAME_MAX_LENGTH]}`,
        }),
        description: z.string().min(1, {
            message: `[${ERROR_CODES.CATEGORY_DESCRIPTION_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CATEGORY_DESCRIPTION_MIN_LENGTH]}`,
        }).max(500, {
            message: `[${ERROR_CODES.CATEGORY_DESCRIPTION_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CATEGORY_DESCRIPTION_MAX_LENGTH]}`,
        }),
        image: z.string().min(1, {
            message: `[${ERROR_CODES.CATEGORY_IMAGE_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.CATEGORY_IMAGE_REQUIRED]}`,
        }),
        is_hide: z.boolean().optional(),
    }),
});

module.exports = {
    createCategoriesSchema,
    updateCategoriesSchema,
}