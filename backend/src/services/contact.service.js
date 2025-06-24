const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const { executeSelectData } = require('../helpers/sql_query');
const prisma = require('../config/database');

// Lấy danh sách contact
const getContactService = async (filter, limit, sort, order) => {
    let get_attr = `fullname, title, content, email, status`;
    let get_table = `contact`;

    try {
        const contacts = await executeSelectData({
            table: get_table,
            strGetColumn: get_attr,
            limit: limit,
            filter: filter,
            sort: sort,
            order: order
        });

        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, contacts);
    } catch (error) {
        console.error('Error ', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Lấy chi tiết contact
const getContactDetailService = async (id) => {
    try {
        const filter = JSON.stringify([
            { field: "contact.id", condition: "=", value: Number(id) }
        ]);
        const contacts = await executeSelectData({
            table: "contact",
            strGetColumn: "id, fullname, title, content, email, status, created_at, updated_at",
            filter: filter,
            limit: 1
        });
        const data = contacts?.data?.[0];
        if (!data) {
            return get_error_response(ERROR_CODES.CONTACT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, data);
    } catch (error) {
        console.error('Error in getContactDetailService:', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Tạo contact (status luôn là 1)
const createContactService = async ({ fullname, title, content, email }) => {
    try {
        const contact = await prisma.contact.create({
            data: {
                fullname,
                title,
                content,
                email,
                status: 1,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.CREATED, contact);
    } catch (error) {
        console.error('Error in createContactService:', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Cập nhật status contact
const updateContactStatusService = async ({ id, status }) => {
    try {
        const contact = await prisma.contact.findUnique({ where: { id } });
        if (!contact || contact.deleted_at) {
            return get_error_response(ERROR_CODES.CONTACT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        const updated = await prisma.contact.update({
            where: { id },
            data: {
                status: Number(status),
                updated_at: new Date()
            },
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, updated);
    } catch (error) {
        return get_error_response(ERROR_CODES.CONTACT_UPDATED_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR, null, error.message);
    }
};

// Xóa contact
const deleteContactService = async (id) => {
    try {
        const contact = await prisma.contact.findUnique({ where: { id: Number(id) } });
        if (!contact || contact.deleted_at) {
            return get_error_response(ERROR_CODES.CONTACT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        await prisma.contact.update({
            where: { id: Number(id) },
            data: { deleted_at: new Date() }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK);
    } catch (error) {
        console.error('Error in deleteContactService:', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    getContactService,
    getContactDetailService,
    createContactService,
    updateContactStatusService,
    deleteContactService
};