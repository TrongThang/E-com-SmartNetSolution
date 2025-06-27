const { ERROR_CODES, STATUS_CODE, ERROR_MESSAGES } = require("../contants/errors");
const { ORDER, ROLE, EXPORT_WAREHOUSE } = require("../contants/info");
const { get_error_response } = require("../helpers/response.helper");
const { getExportNumber, generateDetailExportBatchCode } = require("../helpers/import.warehouse.helper");
const { generateExportNumber } = require("../helpers/generate.helper");
const { executeSelectData } = require("../helpers/sql_query");
const queryHelper = require("../helpers/query.helper");
const prisma = require('../config/database');

function configDataExportWarehouseDetail(rows) {
    const result = [];
    const map = new Map();

    rows.forEach(row => {
        const exportId = row.id;

        // Tìm hoặc tạo exportData
        let exportData = map.get(exportId);
        if (!exportData) {
            exportData = {
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
        }

        // Xử lý order
        if (row.order_id) {
            let order = exportData.orders.find(o => o.order_id === row.order_id);
            if (!order) {
                order = {
                    order_id: row.order_id,
                    products: []
                };
                exportData.orders.push(order);
            }

            // Xử lý product
            if (row.product_id) {
                let product = order.products.find(p => p.product_id === row.product_id);
                if (!product) {
                    product = {
                        product_id: row.product_id,
                        product_name: row.product_name,
                        product_image: row.product_image,
                        quantity: row.quantity,
                        note: row.detail_export_note,
                        serials: []
                    };
                    order.products.push(product);
                }

                // Xử lý serial
                if (row.serial_number) {
                    if (!product.serials.some(s => s.serial_number === row.serial_number)) {
                        product.serials.push({
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

    // if(account.role_id !== ROLE.MANAGER_WAREHOUSE) {
    //     return get_error_response(ERROR_CODES.EXPORT_WAREHOUSE_MANAGER_NOT_AUTHORIZED, STATUS_CODE.BAD_REQUEST);
    // }
    
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
    const exportNumber = await getExportNumber(export_date)
    const batch_code_export = generateExportNumber(exportNumber)
    const exportWarehouseData = await prisma.$transaction(async (tx) => {
        const data = await prisma.export_warehouse.create({
            data: {
                export_code: batch_code_export,
                export_number: exportNumber,
                employee_id: employee_id,
                export_date: export_date,
                note: note,
                created_at: new Date(),
                status: EXPORT_WAREHOUSE.PENDING
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

        const batchCode = await generateDetailExportBatchCode(export_date, product.id)
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
            export_code: export_id,
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
            account_id: account_id,
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
        where: { id: exportWarehouse.id },
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
 * @param {string} order_id - Mã đơn hàng
 * @param {Array} list_product - Danh sách sản phẩm với cấu trúc mới
 * @param {string} account_id - ID của tài khoản thực hiện
 * @returns {Object} Response object chứa kết quả và thông báo
 */
// List product với cấu trúc mới
/**
 * {
 *  "export_id": 5,
 *  "order_id": "DH-2025-0001",
 *  "list_product": [
 *    {
 *      "template_id": "1",
 *      "list_serial": [
 *        {
 *          "batch_production_id": "BTCH12JUN2501JXHMC1K08JPX24K0TDV",
 *          "serial_number": "SERL12JUN2501JXHMC1QCH11ECD111ACQ"
 *        }
 *      ],
 *      "quantity": 1
 *    }
 *  ]
 * }
 */
async function exportProductByOrderService(export_id, order_id, list_product, account_id) {
    try {
        // 1. Kiểm tra order_id có tồn tại không
        const order = await prisma.order.findFirst({
            where: {
                id: order_id,
                deleted_at: null
            }
        });
        if (!order) {
            return get_error_response(ERROR_CODES.ORDER_NOT_FOUND, STATUS_CODE.BAD_REQUEST, { order_id });
        }

        if (order.status !== ORDER.PREPARING) {
            return get_error_response(ERROR_CODES.ORDER_NOT_PREPARING, STATUS_CODE.BAD_REQUEST, { order_id });
        }

        // 2. Lấy danh sách sản phẩm & số lượng từ order_id (giả sử bảng detail_order)
        const orderDetails = await prisma.order_detail.findMany({
            where: {
                order_id: order_id,
                deleted_at: null
            },
            select: {
                product_id: true,
                quantity_sold: true
            }
        });

        if (!orderDetails || orderDetails.length === 0) {
            return get_error_response(ERROR_CODES.DETAIL_ORDER_NOT_FOUND, STATUS_CODE.BAD_REQUEST, { order_id });
        }

        // 3. Tổng hợp số lượng từng sản phẩm trong listProduct gửi lên
        const productCountMap = {};
        for (const product of list_product) {
            const { template_id, quantity } = product;
            if (!productCountMap[template_id]) {
                productCountMap[template_id] = 0;
            }
            productCountMap[template_id] += quantity || 1; // Nếu không có quantity thì mặc định là 1
        }

        // 4. So sánh với số lượng trong orderDetails
        for (const detail of orderDetails) {
            const requiredQty = detail.quantity_sold;
            const sentQty = productCountMap[detail.product_id] || 0;
            if (sentQty !== requiredQty) {
                return get_error_response(
                    ERROR_CODES.QUANTITY_NOT_MATCH,
                    STATUS_CODE.BAD_REQUEST,
                    {
                        product_id: detail.product_id,
                        required: requiredQty,
                        sent: sentQty
                    }
                );
            }
        }

        // 5. Lấy danh sách detail_export để lấy batch_code cho từng sản phẩm
        const detailExports = await prisma.detail_export.findMany({
            where: {
                export_id: export_id,
                deleted_at: null
            },
            select: {
                product_id: true,
                batch_code: true
            }
        });

        // 6. Tiến hành transaction xuất kho
        const result = await prisma.$transaction(async (tx) => {
            // 6.1. Kiểm tra phiếu xuất kho
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

            // 6.2. Kiểm tra quyền người dùng
            const account = await tx.account.findFirst({
                where: {
                    account_id: account_id,
                    deleted_at: null
                }
            });

            if (!account) {
                throw new Error(ERROR_CODES.ACCOUNT_NOT_FOUND);
            }

            if (account.role_id !== ROLE.EMPLOYEE_WAREHOUSE) {
                throw new Error(ERROR_CODES.EXPORT_WAREHOUSE_EMPLOYEE_NOT_AUTHORIZED);
            }

            if(account.employee_id !== exportWarehouse.employee_id) {
                throw new Error(ERROR_CODES.EXPORT_WAREHOUSE_EMPLOYEE_NOT_AUTHORIZED);
            }

            // 6.3. Xử lý từng sản phẩm trong listProduct
            const productResults = [];

            for (const product of list_product) {
                const { template_id, list_serial, quantity } = product;

                // Kiểm tra số lượng serial có khớp với quantity không
                if (!list_serial || list_serial.length !== quantity) {
                    throw new Error(`${ERROR_CODES.QUANTITY_NOT_MATCH}: Template ${template_id} - Expected ${quantity} serials, got ${list_serial ? list_serial.length : 0}`);
                }

                // 6.3.1. Lấy batch_code từ detail_export cho template này
                const detailExport = detailExports.find(
                    d => d.product_id === template_id
                );
                if (!detailExport) {
                    throw new Error(`${ERROR_CODES.EXPORT_WAREHOUSE_DETAIL_EXPORT_NOT_FOUND}: Template ${template_id}`);
                }

                // 6.3.2. Xử lý từng serial trong list_serial
                const serialResults = [];
                for (const serialItem of list_serial) {
                    const { batch_production_id, serial_number } = serialItem;

                    // 6.3.2.1. Kiểm tra trạng thái serial
                    const productionSerial = await queryHelper.queryRaw(`
                        SELECT 
                            production_tracking.device_serial,
                            production_batches.template_id,
                            production_tracking.status
                        FROM production_tracking 
                            LEFT JOIN production_batches ON production_tracking.production_batch_id = production_batches.production_batch_id
                        WHERE
                            device_serial = '${serial_number}' 
                            AND production_tracking.is_deleted IS false
                            AND production_batches.template_id = '${template_id}'
                    `);

                    if (!productionSerial || productionSerial.length === 0) {
                        throw new Error(`${ERROR_CODES.SERIAL_NUMBER_NOT_FOUND}: ${serial_number}`);
                    }

                    if (productionSerial[0].status !== 'in_stock') {
                        throw new Error(`${ERROR_CODES.SERIAL_NUMBER_NOT_IN_STOCK}: ${serial_number}`);
                    }

                    // 6.3.2.2. Kiểm tra batch_product_detail
                    const batchProductDetail = await tx.batch_product_detail.findFirst({
                        where: {
                            batch_production_id: batch_production_id,
                            serial_number: serial_number,
                            deleted_at: null
                        }
                    });

                    if (!batchProductDetail) {
                        throw new Error(`${ERROR_CODES.SERIAL_NUMBER_NOT_FOUND_IN_BATCH_PRODUCTION}: ${serial_number}`);
                    }

                    if (batchProductDetail.exp_batch_id) {
                        throw new Error(`${ERROR_CODES.SERIAL_NUMBER_IS_EXPORTED}: ${serial_number}`);
                    }

                    // 6.3.2.3. Cập nhật batch_product_detail (gán exp_batch_id là batch_code của detail_export)
                    const batchProductDetailUpdate = await tx.batch_product_detail.update({
                        where: {
                            id: batchProductDetail.id,
                            deleted_at: null,
                        },
                        data: {
                            exp_batch_id: detailExport.batch_code,
                            updated_at: new Date()
                        }
                    });

                    if (!batchProductDetailUpdate) {
                        throw new Error(`${ERROR_CODES.EXPORT_WAREHOUSE_UPDATE_FAILED}: ${serial_number}`);
                    }

                    // 6.3.2.4. Cập nhật tồn kho
                    const warehouseInventory = await tx.warehouse_inventory.findFirst({
                        where: {
                            batch_code: batchProductDetail.imp_batch_id,
                            product_id: template_id,
                            deleted_at: null
                        }
                    });

                    if (!warehouseInventory) {
                        throw new Error(`${ERROR_CODES.WAREHOUSE_INVENTORY_NOT_FOUND}: ${serial_number}`);
                    }

                    if (warehouseInventory.stock <= 0) {
                        throw new Error(`${ERROR_CODES.INSUFFICIENT_STOCK}: ${serial_number}`);
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
                        throw new Error(`${ERROR_CODES.WAREHOUSE_INVENTORY_UPDATE_FAILED}: ${serial_number}`);
                    }

                    // 6.3.2.5. Cập nhật trạng thái sản phẩm
                    const productionTrackingUpdate = await tx.production_tracking.updateMany({
                        where: {
                            production_batch_id: batch_production_id,
                            device_serial: serial_number,
                            is_deleted: false
                        },
                        data: {
                            status: 'stock_out'
                        }
                    });

                    // Push kết quả từng serial
                    serialResults.push({
                        serial_number,
                        batch_production_id,
                        success: true,
                        warehouseInventory: warehouseInventoryUpdate,
                        batchProductDetail: batchProductDetailUpdate,
                        productionTracking: productionTrackingUpdate
                    });
                }

                // Push kết quả từng sản phẩm
                productResults.push({
                    template_id,
                    quantity,
                    serials: serialResults,
                    success: true
                });
            }

            // 6.4. Cập nhật trạng thái đơn hàng
            await tx.order.update({
                where: { id: order_id },
                data: { status: ORDER.PENDING_SHIPPING }
            });

            await tx.export_warehouse.update({
                where: { id: export_id },
                data: { status: EXPORT_WAREHOUSE.COMPLETED, updated_at: new Date() }
            });

            return productResults;
        });

        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, result);

    } catch (error) {
        // Log lỗi
        console.error(`[Export Product] Error exporting product`, {
            error: error.message,
            export_id,
            list_product,
            account_id
        });

        // Xử lý lỗi có serial_number
        if (typeof error.message === 'string' && error.message.includes(':')) {
            const [errorCode, serial] = error.message.split(':').map(s => s.trim());
            return get_error_response(errorCode, STATUS_CODE.BAD_REQUEST, { serial_number: serial });
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
        },
        include: {
            detail_export: true
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
    exportProductByOrderService,
    getProcessExportWarehouseService,
    getExportWarehouseNotFinishForEmployee
}