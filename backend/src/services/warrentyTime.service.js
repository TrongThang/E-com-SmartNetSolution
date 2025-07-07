const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const { executeSelectData } = require('../helpers/sql_query');
const prisma = require('../config/database');

// Lấy danh sách warrenty time
const getWarrentyTimeService = async (filter, limit, sort, order) => {
    let get_attr = `name, time`;
    let get_table = `warrenty_time`;

    try {
        const data = await executeSelectData({
            table: get_table,
            strGetColumn: get_attr,
            limit: limit,
            filter: filter,
            sort: sort,
            order: order
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, data);
    } catch (error) {
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Lấy chi tiết warrenty time
const getWarrentyTimeDetailService = async (id) => {
    try {
        const filter = JSON.stringify([
            { field: "warrenty_time.id", condition: "=", value: Number(id) }
        ]);
        const data = await executeSelectData({
            table: "warrenty_time",
            strGetColumn: "id, name, time, created_at, updated_at",
            filter: filter,
            limit: 1
        });
        const result = data?.data?.[0];
        if (!result) {
            return get_error_response(ERROR_CODES.WARRANTY_TIME_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, result);
    } catch (error) {
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR, null, error.message);
    }
};

// Tạo mới warrenty time
const createWarrentyTimeService = async ({ name, time }) => {
    try {
        const exist = await prisma.warrenty_time.findFirst({ where: { name, deleted_at: null } });
        if (exist) {
            return get_error_response(ERROR_CODES.WARRANTY_TIME_NAME_EXISTED, STATUS_CODE.CONFLICT);
        }
        const data = await prisma.warrenty_time.create({
            data: { name, time }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.CREATED, data);
    } catch (error) {
        console.log("Loi khi tao warranty time :", error);
        return get_error_response(ERROR_CODES.WARRANTY_TIME_CREATE_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Cập nhật warrenty time
const updateWarrentyTimeService = async ({ id, name, time }) => {
    try {
        const exist = await prisma.warrenty_time.findUnique({ where: { id: Number(id) } });
        if (!exist || exist.deleted_at) {
            return get_error_response(ERROR_CODES.WARRANTY_TIME_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        // Check if name already exists for a different warranty time
        const nameExists = await prisma.warrenty_time.findFirst({
            where: {
                name,
                id: { not: Number(id) },
                deleted_at: null
            }
        });
        if (nameExists) {
            return get_error_response(ERROR_CODES.WARRANTY_TIME_NAME_EXISTED, STATUS_CODE.CONFLICT);
        }

        const updated = await prisma.warrenty_time.update({
            where: { id: Number(id) },
            data: {
                name,
                time: Number(time),
                updated_at: new Date()
            }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, updated);
    } catch (error) {
        return get_error_response(ERROR_CODES.WARRANTY_TIME_UPDATED_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR, null, error.message);
    }
};

// Xóa mềm warrenty time
const deleteWarrentyTimeService = async (id) => {
    try {
        const exist = await prisma.warrenty_time.findUnique({ where: { id: Number(id) } });
        if (!exist || exist.deleted_at) {
            return get_error_response(ERROR_CODES.WARRANTY_TIME_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        // Kiểm tra liên kết với product
        const product = await prisma.product.findFirst({ where: { warrenty_time_id: id } });
        if (product) {
            return get_error_response(ERROR_CODES.WARRANTY_TIME_IN_USE, STATUS_CODE.CONFLICT);
        }
        await prisma.warrenty_time.update({
            where: { id: Number(id) },
            data: { deleted_at: new Date() }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK);
    } catch (error) {
        return get_error_response(ERROR_CODES.WARRANTY_TIME_DELETED_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR, null, error.message);
    }
};

module.exports = {
    getWarrentyTimeService,
    getWarrentyTimeDetailService,
    createWarrentyTimeService,
    updateWarrentyTimeService,
    deleteWarrentyTimeService
};