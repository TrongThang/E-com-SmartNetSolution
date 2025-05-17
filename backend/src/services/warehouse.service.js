const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const { executeSelectData } = require('../helpers/sql_query');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy danh sách warehouse
const getWarehouseService = async (filter, limit, sort, order) => {
    let get_attr = `name, address`;
    let get_table = `warehouse`;

    try {
        const warehouses = await executeSelectData({
            table: get_table,
            strGetColumn: get_attr,
            limit,
            filter,
            sort,
            order
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, warehouses);
    } catch (error) {
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Lấy chi tiết warehouse (bao gồm sản phẩm đã nhập vào kho)
const getWarehouseDetailService = async (id) => {
    try {
        // Lấy thông tin kho
        const warehouse = await prisma.warehouse.findUnique({
            where: { id: Number(id) }
        });
        if (!warehouse || warehouse.deleted_at) {
            return get_error_response(ERROR_CODES.WAREHOUSE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        // Lấy danh sách sản phẩm đã nhập vào kho này
        // Join: warehouse -> import_warehouse -> detail_import -> product
        const filter = JSON.stringify([
            { field: "import_warehouse.warehouse_id", condition: "=", value: Number(id) }
        ]);
        const get_attr = `
            product.id, product.name, product.slug, product.image, product.selling_price, product.status, 
            detail_import.quantity, detail_import.amount, detail_import.import_price
        `;
        const get_table = "product";
        const query_join = `
            INNER JOIN detail_import ON product.id = detail_import.product_id
            INNER JOIN import_warehouse ON detail_import.import_id = import_warehouse.id
        `;

        const productsResult = await executeSelectData({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            filter: filter
        });

        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, {
            ...warehouse,
            products: productsResult.data
        });
    } catch (error) {
        console.log(error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};
// const getWarehouseDetailService = async (id) => {
//     try {
//         // Lấy thông tin kho
//         const warehouse = await prisma.warehouse.findUnique({
//             where: { id: Number(id) }
//         });
//         if (!warehouse || warehouse.deleted_at) {
//             return get_error_response(ERROR_CODES.WAREHOUSE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
//         }

//         return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, warehouse);
//     } catch (error) {
//         console.log(error);
//         return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
//     }
// };

// Tạo warehouse
const createWarehouseService = async ({ name, address }) => {
    try {
        const exist = await prisma.warehouse.findFirst({ where: { name, deleted_at: null } });
        if (exist) {
            return get_error_response(ERROR_CODES.WAREHOUSE_NAME_EXISTED, STATUS_CODE.CONFLICT);
        }
        const warehouse = await prisma.warehouse.create({
            data: { name, address, created_at: new Date(), updated_at: new Date() }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.CREATED, warehouse);
    } catch (error) {
        console.log(error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Cập nhật warehouse
const updateWarehouseService = async ({ id, name, address }) => {
    try {
        const warehouse = await prisma.warehouse.findUnique({ where: { id: Number(id) } });
        if (!warehouse || warehouse.deleted_at) {
            return get_error_response(ERROR_CODES.WAREHOUSE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        const existingWarehouse = await prisma.warehouse.findFirst({
            where: {
                name,
                id: { not: Number(id) },
                deleted_at: null
            }
        });

        if (existingWarehouse) {
            return get_error_response(ERROR_CODES.WAREHOUSE_NAME_EXISTED, STATUS_CODE.CONFLICT);
        }

        const updated = await prisma.warehouse.update({
            where: { id: Number(id) },
            data: { name, address, updated_at: new Date() }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, updated);
    } catch (error) {
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Xóa mềm warehouse
const deleteWarehouseService = async (id) => {
    try {
        const warehouse = await prisma.warehouse.findUnique({ where: { id: Number(id) } });
        if (!warehouse || warehouse.deleted_at) {
            return get_error_response(ERROR_CODES.WAREHOUSE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        // Kiểm tra liên kết với import_warehouse
        const importWarehouse = await prisma.import_warehouse.findFirst({ where: { warehouse_id: id } });
        if (importWarehouse) {
            return get_error_response(ERROR_CODES.WAREHOUSE_REFERENCE_IMPORT_INVOICE, STATUS_CODE.CONFLICT);
        }
        await prisma.warehouse.update({
            where: { id: Number(id) },
            data: { deleted_at: new Date() }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK);
    } catch (error) {
        console.log(error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    getWarehouseService,
    getWarehouseDetailService,
    createWarehouseService,
    updateWarehouseService,
    deleteWarehouseService
};