const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const BaseUnitSchema = z.object({
    body: z.object({
        name: z.string().min(2, {
            message: `[${ERROR_CODES.UNIT_NAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.UNIT_NAME_MIN_LENGTH]}`,
        }).max(50, {
            message: `[${ERROR_CODES.UNIT_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.UNIT_NAME_MAX_LENGTH]}`,
        }),
    }),
});

const CreateUnitSchema = BaseUnitSchema;

const UpdateUnitSchema = BaseUnitSchema.extend({
    body: BaseUnitSchema.shape.body.extend({
        id: z.string().min(1, {
            message: `[${ERROR_CODES.UNIT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.UNIT_ID_REQUIRED]}`,
        }).max(5, {
            message: `[${ERROR_CODES.UNIT_ID_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.UNIT_ID_MAX_LENGTH]}`,
        }),
    }),
});

const DeleteUnitSchema = z.object({
    params: z.object({
        id: z.string().min(1, {
            message: `[${ERROR_CODES.UNIT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.UNIT_ID_REQUIRED]}`,
        }).max(5, {
            message: `[${ERROR_CODES.UNIT_ID_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.UNIT_ID_MAX_LENGTH]}`,
        }),
    }),
});

module.exports = {
    CreateUnitSchema,
    UpdateUnitSchema,
    DeleteUnitSchema,
};