const { ERROR_CODES, STATUS_CODE, ERROR_MESSAGES } = require("../contants/errors");
const { generateImportID } = require("../helpers/generate.helper");
const { getImportNumber, generateDetailImportBatchCode } = require("../helpers/import.warehouse.helper");
const { validateNumber } = require("../helpers/number.helper");
const { check_list_info_product } = require("../helpers/product.helper");
const { prisma, isExistId } = require("../helpers/query.helper");

const { get_error_response } = require("../helpers/response.helper");
const { executeSelectData } = require("../helpers/sql_query");


function configDataImportWarehouse(rows) {
    const result = [];

    const map = new Map();

    rows.forEach(row => {
        const importId = row.id;

        if (!map.has(importId)) {
            // Tạo object mới cho mỗi phiếu nhập
            const importData = {
                id: row.id,
                employee_name: row.employee_name,
                warehouse_name: row.warehouse_name,
                import_date: row.import_date,
                file_authenticate: row.file_authenticate,
                total_money: row.total_money,
                note: row.note,
                products: []
            };
            map.set(importId, importData);
            result.push(importData);
        }

        // Đẩy sản phẩm vào mảng products nếu có
        if (row.product_name) {
            map.get(importId).products.push({
                product_name: row.product_name,
                quantity: row.quantity,
                import_price: row.import_price,
                amount: row.amount,
                is_gift: row.is_gift,
                note: row.detail_import_note,
                amount_detail: row.detail_import_amount
            });
        }
    });

    return result;
}

async function getImportWarehouseService(filter, limit, sort, order) {
    let get_attr = `
        import_warehouse.id,
        CONCAT(employee.surname, ' ',employee.lastname) AS employee_name,
        CONCAT(warehouse.name) AS warehouse_name,
        import_warehouse.import_date,
        import_warehouse.file_authenticate,
        import_warehouse.total_money,
        import_warehouse.note
    `;

    let get_table = `\`import_warehouse\``;
    let query_join = `
        LEFT JOIN employee ON import_warehouse.employee_id = employee.id
        LEFT JOIN warehouse ON import_warehouse.warehouse_id = warehouse.id
    `;

    try {
        const importWarehouse = await executeSelectData ({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            limit: limit,
            filter: filter,
            sort: sort,
            order: order,
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            importWarehouse
        );
    } catch (error) {
        console.error('Lỗi:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.BAD_REQUEST
        );
    }
}

async function getImportWarehouseDetailService(id) {

    const filter = [{
        filter: {
            field: "import_warehouse.id",
            condition: "=",
            value: id
        }
    }]

    let get_attr = `
        import_warehouse.id,
        CONCAT(employee.surname, ' ',employee.lastname) AS employee_name,
        CONCAT(warehouse.name) AS warehouse_name,
        import_warehouse.import_date,
        import_warehouse.file_authenticate,
        import_warehouse.total_money,
        import_warehouse.note,

        product.name as product_name,
        detail_import.quantity,
        detail_import.import_price,
        detail_import.amount,
        detail_import.is_gift,
        detail_import.note as detail_import_note,
        detail_import.amount as detail_import_amount,
        
    `;

    let get_table = `\`import_warehouse\``;
    let query_join = `
        LEFT JOIN employee ON import_warehouse.employee_id = employee.id
        LEFT JOIN warehouse ON import_warehouse.warehouse_id = warehouse.id
        LEFT JOIN detail_import ON import_warehouse.id = detail_import.import_id
        LEFT JOIN product ON detail_import.product_id = product.id
    `;

    try {
        const importWarehouse = await executeSelectData ({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            filter: filter,
            configData: configDataImportWarehouse
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            importWarehouse
        );
    } catch (error) {
        console.error('Lỗi:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.BAD_REQUEST
        );
    }
}

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
    getImportWarehouseService,
    getImportWarehouseDetailService
}