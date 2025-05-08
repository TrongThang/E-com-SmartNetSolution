const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

// Schema cho tạo review
const createReviewSchema = z.object({
    body: z.object({
        comment: z.string().min(1, {
            message: `[${ERROR_CODES.REVIEW_COMMENT_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.REVIEW_COMMENT_REQUIRED]}`
        }),
        image: z.string().optional().nullable(),
        rating: z.coerce.number().int().min(1, {
            message: `[${ERROR_CODES.REVIEW_RATING_INVALID}]${ERROR_MESSAGES[ERROR_CODES.REVIEW_RATING_INVALID]}`
        }).max(5, {
            message: `[${ERROR_CODES.REVIEW_RATING_INVALID}]${ERROR_MESSAGES[ERROR_CODES.REVIEW_RATING_INVALID]}`
        }),
    }),
});

// Schema cho cập nhật review
const updateReviewSchema = z.object({
    body: z.object({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.REVIEW_NOT_FOUND}]${ERROR_MESSAGES[ERROR_CODES.REVIEW_NOT_FOUND]}`
        }),
        comment: z.string().min(1, {
            message: `[${ERROR_CODES.REVIEW_COMMENT_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.REVIEW_COMMENT_REQUIRED]}`
        }),
        image: z.string().optional().nullable(),
        rating: z.coerce.number().int().min(1, {
            message: `[${ERROR_CODES.REVIEW_RATING_INVALID}]${ERROR_MESSAGES[ERROR_CODES.REVIEW_RATING_INVALID]}`
        }).max(5, {
            message: `[${ERROR_CODES.REVIEW_RATING_INVALID}]${ERROR_MESSAGES[ERROR_CODES.REVIEW_RATING_INVALID]}`
        }),
    }),
});

// Schema cho xóa review
const deleteReviewSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.REVIEW_NOT_FOUND}]${ERROR_MESSAGES[ERROR_CODES.REVIEW_NOT_FOUND]}`
        }),
    }),
});

module.exports = {
    createReviewSchema,
    updateReviewSchema,
    deleteReviewSchema,
};
