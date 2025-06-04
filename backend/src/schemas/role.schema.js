const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const CreateRoleSchema = z.object({
    body: z.object({
        name: z.string()
            .min(3, {
                message: `[${ERROR_CODES.ROLE_NAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ROLE_NAME_MIN_LENGTH]}`,
            })
            .max(500, {
                message: `[${ERROR_CODES.ROLE_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ROLE_NAME_MAX_LENGTH]}`,
            }),
        permissions: z.array(z.number()).default([]),
    }),
});

const UpdateRoleSchema = z.object({
    body: z.object({
        name: z.string()
            .min(3, {
                message: `[${ERROR_CODES.ROLE_NAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ROLE_NAME_MIN_LENGTH]}`,
            })
            .max(500, {
                message: `[${ERROR_CODES.ROLE_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ROLE_NAME_MAX_LENGTH]}`,
            })
            .optional(),
        permissions: z.array(z.number()).default([]),

    }),
    params: z.object({
        id: z.string().min(1, {
            message: `[${ERROR_CODES.ROLE_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ROLE_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    CreateRoleSchema,
    UpdateRoleSchema,
};