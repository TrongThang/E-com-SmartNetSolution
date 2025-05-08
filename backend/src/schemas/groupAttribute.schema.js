const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

// Schema cho attribute
const AttributeSchema = z.object({
    name: z.string()
        .min(3, {
            message: `[${ERROR_CODES.ATTRIBUTE_NAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_NAME_MIN_LENGTH]}`,
        })
        .max(500, {
            message: `[${ERROR_CODES.ATTRIBUTE_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_NAME_MAX_LENGTH]}`,
        }),
    datatype: z.string()
        .min(1, {
            message: `[${ERROR_CODES.ATTRIBUTE_DATATYPE_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_DATATYPE_REQUIRED]}`,
        }),
    required: z.boolean().optional(),
    is_hide: z.boolean().optional()
});

// Schema cho create attribute group
const CreateAttributeGroupSchema = z.object({
    body: z.object({
        name: z.string()
            .min(3, {
                message: `[${ERROR_CODES.ATTRIBUTE_GROUP_NAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_GROUP_NAME_MIN_LENGTH]}`,
            })
            .max(500, {
                message: `[${ERROR_CODES.ATTRIBUTE_GROUP_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_GROUP_NAME_MAX_LENGTH]}`,
            }),
        attributes: z.array(AttributeSchema).optional()
    })
});

// Schema cho update attribute group
const UpdateAttributeGroupSchema = z.object({
    params: z.object({
        id: z.coerce.number().int()
    }),
    body: z.object({
        name: z.string()
            .min(3, {
                message: `[${ERROR_CODES.ATTRIBUTE_GROUP_NAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_GROUP_NAME_MIN_LENGTH]}`,
            })
            .max(500, {
                message: `[${ERROR_CODES.ATTRIBUTE_GROUP_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_GROUP_NAME_MAX_LENGTH]}`,
            }),
        attributes: z.array(AttributeSchema).optional()
    })
});

// Schema cho delete attribute group
const DeleteAttributeGroupSchema = z.object({
    params: z.object({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.ATTRIBUTE_GROUP_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_GROUP_ID_REQUIRED]}`,
        }),
    }),
});


module.exports = {
    AttributeSchema,
    CreateAttributeGroupSchema,
    UpdateAttributeGroupSchema,
    DeleteAttributeGroupSchema,
};