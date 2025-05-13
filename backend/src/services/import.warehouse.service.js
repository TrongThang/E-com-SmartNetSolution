const { ERROR_CODES, STATUS_CODE, ERROR_MESSAGES } = require("../contants/errors");
const { generateImportID } = require("../helpers/generate.helper");
const { getImportNumber } = require("../helpers/import.warehouse.helper");
const { validateNumber } = require("../helpers/number.helper");
const { check_list_info_product } = require("../helpers/product.helper");
const { prisma, isExistId } = require("../helpers/query.helper");

const { get_error_response } = require("../helpers/response.helper");

async function createImportWarehouse(importWarehouse) {
    const employee = await isExistId(importWarehouse.employee_id, "employee")

    if (!employee) {
        return get_error_response(ERROR_CODES.EMPLOYEE_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    const warehouse = await isExistId(importWarehouse.warehouse_id, "warehouse")
    if (!warehouse) {
        return get_error_response(ERROR_CODES.WAREHOUSE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const importNumber = getImportNumber(importWarehouse.import_date) + 1
    const importID = generateImportID(importNumber)

    const importWarehouseData = await prisma.import_warehouse.create({
        data: {
            import_number: importNumber,
            import_id: importID,
            employee_id: importWarehouse.employee_id,
            warehouse_id: importWarehouse.warehouse_id,
            import_date: importWarehouse.import_date,
            file_authenticate: importWarehouse.file_authenticate,
            total_money: importWarehouse.total_money,
            note: importWarehouse.note,
        }
    })

    if (!importWarehouseData) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }


    for (const detailImport of importWarehouse.detail_import) {
        const detailImportResult = await addDetailImport(importWarehouseData.id, detailImport)

        if (!detailImportResult) {
            return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
        }
    }
    return get_success_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_SUCCESS, STATUS_CODE.OK, importWarehouseData);
}

async function addDetailImport(importWarehouseId, detailImport) {

    // Kiểm tra sản phẩm
    const product = await isExistId(detailImport.product_id, "product")

    if (!product) {
        return get_error_response(ERROR_CODES.PRODUCT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const detailImportResult = await prisma.detail_import.create({
        data: {
            import_id: importWarehouseId,
            product_id: detailImport.product_id,
            quantity: detailImport.quantity,
            import_price: detailImport.import_price,
            amount: detailImport.amount,
            is_gift: detailImport.is_gift,
            note: detailImport.note
        }
    })

    if (!detailImportResult) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }

    let totalQuantity = 0
    for (const item of detailImport.batch_product_detail) {
        const isExistSerial = await prisma.product_serial.findFirst({
            where: {
                serial_number: item.serial_number,
                deleted_at: null
            }
        })

        if (isExistSerial) {
            return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_SERIAL_NUMBER_EXIST, STATUS_CODE.BAD_REQUEST);
        }
        const serialInsertResult = await prisma.product_serial.create({
            data: {
                imp_batch_id: detailImportResult.batch_code,
                product_id: detailImport.product_id,
                serial_number: item.serial_number
            }
        });

        if(!serialInsertResult) {
            return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
        }

        totalQuantity += 1
    }

    const warehouseInventory = await prisma.warehouse_inventory.create({
        data: {
            product_id: detailImport.product_id,
            warehouse_id: importWarehouseId,
            quantity: totalQuantity
        }
    })

    if (!warehouseInventory) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }

    return detailImportResult;
}

module.exports = {
    createImportWarehouse,
}