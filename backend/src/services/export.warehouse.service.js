const { ERROR_CODES, STATUS_CODE, ERROR_MESSAGES } = require("../contants/errors");
const { ORDER, ROLE, IMPORT_WAREHOUSE, EXPORT_WAREHOUSE } = require("../contants/info");
const { validateNumber } = require("../helpers/number.helper");
const { check_list_info_product } = require("../helpers/product.helper");
const { prisma, isExistId } = require("../helpers/query.helper");
const { get_error_response } = require("../helpers/response.helper");
const { getExportNumber } = require("../helpers/import.warehouse.helper");
const { generateExportNumber } = require("../helpers/generate.helper");
const { executeSelectData } = require("../helpers/sql_query");
const queryHelper = require("../helpers/query.helper");

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

function configDataExportWarehouseDetail(rows) {
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
                orders: []
            };
            map.set(exportId, exportData);
            result.push(exportData);

            if (row.order_id) {
                map.get(exportId).orders.push({
                    order_id: row.order_id,
                    products: []
                });

                if (row.product_id) {
                    map.get(exportId).orders[0].products.push({
                        product_id: row.product_id,
                        product_name: row.product_name,
                        product_image: row.product_image,
                        quantity: row.quantity,
                        note: row.detail_export_note,
                        serials: []
                    });

                    if (row.serial_number) {
                        map.get(exportId).orders[0].products[0].serials.push({
                            serial_number: row.serial_number
                        });
                    }
                }
            }
        }
    });

    return result;
}

async function getExportWarehouseService(filter, limit, sort, order) {
    console.log('filter', filter)
    console.log('limit', limit)
    console.log('sort', sort)
    console.log('order', order)
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
    const filter = {
        field: "export_warehouse.id",
        condition: "=",
        value: id
    }

    let get_attr = `
        CONCAT(employee.surname, ' ',employee.lastname) AS employee_name,
        export_warehouse.export_date,
        export_warehouse.file_authenticate,
        export_warehouse.total_profit,
        export_warehouse.note,

        order.id as order_id,
        detail_export.batch_code as detail_export_id,
        detail_export.product_id,
        product.image as product_image,
        product.name as product_name,
        detail_export.quantity,
        detail_export.note as detail_export_note,
        batch_product_detail.serial_number
    `;

    let get_table = `export_warehouse`;
    let query_join = `
        LEFT JOIN employee ON export_warehouse.employee_id = employee.id
        LEFT JOIN detail_export ON export_warehouse.id = detail_export.export_id
        LEFT JOIN product ON detail_export.product_id = product.id
        LEFT JOIN \`order\` ON detail_export.order_id = order.id
        LEFT JOIN batch_product_detail ON detail_export.batch_code = batch_product_detail.exp_batch_id
    `;

    try {
        const exportWarehouse = await executeSelectData ({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            filter: filter,
            configData: configDataExportWarehouseDetail
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

async function getProcessExportWarehouseService(exportWarehouseId) {
    const queryProductNeed = `
        SELECT 
            de.product_id, product.name as product_name, de.quantity as total_serial_need
        FROM detail_export de
            LEFT JOIN product ON product.id = de.product_id
        WHERE de.export_id = '${exportWarehouseId}' AND de.deleted_at IS NULL
    `

    const queryProductExported = `
        SELECT de.product_id, CAST(COUNT(serial_number) AS CHAR) AS total_serial_exported
            FROM detail_export de
            LEFT JOIN batch_product_detail ON batch_product_detail.exp_batch_id = de.batch_code
        WHERE de.export_id = '${exportWarehouseId}' AND de.deleted_at IS NULL
        GROUP BY de.product_id
    `

    console.log("queryProductNeed", queryProductNeed)
    console.log("queryProductExported", queryProductExported)

    const resultProductNeed = await queryHelper.queryRaw(queryProductNeed)
    const resultProductExported = await queryHelper.queryRaw(queryProductExported)

    const result = []
    for (const item of resultProductNeed) {
        const product = resultProductExported.find(product => product.product_id === item.product_id)
        result.push({
            product_id: item.product_id,
            product_name: item.product_name,
            total_serial_need: item.total_serial_need,
            total_serial_exported: product ? product.total_serial_exported : 0
        })
    }

    return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, result);
}

/**
 * Tạo bản ghi xuất kho và xử lý các đơn hàng liên quan
 * @param {Object} exportWarehouse - Dữ liệu xuất kho
 * @param {string} account_id - ID tài khoản của nhân viên
 * @returns {Object} - Phản hồi thành công hoặc lỗi
 */
async function createExportWarehouse(exportWarehouse, account_id) {
    const { employee_id, export_date, note, orders } = exportWarehouse;

    // Kiểm tra sự tồn tại của nhân viên
    const account = await prisma.account.findFirst({
        where: {
            account_id: account_id,
            deleted_at: null
        }
    })
    if (!account) {
        return get_error_response(ERROR_CODES.ACCOUNT_UNAUTHORIZED, STATUS_CODE.BAD_REQUEST);
    }

    if(account.role_id !== ROLE.MANAGER_WAREHOUSE) {
        return get_error_response(ERROR_CODES.EXPORT_WAREHOUSE_MANAGER_NOT_AUTHORIZED, STATUS_CODE.BAD_REQUEST);
    }
    
    const employee = await prisma.account.findFirst({
        where: {
            employee_id: employee_id,
            deleted_at: null
        }
    })

    if (!employee) {
        return get_error_response(ERROR_CODES.EMPLOYEE_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    if (employee.role_id !== ROLE.EMPLOYEE_WAREHOUSE) {
        return get_error_response(ERROR_CODES.EXPORT_WAREHOUSE_EMPLOYEE, STATUS_CODE.BAD_REQUEST);
    }

    // Mảng để lưu kết quả kiểm tra của tất cả orders
    const orderResults = [];

    // Tạo bản ghi xuất kho trong transaction
    const exportWarehouseData = await prisma.$transaction(async (tx) => {
        const data = await prisma.export_warehouse.create({
            data: {
                employee_id: employee_id,
                export_date: export_date,
                note: note,
                created_at: new Date()
            }
        })

        if (!data) {
            throw new Error(ERROR_CODES.EXPORT_WAREHOUSE_CREATE_FAILED);
        }

        // Xử lý các đơn hàng
        for (const order of orders) {
            const orderResult = await addProductionForOrderWarehouse(
                tx,
                data.id,
                order,
                export_date
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

        const exportDetailNumber = await getExportNumber(export_date)
        const exportNumber = exportDetailNumber + 1

        const batchCode = generateExportNumber(exportNumber)
        // Tạo chi tiết xuất kho
        // console.log('product', product)
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

        // Cập nhật trạng thái đơn hàng
        const updateOrder = await tx.order.update({
            where: { id: order.id },
            data: {
                status: ORDER.PENDING_SHIPPING,
                updated_at: new Date()
            }
        })

        if (!updateOrder) {

            return get_error_response(
                ERROR_CODES.ORDER_UPDATE_FAILED,
                STATUS_CODE.BAD_REQUEST
            );
        }
    }

    return undefined;
}

// TODO: CHỈNH LẠI
async function startExportWarehouseService(export_id, account_id) {

    const exportWarehouse = await prisma.export_warehouse.findFirst({
        where: {
            id: export_id,
            deleted_at: null
        }
    })

    if (!exportWarehouse) { 
        return get_error_response(ERROR_CODES.EXPORT_WAREHOUSE_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    if (exportWarehouse.status !== EXPORT_WAREHOUSE.PENDING) {
        return get_error_response(ERROR_CODES.EXPORT_WAREHOUSE_NOT_PENDING, STATUS_CODE.BAD_REQUEST);
    }

    const employee = await prisma.account.findFirst({
        where: {
            id: account_id,
            deleted_at: null
        }
    })
    
    if (!employee) {
        return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    if (employee.role_id !== ROLE.EMPLOYEE_WAREHOUSE) {
        return get_error_response(ERROR_CODES.ACCOUNT_NOT_HAVE_PERMISSION, STATUS_CODE.BAD_REQUEST);
    }

    const exportWarehouseUpdate = await prisma.export_warehouse.update({
        where: { id: export_id },
        data: { status: EXPORT_WAREHOUSE.PROCESSING }
    })

    if (!exportWarehouseUpdate) {
        return get_error_response(ERROR_CODES.EXPORT_WAREHOUSE_UPDATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }

    return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, exportWarehouseUpdate);
}

/**
 * Hàm xuất kho cho một sản phẩm theo serial number
 * @param {string} export_id - Mã phiếu xuất kho
 * @param {string} batch_production_id - Mã lô sản xuất
 * @param {string} template_id - Mã sản phẩm
 * @param {string} serial_number - Số serial của sản phẩm
 * @param {string} account_id - ID của tài khoản thực hiện
 * @returns {Object} Response object chứa kết quả và thông báo
 */
// List product
/**
 * {
 *  "batch_production_id": "BATC_PRODUCTION_ID",  ==> Mã lô sản xuất
 *  "template_id": 10,  ==> Mã khuôn mẫu
 *  "serial_number": 5,
 * }
 */
// TODO: CHỈNH LẠI
async function exportProductService(export_id, listProduct, account_id) {
    try {
        // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
        const result = await prisma.$transaction(async (tx) => {
            // 1. KIỂM TRA PHIẾU XUẤT KHO
            const exportWarehouse = await tx.export_warehouse.findFirst({
                where: {
                    id: export_id,
                    deleted_at: null
                }
            });

            if (!exportWarehouse) {
                throw new Error(ERROR_CODES.EXPORT_WAREHOUSE_NOT_FOUND);
            }

            if (exportWarehouse.status !== EXPORT_WAREHOUSE.PROCESSING) {
                throw new Error(ERROR_CODES.EXPORT_WAREHOUSE_NOT_PENDING);
            }

            // 2. KIỂM TRA QUYỀN NGƯỜI DÙNG
            const account = await tx.account.findFirst({
                where: {
                    id: account_id,
                    deleted_at: null
                }
            });

            if (!account) {
                throw new Error(ERROR_CODES.ACCOUNT_NOT_FOUND);
            }

            if (account.role_id !== ROLE.EMPLOYEE_WAREHOUSE) {
                throw new Error(ERROR_CODES.ACCOUNT_NOT_HAVE_PERMISSION);
            }

            // 3. KIỂM TRA TRẠNG THÁI SẢN PHẨM
            const productionSerial = await queryHelper.queryRaw(`
                SELECT 
                    production_tracking.serial_number,
                    production_batches.template_id,
                    production_tracking.status
                FROM production_tracking 
                    LEFT JOIN production_batches ON production_tracking.batch_id = production_batches.production_batch_id
                WHERE
                    serial_number = '${serial_number}' 
                    AND production_tracking.is_deleted IS false
                    AND production_batches.template_id = '${template_id}'
            `);

            if (!productionSerial || productionSerial.length === 0) {
                throw new Error(ERROR_CODES.SERIAL_NUMBER_NOT_FOUND);
            }

            if (productionSerial[0].status !== 'in_stock') {
                throw new Error(ERROR_CODES.SERIAL_NUMBER_NOT_IN_STOCK);
            }

            // 4. KIỂM TRA VÀ LẤY RA CÁC CHI TIẾT XUẤT KHO CHƯA XUẤT ĐỦ
            const detailExportNotEnough = await queryHelper.queryRaw(`
                SELECT 
                    batch_product_detail.exp_batch_id,
                    COUNT(batch_product_detail.id) AS total_exported,
                    list_detail_export.total_need_export
                FROM batch_product_detail
                LEFT JOIN (
                    SELECT 
                        batch_code, 
                        export_id, 
                        SUM(quantity) AS total_need_export
                    FROM detail_export
                    WHERE export_id = '${export_id}' 
                        AND product_id = '${template_id}' 
                        AND deleted_at IS NULL
                    GROUP BY batch_code, export_id
                ) list_detail_export 
                    ON list_detail_export.batch_code = batch_product_detail.exp_batch_id
                WHERE list_detail_export.export_id = '${export_id}'
                GROUP BY batch_product_detail.exp_batch_id, list_detail_export.total_need_export
                HAVING COUNT(batch_product_detail.id) < list_detail_export.total_need_export;
            `)
            

            if (!detailExportNotEnough) {
                throw new Error(ERROR_CODES.EXPORT_WAREHOUSE_DETAIL_EXPORT_NOT_FOUND);
            }

            // 5. KIỂM TRA BATCH PRODUCT DETAIL
            const batchProductDetail = await tx.batch_product_detail.findFirst({
                where: {
                    batch_production_id: batch_production_id,
                    serial_number: serial_number,
                    deleted_at: null
                }
            });

            if (!batchProductDetail) {
                throw new Error(ERROR_CODES.SERIAL_NUMBER_NOT_FOUND);
            }

            if (batchProductDetail.exp_batch_id) {
                throw new Error(ERROR_CODES.SERIAL_NUMBER_IS_EXPORTED);
            }

            // if (batchProductDetail.exp_batch_id === detailExportNotEnough[0].batch_code) {
            //     throw new Error(ERROR_CODES.SERIAL_NUMBER_IS_EXPORTED);
            // }

            // 6. CẬP NHẬT THÔNG TIN XUẤT KHO
            // 6.1. Cập nhật batch_product_detail
            const batchProductDetailUpdate = await tx.batch_product_detail.update({
                where: {
                    id: batchProductDetail.id,
                    deleted_at: null,
                },
                data: {
                    exp_batch_id: detailExportNotEnough[0].batch_code,
                    updated_at: new Date()
                }
            });

            if (!batchProductDetailUpdate) {
                throw new Error(ERROR_CODES.EXPORT_WAREHOUSE_UPDATE_FAILED);
            }

            // 6.2. Cập nhật tồn kho
            const warehouseInventory = await tx.warehouse_inventory.findFirst({
                where: {
                    batch_code: batchProductDetail.imp_batch_id,
                    product_id: template_id,
                    deleted_at: null
                }
            });

            if (!warehouseInventory) {
                throw new Error(ERROR_CODES.WAREHOUSE_INVENTORY_NOT_FOUND);
            }

            if (warehouseInventory.stock <= 0) {
                throw new Error(ERROR_CODES.INSUFFICIENT_STOCK);
            }

            const warehouseInventoryUpdate = await tx.warehouse_inventory.update({
                where: {
                    id: warehouseInventory.id
                },
                data: {
                    stock: warehouseInventory.stock - 1,
                    updated_at: new Date()
                }
            });

            if (!warehouseInventoryUpdate) {
                throw new Error(ERROR_CODES.WAREHOUSE_INVENTORY_UPDATE_FAILED);
            }

            // 6.3. Cập nhật trạng thái sản phẩm
            const productionTrackingUpdate = await tx.production_tracking.update({
                where: {
                    batch_id: batch_production_id,
                    serial_number: serial_number,
                    deleted_at: null
                },
                data: {
                    status: 'stock_out'
                }
            });

            // Log thành công
            console.log(`[Export Product] Successfully exported product: ${serial_number}`);
            
            return {
                warehouseInventory: warehouseInventoryUpdate,
                batchProductDetail: batchProductDetailUpdate,
                productionTracking: productionTrackingUpdate
            };
        });

        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, result);

    } catch (error) {
        // Log lỗi
        console.error(`[Export Product] Error exporting product: ${serial_number}`, {
            error: error.message,
            export_id,
            batch_production_id,
            template_id,
            serial_number,
            account_id
        });

        // Xử lý các loại lỗi khác nhau
        if (error.message in ERROR_CODES) {
            return get_error_response(error.message, STATUS_CODE.BAD_REQUEST);
        }

        // Lỗi không xác định
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR, 
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            { message: 'An unexpected error occurred during export process' }
        );
    }
}

async function getExportWarehouseNotFinishForEmployee(userId) {
    const account = await prisma.account.findFirst({
        where: {
            id: userId,
            deleted_at: null
        }
    })

    if (!account) {
        return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (account.role_id !== ROLE.EMPLOYEE_WAREHOUSE) {
        return get_error_response(ERROR_CODES.ACCOUNT_NOT_AUTHORIZED, STATUS_CODE.BAD_REQUEST);
    }

    const exportWarehouse = await prisma.export_warehouse.findMany({
        where: {
            employee_id: account.employee_id,
            status: EXPORT_WAREHOUSE.PROCESSING,
            deleted_at: null
        }
    })

    if (!exportWarehouse) {
        return get_error_response(ERROR_CODES.EXPORT_WAREHOUSE_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, exportWarehouse);
}

module.exports = {
    createExportWarehouseService: createExportWarehouse,
    getExportWarehouseService,
    getExportWarehouseDetailService,
    startExportWarehouseService,
    exportProductService,
    getProcessExportWarehouseService,
    getExportWarehouseNotFinishForEmployee
}