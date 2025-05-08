const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const BaseWarehouseSchema = z.object({
    body: z.object({
        name: z.string().min(3, {
            message: `[${ERROR_CODES.WAREHOUSE_NAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.WAREHOUSE_NAME_MIN_LENGTH]}`,
        }).max(255, {
            message: `[${ERROR_CODES.WAREHOUSE_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.WAREHOUSE_NAME_MAX_LENGTH]}`,
        }),
        address: z.string().min(3, {
            message: `[${ERROR_CODES.WAREHOUSE_ADDRESS_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.WAREHOUSE_ADDRESS_MIN_LENGTH]}`,
        }).max(500, {
            message: `[${ERROR_CODES.WAREHOUSE_ADDRESS_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.WAREHOUSE_ADDRESS_MAX_LENGTH]}`,
        }),
    }),
});

const CreateWarehouseSchema = BaseWarehouseSchema;

const UpdateWarehouseSchema = BaseWarehouseSchema.extend({
    body: BaseWarehouseSchema.shape.body.extend({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.WAREHOUSE_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.WAREHOUSE_ID_REQUIRED]}`,
        }),
    }),
});

const DeleteWarehouseSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.WAREHOUSE_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.WAREHOUSE_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    CreateWarehouseSchema,
    UpdateWarehouseSchema,
    DeleteWarehouseSchema,
};