const { ERROR_CODES, STATUS_CODE } = require("../contants/errors");
const { generateImportID } = require("../helpers/generate.helper");
const { getImportNumber, generateDetailImportBatchCode } = require("../helpers/import.warehouse.helper");
const queryHelper = require("../helpers/query.helper");

const { get_error_response } = require("../helpers/response.helper");
const { executeSelectData } = require("../helpers/sql_query");
const { IMPORT_WAREHOUSE, ROLE } = require("../contants/info");
const sseController = require('../controllers/sse.controller');
const prisma = require('../config/database');

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

function configDataImportWarehouseDetail(rows) {
    const result = [];

    const map = new Map();

    rows.forEach(row => {
        const importId = row.id;
    
        if (!map.has(importId)) {
            const importData = {
                id: row.id,
                import_date: row.import_date,
                employee_name: row.employee_name,
                warehouse_name: row.warehouse_name,
                file_authenticate: row.file_authenticate,
                total_money: row.total_money,
                note: row.note,
                products: []
            }
    
            map.set(importId, importData);
            result.push(importData);
        }
    
        if (row.product_name) {
            // Find if product already exists
            const currentProduct = map.get(importId).products.find(p => p.product_id === row.product_id);
            
            if (!currentProduct) {
                // Add new product if it doesn't exist
                map.get(importId).products.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    product_image: row.product_image,
                    quantity: row.quantity,
                    import_price: row.import_price,
                    batch_product_detail: []
                });
            }

            const product = map.get(importId).products.find(p => p.product_id === row.product_id);
    
            if (row.batch_production_id) {
                const existingBatch = product.batch_product_detail.find(b => b.id === row.batch_production_id);
                
                if (!existingBatch) {
                    product.batch_product_detail.push({
                        id: row.batch_production_id,
                        serials: []
                    });
                }
    
                const batch = product.batch_product_detail.find(b => b.id === row.batch_production_id);
    
                if (row.serial_number) {
                    if (!batch.serials.some(s => s.serial_number === row.serial_number)) {
                        batch.serials.push({
                            serial_number: row.serial_number
                        });
                    }
                }
            }
        }
    })

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
        import_warehouse.note,
        import_warehouse.status
    `;

    let get_table = `\`import_warehouse\``;
    let query_join = `
        LEFT JOIN employee ON import_warehouse.employee_id = employee.id
        LEFT JOIN warehouse ON import_warehouse.warehouse_id = warehouse.id
    `;

    try {
        const importWarehouse = await executeSelectData({
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
    const filter = {
        field: "import_warehouse.id",
        condition: "=",
        value: id
    }

    let get_attr = `
        import_warehouse.id,
        CONCAT(employee.surname, ' ',employee.lastname) AS employee_name,
        CONCAT(warehouse.name) AS warehouse_name,
        import_warehouse.import_date,
        import_warehouse.file_authenticate,
        import_warehouse.total_money,
        import_warehouse.note,

        product.id as product_id,
        product.name as product_name,
        product.image as product_image,
        detail_import.quantity,
        detail_import.import_price,

        batch_product_detail.serial_number,
        batch_product_detail.batch_production_id
    `;

    let get_table = `\`import_warehouse\``;
    let query_join = `
        LEFT JOIN employee ON import_warehouse.employee_id = employee.id
        LEFT JOIN warehouse ON import_warehouse.warehouse_id = warehouse.id
        LEFT JOIN detail_import ON import_warehouse.id = detail_import.import_id
        LEFT JOIN product ON detail_import.product_id = product.id
        LEFT JOIN batch_product_detail ON detail_import.batch_code = batch_product_detail.imp_batch_id
    `;

    try {
        const importWarehouse = await executeSelectData({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            filter: filter,
            configData: configDataImportWarehouseDetail
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
    // Validation checks outside transaction
    const employee = await prisma.account.findFirst({
        where: {
            employee_id: importWarehouse.employee_id,
            deleted_at: null
        },
    })

    if (!employee) {
        return get_error_response(ERROR_CODES.EMPLOYEE_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    if (employee.role_id !== ROLE.EMPLOYEE_WAREHOUSE) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_EMPLOYEE_NOT_AUTHORIZED, STATUS_CODE.BAD_REQUEST);
    }

    const warehouse = await prisma.warehouse.findFirst({
        where: {
            id: Number(importWarehouse.warehouse_id),
            deleted_at: null
        }
    })
    if (!warehouse) {
        return get_error_response(ERROR_CODES.WAREHOUSE_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    // Validate all products before starting transaction
    for (const detailImport of importWarehouse.detail_import) {
        const product = await prisma.product.findFirst({
            where: {
                id: detailImport.product_id,
                deleted_at: null
            }
        })

        if (!product) {
            return get_error_response(ERROR_CODES.PRODUCT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
    }

    const importNumber = await getImportNumber(importWarehouse.import_date) + 1
    const importID = generateImportID(importNumber, importWarehouse.import_date)

    try {
        // Wrap all database operations in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create import warehouse
            const importWarehouseData = await tx.import_warehouse.create({
                data: {
                    id: importID,
                    import_number: importNumber,
                    employee_id: importWarehouse.employee_id,
                    warehouse_id: Number(importWarehouse.warehouse_id),
                    import_date: importWarehouse.import_date,
                    note: importWarehouse.note,
                    status: IMPORT_WAREHOUSE.PENDING,
                    created_at: new Date(),
                }
            })

            if (!importWarehouseData) {
                throw new Error('Failed to create import warehouse');
            }

            for (const detailImport of importWarehouse.detail_import) {
                const batchCode = await generateDetailImportBatchCode(importWarehouse.import_date, detailImport.product_id)
                
                const detailImportResult = await tx.detail_import.create({
                    data: {
                        batch_code: batchCode,
                        import_id: importWarehouseData.id,
                        product_id: detailImport.product_id,
                        quantity: detailImport.quantity,
                        created_at: new Date(),
                    }
                })

                if (!detailImportResult) {
                    throw new Error('Failed to create detail import');
                }

                const batchProductDetail = await tx.warehouse_inventory.create({
                    data: {
                        batch_code: batchCode,
                        product: {
                            connect: {
                                id: detailImport.product_id,
                            }
                        },
                        stock: 0,
                        created_at: new Date(),
                    }
                })

                if (!batchProductDetail) {
                    throw new Error('Failed to create warehouse inventory');
                }
            }

            return importWarehouseData;
        });

        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_SUCCESS, STATUS_CODE.OK, result);

    } catch (error) {
        console.error('Transaction error:', error);
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }
}

async function getProcessImportWarehouseService(importWarehouseId) {
    const queryProductNeed = `
        SELECT 
            di.product_id, product.name as product_name, di.quantity as total_serial_need
        FROM detail_import di
            LEFT JOIN product ON product.id = di.product_id
        WHERE di.import_id = '${importWarehouseId}' AND di.deleted_at IS NULL
    `

    const queryProductImported = `
        SELECT di.product_id, CAST(COUNT(serial_number) AS CHAR) AS total_serial_imported
            FROM detail_import di
            LEFT JOIN batch_product_detail ON batch_product_detail.imp_batch_id = di.batch_code
        WHERE di.import_id = '${importWarehouseId}' AND di.deleted_at IS NULL
        GROUP BY di.product_id
    `

    const resultProductNeed = await queryHelper.queryRaw(queryProductNeed)
    const resultProductImported = await queryHelper.queryRaw(queryProductImported)

    const result = []
    for (const item of resultProductNeed) {
        const product = resultProductImported.find(product => product.product_id === item.product_id)
        result.push({
            product_id: item.product_id,
            product_name: item.product_name,
            total_serial_need: item.total_serial_need,
            total_serial_imported: product ? product.total_serial_imported : 0
        })
    }

    return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, result);
}

async function StartImportWarehouseService(import_id, account_id) {
    const account = await prisma.account.findFirst({
        where: {
            account_id: account_id,
            deleted_at: null
        }
    })

    if (!account) {
        return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const importWarehouse = await prisma.import_warehouse.findFirst({
        where: {
            id: import_id,
            deleted_at: null
        }
    })  

    if (!importWarehouse) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if(importWarehouse.status !== IMPORT_WAREHOUSE.PENDING) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_REQUIRE_STATUS_PENDING, STATUS_CODE.BAD_REQUEST);
    }

    if(importWarehouse.employee_id !== account.employee_id) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_NOT_ASSIGNED_EMPLOYEE_FOR_RECEIPT, STATUS_CODE.BAD_REQUEST);
    }
    
    const importWarehouseUpdate = await prisma.import_warehouse.update({
        where: {
            id: import_id
        },
        data: {
            status: IMPORT_WAREHOUSE.IMPORTING,
            employee_id: account.employee_id
        }   
    })

    if (!importWarehouseUpdate) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_UPDATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }

    return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, importWarehouseUpdate);
}

// batch_production_id: id lô sản xuất - id production batches
// Mỗi lần là 1 sản phẩm
async function importProductService(import_id, batch_production_id, template_id, serial_number, account_id) {
    const account = await prisma.account.findFirst({
        where: {
            account_id: account_id,
            deleted_at: null
        }
    })

    if (!account) {
        return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const importWarehouse = await prisma.import_warehouse.findFirst({
        where: {
            id: import_id,
            deleted_at: null
        }
    })

    if (!importWarehouse) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (importWarehouse.status !== IMPORT_WAREHOUSE.IMPORTING) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_REQUIRE_STATUS_IMPORTING, STATUS_CODE.BAD_REQUEST);
    }

    if (importWarehouse.employee_id !== account.employee_id) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_NOT_ASSIGNED_EMPLOYEE_FOR_RECEIPT, STATUS_CODE.BAD_REQUEST);
    }

    // Kiểm tra sản phẩm đã được nhập vào lô sản xuất chưa và trạng thái của sản phẩm có phải đang chờ nhập kho không
    const productionSerial = await queryHelper.queryRaw(`
        SELECT 
            production_tracking.production_id,
            production_tracking.device_serial,
            production_batches.template_id,
            production_tracking.status
        FROM production_tracking 
            LEFT JOIN production_batches ON production_tracking.production_batch_id = production_batches.production_batch_id
        WHERE
            device_serial = '${serial_number}' 
            AND production_tracking.is_deleted IS false
            AND production_batches.template_id = '${template_id}'
    `)

    if (!productionSerial) {
        return get_error_response(ERROR_CODES.SERIAL_NUMBER_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    if(productionSerial[0].status !== 'pending_import') {
        return get_error_response(ERROR_CODES.SERIAL_NUMBER_NOT_PENDING_IMPORT, STATUS_CODE.BAD_REQUEST);
    }

    const batchProductDetail = await prisma.batch_product_detail.findFirst({
        where: {
            serial_number: serial_number,
            deleted_at: null
        }
    })

    if(batchProductDetail) {
        // Nếu khác => Đã có và serial này khôg thuộc về lô sản xuất này
        if (batchProductDetail.batch_production_id !== batch_production_id) {
            return get_error_response(ERROR_CODES.SERIAL_NUMBER_IS_EXISTED_AND_NOT_IN_BATCH_PRODUCTION, STATUS_CODE.BAD_REQUEST);
        } else if (batchProductDetail.batch_production_id === batch_production_id) {
            // Nếu giống => Đã có và serial này thuộc về lô sản xuất này
            return get_error_response(ERROR_CODES.SERIAL_NUMBER_IS_EXISTED_AND_IN_BATCH_PRODUCTION, STATUS_CODE.BAD_REQUEST);
        }
    }

    const detailImport = await prisma.detail_import.findFirst({
        where: {
            import_id: import_id,
            product_id: template_id
        }
    })

    if(!detailImport) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_DETAIL_IMPORT_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    const batchProductDetailInsert = await prisma.batch_product_detail.create({
        data: {
            // product_id: productionSerial.template_id,
            batch_production_id: batch_production_id,
            serial_number: serial_number,
            imp_batch_id: detailImport.batch_code
        }
    })

    if (!batchProductDetailInsert) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }

    await prisma.production_tracking.update({
        where: {
            production_id: productionSerial[0].production_id
        },
        data: {
            status: 'in_stock'
        }
    })

    const warehouseInventory = await prisma.warehouse_inventory.findFirst({
        where: {
            batch_code: detailImport.batch_code,
            product_id: template_id,
            deleted_at: null
        }
    })

    if (!warehouseInventory) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_BATCH_CODE_INVENTORY_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    const warehouseInventoryUpdate = await prisma.warehouse_inventory.update({
        where: {
            id: warehouseInventory.id
        },
        data: {
            stock: warehouseInventory.stock + 1
        }
    })

    if (!warehouseInventoryUpdate) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_UPDATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }
    
    sseController.sendImportWarehouseUpdate({
        type: 'update_import_warehouse',
        import_id: import_id,
        product_id: template_id,
        serial_number: serial_number
    })

    return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, batchProductDetailInsert);
}

async function getImportWarehouseNotFinishForEmployee(accountId) {
    const account = await prisma.account.findFirst({
        where: {
            account_id: accountId,
            deleted_at: null
        }
    })

    if (!account) {
        return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // if (account.role_id !== ROLE.EMPLOYEE_WAREHOUSE) {
    //     return get_error_response(ERROR_CODES.ACCOUNT_NOT_AUTHORIZED, STATUS_CODE.BAD_REQUEST);
    // }

    const importWarehouse = await prisma.import_warehouse.findMany({
        where: {
            employee_id: account.employee_id,
            status: {
                in: [IMPORT_WAREHOUSE.PENDING, IMPORT_WAREHOUSE.IMPORTING]
            },
            deleted_at: null
        }
    })

    if (!importWarehouse) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, importWarehouse);
}

async function confirmFinishedImportWarehouseService(import_id, account_id) {
    const account = await prisma.account.findFirst({
        where: {
            account_id: account_id,
            deleted_at: null
        }
    })

    if (!account) {
        return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    
    const processImportWarehouse = await getProcessImportWarehouseService(import_id)

    if (!processImportWarehouse) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    
    if (processImportWarehouse.data[0].total_serial_need > 0) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_NOT_FINISH, STATUS_CODE.NOT_FOUND);
    }

    const importWarehouseUpdate = await prisma.import_warehouse.update({
        where: {
            id: import_id
        },
        data: {
            status: IMPORT_WAREHOUSE.FINISHED
        }
    })

    if (!importWarehouseUpdate) {
        return get_error_response(ERROR_CODES.IMPORT_WAREHOUSE_UPDATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }

    return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, importWarehouseUpdate);
}
module.exports = {
    createImportWarehouse,
    getImportWarehouseService,
    getImportWarehouseDetailService,
    getProcessImportWarehouseService,
    StartImportWarehouseService,
    importProductService,
    getImportWarehouseNotFinishForEmployee,
    confirmFinishedImportWarehouseService
}