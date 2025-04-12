const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const BaseAttributeGroupSchema = z.object({
    body: z.object({
        name: z.string()
            .min(1, {
                message: `[${ERROR_CODES.ATTRIBUTE_GROUP_NAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_GROUP_NAME_MIN_LENGTH]}`,
            })
            .max(500, {
                message: `[${ERROR_CODES.ATTRIBUTE_GROUP_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_GROUP_NAME_MAX_LENGTH]}`,
            }),
        attributes: z.array(z.object({
            name: z.string()
                .min(1, {
                    message: `[${ERROR_CODES.ATTRIBUTE_NAME_MIN_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_NAME_MIN_LENGTH]}`,
                })
                .max(500, {
                    message: `[${ERROR_CODES.ATTRIBUTE_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_NAME_MAX_LENGTH]}`,
                }),
            datatype: z.enum(['string', 'boolean'], {
                message: `[${ERROR_CODES.ATTRIBUTE_DATATYPE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_DATATYPE_INVALID]}`,
            }),
            required: z.boolean({
                invalid_type_error: {
                    message: `[${ERROR_CODES.ATTRIBUTE_REQUIRED_INVALID}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_REQUIRED_INVALID]}`,
                },
            }),
            is_hide: z.boolean({
                invalid_type_error: {
                    message: `[${ERROR_CODES.ATTRIBUTE_IS_HIDE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_IS_HIDE_INVALID]}`,
                },
            }),
        }).optional(),
        )
    }),
});

const CreateAttributeGroupSchema = BaseAttributeGroupSchema;

const UpdateAttributeGroupSchema = BaseAttributeGroupSchema.extend({
    body: BaseAttributeGroupSchema.shape.body.extend({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.ATTRIBUTE_GROUP_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_GROUP_ID_REQUIRED]}`,
        }),
        attributes: z.array(
            BaseAttributeGroupSchema.shape.body.shape.attributes.element.extend({
                id: z.number().int().positive({
                    message: `[${ERROR_CODES.ATTRIBUTE_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_ID_REQUIRED]}`,
                }),
            })
        ).optional(),
    }),
});

const DeleteAttributeGroupSchema = z.object({
    params: z.object({
        id: z.number().int().positive({
            message: `[${ERROR_CODES.ATTRIBUTE_GROUP_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ATTRIBUTE_GROUP_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    CreateAttributeGroupSchema,
    UpdateAttributeGroupSchema,
    DeleteAttributeGroupSchema,
};