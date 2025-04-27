const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const baseContactSchema = z.object({
    body: z.object({
        fullname: z.string().min(3, {
            message: `[${ERROR_CODES.CONTACT_FULLNAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_FULLNAME_MIN_LENGTH]}`,
        }).max(100, {
            message: `[${ERROR_CODES.CONTACT_FULLNAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_FULLNAME_MAX_LENGTH]}`,
        }),//họ tên phải có ít nhất 3 ký tự và không được vượt quá 100 ký tự
        title: z.string().min(3, {
            message: `[${ERROR_CODES.CONTACT_TITLE_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_TITLE_MIN_LENGTH]}`,
        }).max(255, {
            message: `[${ERROR_CODES.CONTACT_TITLE_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_TITLE_MAX_LENGTH]}`,
        }),//tiêu đề phải có ít nhất 3 ký tự và không được vượt quá 255 ký tự
        content: z.string().min(3, {
            message: `[${ERROR_CODES.CONTACT_CONTENT_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_CONTENT_MIN_LENGTH]}`,
        }).max(500, {
            message: `[${ERROR_CODES.CONTACT_CONTENT_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_CONTENT_MAX_LENGTH]}`,
        }),//nội dung phải có ít nhất 3 ký tự và không được vượt quá 500 ký tự
        email: z.string().email({
            message: `[${ERROR_CODES.CONTACT_EMAIL_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_EMAIL_INVALID]}`,
        }),//email phải là định dạng email hợp lệ
        // status: z.number().int({
        //     message: `[${ERROR_CODES.CONTACT_STATUS_INVALID}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_STATUS_INVALID]}`,
        // }),//trạng thái phải là số nguyên
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
        id: z.number().int().positive({
            message: `[${ERROR_CODES.CONTACT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.CONTACT_ID_REQUIRED]}`,
        }),
        status: z.number().int({
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