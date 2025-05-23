const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const baseContactSchema = z.object({
    body: z.object({
        fullname: z.string().min(3, {
            message: `[${ERROR_CODES.CONTACT_FULLNAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_FULLNAME_MIN_LENGTH]}`,
        }).max(100, {
            message: `[${ERROR_CODES.CONTACT_FULLNAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_FULLNAME_MAX_LENGTH]}`,
        }),
        title: z.string().min(3, {
            message: `[${ERROR_CODES.CONTACT_TITLE_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_TITLE_MIN_LENGTH]}`,
        }).max(255, {
            message: `[${ERROR_CODES.CONTACT_TITLE_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_TITLE_MAX_LENGTH]}`,
        }),
        content: z.string().min(3, {
            message: `[${ERROR_CODES.CONTACT_CONTENT_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_CONTENT_MIN_LENGTH]}`,
        }).max(500, {
            message: `[${ERROR_CODES.CONTACT_CONTENT_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_CONTENT_MAX_LENGTH]}`,
        }),
        email: z.string().email({
            message: `[${ERROR_CODES.CONTACT_EMAIL_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_EMAIL_INVALID]}`,
        }),
        // status: z.number().int({
        //     message: `[${ERROR_CODES.CONTACT_STATUS_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_STATUS_INVALID]}`,
        // }),
    }),
});

const createContactSchema = baseContactSchema;


// const updateContactSchema = baseContactSchema.extend({
//     body: baseContactSchema.shape.body.extend({
//         id: z.number().int().positive({
//             message: `[${ERROR_CODES.CONTACT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_ID_REQUIRED]}`,
//         }),
//         status: z.number().int({
//             message: `[${ERROR_CODES.CONTACT_STATUS_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_STATUS_INVALID]}`,
//         }),
//     }),
// });
const updateContactSchema = z.object({
    body: z.object({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.CONTACT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_ID_REQUIRED]}`,
        }),
        status: z.coerce.number().int().refine(val => [0, 1, 2, 3].includes(val), {
            message: `[${ERROR_CODES.CONTACT_STATUS_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_STATUS_INVALID]}`,
        }),
    }),
    
});

const deleteContactSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.CONTACT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    createContactSchema,
    updateContactSchema,
    deleteContactSchema,
};