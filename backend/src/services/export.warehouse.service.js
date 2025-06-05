const { ERROR_CODES, STATUS_CODE, ERROR_MESSAGES } = require("../contants/errors");
const { ORDER } = require("../contants/info");
const { validateNumber } = require("../helpers/number.helper");
const { check_list_info_product } = require("../helpers/product.helper");
const { prisma, isExistId } = require("../helpers/query.helper");
const { get_error_response } = require("../helpers/response.helper");
const { getExportNumber } = require("../helpers/import.warehouse.helper");
const { generateExportNumber } = require("../helpers/generate.helper");
const { executeSelectData } = require("../helpers/sql_query");

function configDataExportWarehouse(rows) {
    const result = [];

    const map = new Map();

    rows.forEach(row => {
        const exportId = row.id;

        if (!map.has(exportId)) {
            const exportData = {
                id: row.id,
                employee_name: row.employee_name,
                export_date: row.export_date,
                file_authenticate: row.file_authenticate,
                total_profit: row.total_profit,
                note: row.note,
                products: []
            };
            map.set(exportId, exportData);
            result.push(exportData);

            if (row.product_name) {
                map.get(exportId).products.push({
                    product_name: row.product_name,
                    quantity: row.quantity,
                    sale_price: row.sale_price,
                    amount: row.amount,
                    is_gift: row.is_gift,
                    note: row.detail_export_note,
                    amount_detail: row.detail_export_amount
                });
            }
        }
    });

    return result;
}

async function getExportWarehouseService(filter, limit, sort, order) {
    let get_attr = `
        export_warehouse.id,
        CONCAT(employee.surname, ' ',employee.lastname) AS employee_name,
        export_warehouse.export_date,
        export_warehouse.file_authenticate,
        export_warehouse.total_profit,
        export_warehouse.note
    `;

    let get_table = `export_warehouse`;
    let query_join = `
        LEFT JOIN employee ON export_warehouse.employee_id = employee.id
    `;

    try {
        const exportWarehouse = await executeSelectData ({
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
            exportWarehouse
        );
    } catch (error) {
        console.error('Lỗi:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.BAD_REQUEST
        );
    }
}

async function getExportWarehouseDetailService(id) {
    const filter = [{
        filter: {
            field: "export_warehouse.id",
            condition: "=",
            value: id
        }
    }]

    let get_attr = `
        export_warehouse.id,
        CONCAT(employee.surname, ' ',employee.lastname) AS employee_name,
        export_warehouse.export_date,
        export_warehouse.file_authenticate,
        export_warehouse.total_profit,
        export_warehouse.note,

        detail_export.order_id,
        detail_export.product_id,
        product.name as product_name,
        detail_export.quantity,
        detail_export.sale_price,
        detail_export.amount,
        detail_export.is_gift,
        detail_export.note as detail_export_note,

        order_detail.batch_code,
        order_detail.serial_number,

    `;

    let get_table = `export_warehouse`;
    let query_join = `
        LEFT JOIN employee ON export_warehouse.employee_id = employee.id
        LEFT JOIN detail_export ON export_warehouse.id = detail_export.export_id
        LEFT JOIN product ON detail_export.product_id = product.id
        LEFT JOIN order ON detail_export.order_id = order.id
        LEFT JOIN order_detail ON order.id = order_detail.order_id
    `;

    try {
        const exportWarehouse = await executeSelectData ({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            filter: filter,
            configData: configDataExportWarehouse
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            exportWarehouse
        );
    } catch (error) {
        console.error('Lỗi:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.BAD_REQUEST
        );
    }
}

/**
 * Tạo bản ghi xuất kho và xử lý các đơn hàng liên quan
 * @param {Object} exportWarehouse - Dữ liệu xuất kho
 * @returns {Object} - Phản hồi thành công hoặc lỗi
 */
async function createExportWarehouse(exportWarehouse) {
    // Kiểm tra sự tồn tại của nhân viên
    const employee = await prisma.employee.findFirst({
        where: {
            id: exportWarehouse.employee_id,
            deleted_at: null
        }
    })
    if (!employee) {
        return get_error_response(ERROR_CODES.EMPLOYEE_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }
    
    // Kiểm tra tính hợp lệ của total_profit
    // const error = validateNumber(exportWarehouse.total_profit);
    // if (error) {
    //     return get_error_response(ERROR_CODES.EXPORT_WAREHOUSE_TOTAL_PROFIT_INVALID, STATUS_CODE.BAD_REQUEST);
    // }

    // Mảng để lưu kết quả kiểm tra của tất cả orders
    const orderResults = [];

    // Tạo bản ghi xuất kho trong transaction
    const exportWarehouseData = await prisma.$transaction(async (tx) => {
        const data = await prisma.export_warehouse.create({
            data: {
                employee_id: exportWarehouse.employee_id,
                export_date: exportWarehouse.export_date,
                file_authenticate: exportWarehouse.file_authenticate,
                total_profit: exportWarehouse.total_profit,
                note: exportWarehouse.note,
                created_at: new Date()
            }
        })

        if (!data) {
            throw new Error(ERROR_CODES.EXPORT_WAREHOUSE_CREATE_FAILED);
        }

        // Xử lý các đơn hàng
        for (const order of exportWarehouse.orders) {
            const orderResult = await addProductionForOrderWarehouse(
                tx,
                data.id,
                order,
                exportWarehouse.export_date
            );
        
        
            if (orderResult) {
                return orderResult;
            }
        }
    });

    if (exportWarehouseData) {
        return exportWarehouseData
    }
    // logger.info(`Created export warehouse with ID: ${exportWarehouseData.id}`);
    return get_error_response(ERROR_CODES.EXPORT_WAREHOUSE_CREATE_SUCCESS, STATUS_CODE.OK);
}

/**
 * Xử lý chi tiết đơn hàng và sản phẩm liên quan đến xuất kho
 * @param {Object} tx - Transaction Prisma
 * @param {number} exportWarehouse_id - ID của bản ghi xuất kho
 * @param {Object} order - Thông tin đơn hàng
 * @param {string} export_date - Ngày xuất kho
 * @returns {Object|undefined} - Phản hồi lỗi hoặc undefined nếu thành công
 */
async function addProductionForOrderWarehouse(tx, exportWarehouse_id, order, export_date) {
    // Kiểm tra sự tồn tại của đơn hàng

    const orderExists = await tx.order.findFirst({
        where: {
            id: order.id,
            deleted_at: null,
            status: { 
                in: [
                    ORDER.PENDING, ORDER.PREPARING
                ]
            }
        },
        include: {
            detail_export: {
                select: {
                    product_id: true,
                    quantity: true
                }
            }
        }
    })

    if (!orderExists) {
        return get_error_response(
            ERROR_CODES.ORDER_NOT_FOUND,
            STATUS_CODE.BAD_REQUEST
        );
    }

    // Kiểm tra tất cả sản phẩm trong một truy vấn
    const productIds = order.products.map((p) => p.id);
    const products = await tx.product.findMany({
        where: {
            id: { in: productIds },
            deleted_at: null,
        },
    });
    if (products.length !== productIds.length) {
        return get_error_response(
            ERROR_CODES.PRODUCT_NOT_FOUND,
            STATUS_CODE.BAD_REQUEST
        );
    }

    // Xử lý từng sản phẩm trong đơn hàng
    for (const product of order.products) {
        // Kiểm tra số lượng và giá bán
        const fields = [
            {
                value: product.quantity,
                error: ERROR_CODES.EXPORT_WAREHOUSE_PRODUCT_QUANTITY_INVALID
            },
            {
                value: product.sale_price,
                error: ERROR_CODES.EXPORT_WAREHOUSE_PRODUCT_QUANTITY_INVALID
            },
        ]

        for (const field of fields) {
            const error = validateNumber(field.value);
            if (error) {
                return get_error_response(field.error, STATUS_CODE.BAD_REQUEST);
            }
        }

        // Kiểm tra số lượng batch_product_details khớp với quantity
        if (product.batch_product_details.length !== product.quantity) {
            return get_error_response(
                ERROR_CODES.BATCH_PRODUCT_QUANTITY_MISMATCH,
                STATUS_CODE.BAD_REQUEST
            );
        }

        const exportDetailNumber = await getExportNumber(export_date)
        const exportNumber = exportDetailNumber + 1

        const batchCode = generateExportNumber(exportNumber)

        // Tạo chi tiết xuất kho
        const detail = await tx.detail_export.create({
            data: {
                batch_code: batchCode,
                export_id: exportWarehouse_id,
                order_id: order.id,
                product_id: product.id,
                quantity: product.quantity,
                created_at: new Date()
            }
        })

        if (!detail) {
            return get_error_response(
                ERROR_CODES.EXPORT_WAREHOUSE_CREATE_FAILED,
                STATUS_CODE.BAD_REQUEST
            );
        }

        const productToExport = {
            id: product.id,
            quantity: product.quantity
        }
        // Xử lý chi tiết lô sản phẩm
        let batchDetailResult = await processBatchDetailsForExport(
            tx,
            detail.batch_code,
            productToExport,
            product.batch_product_details
        )

        if (typeof batchDetailResult != "number") {
            return batchDetailResult;
        }

        if (product.quantity != batchDetailResult) {
            return get_error_response(
                ERROR_CODES.BATCH_PRODUCT_QUANTITY_MISMATCH,
                STATUS_CODE.BAD_REQUEST
            );
        }
    }

    // Cập nhật trạng thái đơn hàng
    await tx.order.update({
        where: { id: order.id },
        data: { status: ORDER.SHIPPING },
    });

    return undefined;
}

/**
 * Xử lý chi tiết lô sản phẩm cho xuất kho
 * @param {Object} tx - Transaction Prisma
 * @param {number} detail_export_batch_code - Mã lô của bản ghi chi tiết xuất kho
 * @param {Object} productToExport - Thông tin sản phẩm cần xuất
 * @param {Array} batch_product_details - Danh sách chi tiết lô sản phẩm
 * @returns {number|Object} - Số lượng sản phẩm hoặc phản hồi lỗi
 */
async function processBatchDetailsForExport(
    tx,
    detail_export_batch_code,
    productToExport,
    batch_product_details
) {
    // Kiểm tra số lượng lô khớp với số lượng sản phẩm
    if (batch_product_details.length !== productToExport.quantity) {
        return get_error_response(
            ERROR_CODES.BATCH_PRODUCT_QUANTITY_MISMATCH,
            STATUS_CODE.BAD_REQUEST
        );
    }

    // Kiểm tra tất cả chi tiết lô trong một truy vấn
    const serialNumbers = batch_product_details.map((b) => b.serial_number);
    const batchItems = await tx.batch_product_detail.findMany({
        where: {
            serial_number: { in: serialNumbers },
            deleted_at: null,
        },
    });

    if (batchItems.length !== serialNumbers.length) {
        return get_error_response(
            ERROR_CODES.BATCH_PRODUCT_DETAIL_NOT_FOUND,
            STATUS_CODE.NOT_FOUND
        );
    }

    // Kiểm tra các lô đã được xuất kho chưa
    const alreadyExported = batchItems.some((item) => item.exp_batch_id);
    if (alreadyExported) {
        return get_error_response(
            ERROR_CODES.BATCH_PRODUCT_DETAIL_IS_EXPORT,
            STATUS_CODE.BAD_REQUEST
        );
    }

    // Kiểm tra chi tiết nhập kho
    const importBatchIds = batchItems.map((item) => item.imp_batch_id);
    const importDetails = await tx.detail_import.findMany({
        where: {
            batch_code: { in: importBatchIds },
        },
    });

    if (importDetails.length !== importBatchIds.length) {
        return get_error_response(
            ERROR_CODES.IMPORT_DETAIL_BATCH_NOT_FOUND,
            STATUS_CODE.NOT_FOUND
        );
    }

    // Kiểm tra giá nhập kho -- [Tạm thời chưa cần]
    // for (const batchDetail of batch_product_details) {
    //     const item = batchItems.find(
    //         (i) => i.serial_number === batchDetail.serial_number
    //     );
    //     const importDetail = importDetails.find(
    //         (d) => d.batch_code === item.imp_batch_id
    //     );
    //     // if (importDetail.import_price !== batchDetail.import_price) {
    //     //     return get_error_response(
    //     //         ERROR_CODES.BATCH_PRODUCT_DETAIL_IMPORT_PRICE_NOT_MATCH,
    //     //         STATUS_CODE.BAD_REQUEST
    //     //     );
    //     // }
    // }

    // Cập nhật tất cả chi tiết lô
    for (const item of batchItems) {
        console.log('Cập nhật chi tiết lô')
        const batchResult = await tx.batch_product_detail.update({
            where: { id: item.id },
            data: { exp_batch_id: detail_export_batch_code },
        });

        console.log('batchResult', batchResult)
        if (!batchResult) {
            return get_error_response(
                ERROR_CODES.BATCH_PRODUCT_DETAIL_UPDATED_FAILED,
                STATUS_CODE.BAD_REQUEST
            );
        }

        console.log('Xử lý sau xuất kho')
        // Cập nhật tồn kho cho từng serial_number
        const inventoryResult = await processAfterExport(
            tx,
            productToExport,
            item,
        );
        if (inventoryResult) {
            return inventoryResult;
        }
    }

    return batch_product_details.length;
} 

/**
 * Cập nhật tồn kho sau khi xuất kho
 * @param {Object} tx - Transaction Prisma
 * @param {Object} productToExport - Thông tin sản phẩm cần xuất
 * @param {Object} batch_product_detail - Chi tiết lô sản phẩm
 * @returns {Object|undefined} - Phản hồi lỗi hoặc undefined nếu thành công
 */
const processAfterExport = async (tx, productToExport, batch_product_detail) => {
    console.log('productToExport', productToExport.id)
    // Kiểm tra tồn kho
    console.log('batch_product_detail', batch_product_detail.imp_batch_id)
    const warehouse_inventory = await tx.warehouse_inventory.findFirst({
        where: {
            batch_code: batch_product_detail.imp_batch_id,
            product_id: productToExport.id,
            deleted_at: null
        }
    })
    console.log('warehouse_inventory', warehouse_inventory)
    if (!warehouse_inventory || warehouse_inventory.stock < 1) {
        return get_error_response(
            ERROR_CODES.EXPORT_WAREHOUSE_INSUFFICIENT_INVENTORY,
            STATUS_CODE.BAD_REQUEST
        );
    }

    // Giảm tồn kho đi 1 đơn vị cho serial_number này
    const warehouseResult = await tx.warehouse_inventory.update({
        where: { id: warehouse_inventory.id },
        data: { stock: warehouse_inventory.stock - 1 },
    });

    if (!warehouseResult) {
        return get_error_response(
            ERROR_CODES.WAREHOUSE_INVENTORY_UPDATE_FAILED,
            STATUS_CODE.BAD_REQUEST
        );
    }

    return undefined;
}

module.exports = {
    createExportWarehouseService: createExportWarehouse,
    getExportWarehouseService,
    getExportWarehouseDetailService
}