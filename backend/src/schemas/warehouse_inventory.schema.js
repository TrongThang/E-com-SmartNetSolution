const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const BaseWarehouseInventorySchema = z.object({
    body: z.object({
        product_id: z.number().int().positive({
            message: `[${ERROR_CODES.WAREHOUSE_INVENTORY_PRODUCT_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.WAREHOUSE_INVENTORY_PRODUCT_ID_REQUIRED]}`,
        }),
        batch_code: z.string().min(3, {
            message: `[${ERROR_CODES.WAREHOUSE_INVENTORY_BATCH_CODE_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.WAREHOUSE_INVENTORY_BATCH_CODE_MIN_LENGTH]}`,
        }).max(50, {
            message: `[${ERROR_CODES.WAREHOUSE_INVENTORY_BATCH_CODE_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.WAREHOUSE_INVENTORY_BATCH_CODE_MAX_LENGTH]}`,
        }),
        stock: z.number().int().nonnegative({
            message: `[${ERROR_CODES.WAREHOUSE_INVENTORY_STOCK_INVALID}]${ERROR_MESSAGES[ERROR_CODES.WAREHOUSE_INVENTORY_STOCK_INVALID]}`,
        }),
    }),
});

const CreateWarehouseInventorySchema = BaseWarehouseInventorySchema;

const UpdateWarehouseInventorySchema = BaseWarehouseInventorySchema.extend({
    body: BaseWarehouseInventorySchema.shape.body.extend({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.WAREHOUSE_INVENTORY_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.WAREHOUSE_INVENTORY_ID_REQUIRED]}`,
        }),
    }),
});

const DeleteWarehouseInventorySchema = z.object({
    params: z.object({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.WAREHOUSE_INVENTORY_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.WAREHOUSE_INVENTORY_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    CreateWarehouseInventorySchema,
    UpdateWarehouseInventorySchema,
    DeleteWarehouseInventorySchema,
};