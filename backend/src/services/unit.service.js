const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const { executeSelectData } = require('../helpers/sql_query');
const prisma = require('../config/database');

// Lấy danh sách unit
const getUnitService = async (filter, limit, sort, order) => {
    let get_attr = ` name`;
    let get_table = `unit`;

    try {
        const units = await  executeSelectData({
            table: get_table,
            strGetColumn: get_attr,
            limit: limit,
            filter: filter,
            sort: sort,
            order: order
        });

        return get_error_response(error = ERROR_CODES.SUCCESS, status_code = STATUS_CODE.OK, data = units);
    } catch (error) {
        console.error('Error ', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Lấy chi tiết unit
const getUnitDetailService = async (id) => {
    try {
        const unit = await prisma.unit.findUnique({ where: { id: Number(id) } });
        if (!unit || unit.deleted_at) {
            return get_error_response(ERROR_CODES.UNIT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, unit);
    } catch (error) {
        console.error('Error in getUnitDetailService:', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Tạo unit
const createUnitService = async ({ name }) => {
    try {
        // Kiểm tra name đã tồn tại chưa (chưa bị xóa mềm)
        const exist = await prisma.unit.findFirst({ where: { name, deleted_at: null } });
        if (exist) {
            return get_error_response(ERROR_CODES.UNIT_NAME_EXISTED, STATUS_CODE.CONFLICT);
        }
        const unit = await prisma.unit.create({
            data: { name, created_at: new Date(), updated_at: new Date() }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.CREATED, unit);
    } catch (error) {
        console.error('Error in createUnitService:', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Cập nhật unit
const updateUnitService = async ({ id, name }) => {
    try {
        const unit = await prisma.unit.findUnique({ where: { id } });
        if (!unit || unit.deleted_at) {
            return get_error_response(ERROR_CODES.UNIT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        // Kiểm tra name đã tồn tại ở unit khác chưa (chưa bị xóa mềm)
        const exist = await prisma.unit.findFirst({ where: { name, id: { not: id }, deleted_at: null } });
        if (exist) {
            return get_error_response(ERROR_CODES.UNIT_NAME_EXISTED, STATUS_CODE.CONFLICT);
        }
        const updated = await prisma.unit.update({
            where: { id },
            data: { name, updated_at: new Date() }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, updated);
    } catch (error) {
        console.error('Error in updateUnitService:', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Xóa unit
const deleteUnitService = async (id) => {
    try {
        const unit = await prisma.unit.findUnique({ where: { id } });
        if (!unit || unit.deleted_at) {
            return get_error_response(ERROR_CODES.UNIT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        // Kiểm tra xem có product nào dùng unit này không
        const product = await prisma.product.findFirst({ where: { unit_id: id } });
        if (product) {
            return get_error_response(ERROR_CODES.UNIT_IN_USE, STATUS_CODE.CONFLICT);
        }
        await prisma.unit.update({
            where: { id },
            data: { deleted_at: new Date() }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK);
    } catch (error) {
        console.error('Error in deleteUnitService:', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    getUnitService,
    getUnitDetailService,
    createUnitService,
    updateUnitService,
    deleteUnitService
};