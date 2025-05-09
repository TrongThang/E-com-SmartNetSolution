const { ERROR_CODES, STATUS_CODE, ERROR_MESSAGES } = require("../contants/errors");
const { validateNumber } = require("../helpers/number.helper");
const { check_list_info_product } = require("../helpers/product.helper");
const { prisma, isExistId } = require("../helpers/query.helper");

const { get_error_response } = require("../helpers/response.helper.helper");

async function createImportWarehouse(importWarehouse) {
    const employee = await isExistId(importWarehouse.employee_id, "employee")

    if (!employee) {
        return get_error_response(ERROR_CODES.EMPLOYEE_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    const warehouse = await isExistId(importWarehouse.warehouse_id, "warehouse")
    if (!warehouse) {
        return get_error_response(ERROR_CODES.WAREHOUSE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    
    const fields = [
        { value: importWarehouse.total_money, error: ERROR_CODES.TOTAL_IMPORT_MONEY_NOT_NUMBER },
        { value: importWarehouse.prepaid, error: ERROR_CODES.ORDER_TOTAL_MONEY_INVALID },
    ]

    for (const field of fields) {
        const error = validateNumber(field.value);
        if (error) {
            return get_error_response(field.error, STATUS_CODE.BAD_REQUEST);
        }
    }

    const importWarehouseData = await prisma.import_warehouse.create({
        data: {
            employee_id: importWarehouse.employee_id,
            warehouse_id: importWarehouse.warehouse_id,
            import_date: importWarehouse.import_date,
            file_authenticate: importWarehouse.file_authenticate,
            total_money: importWarehouse.total_money,
            prepaid: importWarehouse.prepaid,
            remaining: importWarehouse.remaining,
            note: importWarehouse.note,
        }
    })

    if (!importWarehouseData) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }


    for (const detailImport of importWarehouse.details) {
        const detailImportResult = await prisma.detail_import.create({
            data: {
                import_id: importWarehouseId,
                product_id: detailImport.product_id,
                quantity: detailImport.quantity,
                import_price: detailImport.import_price,
                discount: detailImport.discount, 
                amount: detailImport.amount,
                is_gift: detailImport.is_gift
            }
        })
    }
    return 
}

async function addDetailImport(importWarehouseId, detailImport) {

    // Kiểm tra sản phẩm
    const product = await isExistId(importWarehouseId, "product")

    if (!product) {
        return get_error_response(ERROR_CODES.PRODUCT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (validateNumber(detailImport.quantity)) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_PRODUCT_QUANTITY_INVALID, STATUS_CODE.BAD_REQUEST);
    }

    const detailImportResult = await prisma.detail_import.create({
        data: {
            import_id: importWarehouseId,
            product_id: detailImport.product_id,
            quantity: detailImport.quantity,
            import_price: detailImport.import_price,
            discount: detailImport.discount, 
            amount: detailImport.amount,
            is_gift: detailImport.is_gift
        }
    })

    if (!detailImportResult) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }

    for (const item of detailImport.productSerials) {
        const serialInsertResult = await prisma.product_serial.create({
            data: {
                imp_batch_id: detailImportResult.batch_code,
                product_id: detailImport.product_id,
                serial_number: item.serialNumber
            }
        });

        if(!serialInsertResult) {
            return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
        }
    }

    return detailImportResult;
}

module.exports = {
    createImportWarehouse,
}