const { z } = require('zod');
const { ERROR_CODES, ERROR_MESSAGES } = require('../contants/errors');

const BaseAddressBookSchema = z.object({
    body: z.object({
        customer_id: z.string({
            message: `[${ERROR_CODES.ADDRESS_BOOK_CUSTOMER_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_CUSTOMER_ID_REQUIRED]}`,
        }),
        receiver_name: z.string({
            message: `[${ERROR_CODES.ADDRESS_BOOK_RECEIVER_NAME_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_RECEIVER_NAME_REQUIRED]}`,
        }).max(255, {
            message: `[${ERROR_CODES.ADDRESS_BOOK_RECEIVER_NAME_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_RECEIVER_NAME_MAX_LENGTH]}`,
        }),
        phone: z.string({
            message: `[${ERROR_CODES.ADDRESS_BOOK_PHONE_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_PHONE_REQUIRED]}`,
        }).max(10, {
            message: `[${ERROR_CODES.ADDRESS_BOOK_PHONE_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_PHONE_MAX_LENGTH]}`,
        }).regex(/^[0-9]+$/, {
            message: `[${ERROR_CODES.ADDRESS_BOOK_PHONE_INVALID}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_PHONE_INVALID]}`,
        }),
        district: z.string()
            .max(500, {
                message: `[${ERROR_CODES.ADDRESS_BOOK_DISTRICT_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_DISTRICT_MAX_LENGTH]}`,
            }).optional(),
        city: z.string()
            .max(500, {
            message: `[${ERROR_CODES.ADDRESS_BOOK_CITY_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_CITY_MAX_LENGTH]}`,
        }).optional(),
        ward: z.string().max(500, {
            message: `[${ERROR_CODES.ADDRESS_BOOK_WARD_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_WARD_MAX_LENGTH]}`,
        }).optional(),
        street: z.string().max(500, {
            message: `[${ERROR_CODES.ADDRESS_BOOK_STREET_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_STREET_MAX_LENGTH]}`,
        }).optional(),
        detail: z.string().max(500, {
            message: `[${ERROR_CODES.ADDRESS_BOOK_DETAIL_MAX_LENGTH}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_DETAIL_MAX_LENGTH]}`,
        }),
        is_default: z.union([
            z.boolean(),
            z.string().transform((val) => val === "true")
        ], {
            invalid_type_error: `[${ERROR_CODES.ADDRESS_BOOK_IS_DEFAULT_INVALID}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_IS_DEFAULT_INVALID]}`,
        }).optional(),
    }),
});

const CreateAddressBookSchema = BaseAddressBookSchema;

const UpdateAddressBookSchema = BaseAddressBookSchema.extend({
    body: BaseAddressBookSchema.shape.body.extend({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.ADDRESS_BOOK_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_ID_REQUIRED]}`,
        }),
    }),
});

const DeleteAddressBookSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive({
            message: `[${ERROR_CODES.ADDRESS_BOOK_ID_REQUIRED}]${ERROR_MESSAGES[ERROR_CODES.ADDRESS_BOOK_ID_REQUIRED]}`,
        }),
    }),
});

module.exports = {
    CreateAddressBookSchema,
    UpdateAddressBookSchema,
    DeleteAddressBookSchema,
};