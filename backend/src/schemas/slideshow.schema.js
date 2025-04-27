const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const BaseSlideshowSchema = z.object({
    body: z.object({
        text_button: z.string().min(3, {
            message: `[${ERROR_CODES.SLIDESHOW_TEXT_BUTTON_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.SLIDESHOW_TEXT_BUTTON_MIN_LENGTH]}`,
        }).max(255, {
            message: `[${ERROR_CODES.SLIDESHOW_TEXT_BUTTON_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.SLIDESHOW_TEXT_BUTTON_MAX_LENGTH]}`,
        }),
        link: z.string().min(3, {
            message: `[${ERROR_CODES.SLIDESHOW_LINK_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.SLIDESHOW_LINK_MIN_LENGTH]}`,
        }).max(500, {
            message: `[${ERROR_CODES.SLIDESHOW_LINK_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.SLIDESHOW_LINK_MAX_LENGTH]}`,
        }).url({
            message: `[${ERROR_CODES.SLIDESHOW_LINK_INVALID}]${ERROR_MESSAGES[ERROR_CODES.SLIDESHOW_LINK_INVALID]}`,
        }),
        image: z.string().min(3, {
            message: `[${ERROR_CODES.SLIDESHOW_IMAGE_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.SLIDESHOW_IMAGE_MIN_LENGTH]}`,
        }),
        status: z.number().int().refine(val => [0, 1].includes(val), {
            message: `[${ERROR_CODES.SLIDESHOW_STATUS_INVALID}]${ERROR_MESSAGES[ERROR_CODES.SLIDESHOW_STATUS_INVALID]}`,
        }),
    }),
});

const CreateSlideshowSchema = BaseSlideshowSchema;

const UpdateSlideshowSchema = BaseSlideshowSchema.extend({
    body: BaseSlideshowSchema.shape.body.extend({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.SLIDESHOW_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.SLIDESHOW_ID_REQUIRED]}`,
        }),
    }),
});

const DeleteSlideshowSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.SLIDESHOW_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.SLIDESHOW_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    CreateSlideshowSchema,
    UpdateSlideshowSchema,
    DeleteSlideshowSchema,
};