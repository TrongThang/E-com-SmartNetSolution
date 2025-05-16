const { ERROR_CODES, STATUS_CODE, ERROR_MESSAGES } = require("../contants/errors");
const { generateImportID } = require("../helpers/generate.helper");
const { getImportNumber, generateDetailImportBatchCode } = require("../helpers/import.warehouse.helper");
const { validateNumber } = require("../helpers/number.helper");
const { check_list_info_product } = require("../helpers/product.helper");
const { prisma, isExistId } = require("../helpers/query.helper");

const { get_error_response } = require("../helpers/response.helper.helper");

async function createImportWarehouse(importWarehouse) {
    const employee = await prisma.employee.findFirst({
        where: {
            id: importWarehouse.employee_id,
            deleted_at: null
        }
    })

    if (!employee) {
        return get_error_response(ERROR_CODES.EMPLOYEE_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    const warehouse = await prisma.warehouse.findFirst({
        where: {
            id: Number(importWarehouse.warehouse_id),
            deleted_at: null
        }
    })
    if (!warehouse) {
        return get_error_response(ERROR_CODES.WAREHOUSE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const importNumber = await getImportNumber(importWarehouse.import_date) + 1
    const importID = generateImportID(importNumber, importWarehouse.import_date)

    const importWarehouseData = await prisma.import_warehouse.create({
        data: {
            import_number: importNumber,
            import_id: importID,
            employee_id: importWarehouse.employee_id,
            warehouse_id: Number(importWarehouse.warehouse_id),
            import_date: importWarehouse.import_date,
            file_authenticate: importWarehouse.file_authenticate,
            total_money: importWarehouse.total_money,
            note: importWarehouse.note,
            created_at: new Date(),
        }
    })

    if (!importWarehouseData) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }


    for (const detailImport of importWarehouse.detail_import) {
        const detailImportResult = await addDetailImport(importWarehouseData.id, detailImport, importWarehouse.import_date)

        if (!detailImportResult) {
            return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
        }
    }
    return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_SUCCESS, STATUS_CODE.OK, importWarehouseData);
}

async function addDetailImport(importWarehouseId, detailImport, import_date) {

    // Kiểm tra sản phẩm
    const product = await prisma.product.findFirst({
        where: {
            id: detailImport.product_id,
            deleted_at: null
        }
    })

    if (!product) {
        return get_error_response(ERROR_CODES.PRODUCT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const batchCode = await generateDetailImportBatchCode(import_date, detailImport.product_id)

    const detailImportResult = await prisma.detail_import.create({
        data: {
            batch_code: batchCode,
            import_id: importWarehouseId,
            product_id: detailImport.product_id,
            quantity: detailImport.quantity,
            import_price: detailImport.import_price,
            amount: detailImport.amount,
            is_gift: detailImport.is_gift,
            note: detailImport.note,
            created_at: new Date(),
        }
    })

    if (!detailImportResult) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }

    let totalQuantity = 0
    for (const item of detailImport.batch_product_detail) {
        const isExistSerial = await prisma.batch_product_detail.findFirst({
            where: {
                serial_number: item.serial_number,
                deleted_at: null
            }
        }) 
        console.log("isExistSerial", isExistSerial)
        if (isExistSerial) {
            return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_SERIAL_NUMBER_EXIST, STATUS_CODE.BAD_REQUEST);
        }
        console.log("Thêm serial", item.serial_number)
        const serialInsertResult = await prisma.batch_product_detail.create({
            data: {
                batch_code: batchCode,
                product_id: detailImport.product_id,
                serial_number: item.serial_number
            }
        });

        totalQuantity += 1

        if(!serialInsertResult) {
            return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
        }

    }

    const warehouseInventory = await prisma.warehouse_inventory.findFirst({
        where: {
            batch_code: batchCode,
            product_id: detailImport.product_id,
            deleted_at: null
        }
    })

    if(!warehouseInventory) {
        const warehouseInventory = await prisma.warehouse_inventory.create({
            data: {
                batch_code: batchCode,
                product_id: detailImport.product_id,
                // warehouse_id: importWarehouseId, 
                quantity: totalQuantity
            }
        })
    } else {
        const warehouseInventoryUpdate = await prisma.warehouse_inventory.update({
            where: {
                id: warehouseInventory.id
            },
            data: {
                quantity: warehouseInventory.quantity + totalQuantity
            }   
        })  
    }

    return warehouseInventoryUpdate;
}

module.exports = {
    createImportWarehouse,
}