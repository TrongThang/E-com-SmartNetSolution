const { ERROR_CODES, STATUS_CODE } = require("../contants/errors");
const { ORDER, ROLE } = require("../contants/info");
const { generateOrderID } = require("../helpers/generate.helper");
const { getOrderNumber } = require("../helpers/import.warehouse.helper");
const { validateNumber } = require("../helpers/number.helper");
const { check_list_info_product } = require("../helpers/product.helper");
const queryHelper = require("../helpers/query.helper");
const prisma = require('../config/database');
const { get_error_response } = require("../helpers/response.helper");
const { executeSelectData } = require("../helpers/sql_query");

function configOrderData(dbResults) {
    if (!dbResults || dbResults.length === 0) {
        return [];
    }

    // Tạo map để nhóm các sản phẩm theo order_id
    const orderMap = new Map();

    dbResults.forEach(record => {
        if (!orderMap.has(record.id)) {
            // Tạo order mới nếu chưa tồn tại
            orderMap.set(record.id, {
                id: record.id,
                customer_name: record.name_recipient,
                order_date: record.order_date,
                status: record.status,
                total_amount: record.amount,
                products: []
            });
        }

        // Thêm sản phẩm vào order tương ứng
        if (record.product_id) {
            const order = orderMap.get(record.id);
            order.products.push({
                id: record.product_id,
                name: record.product_name,
                quantity: record.quantity,
                sale_price: record.price
            });
        }
    });

    // Chuyển map thành array
    return Array.from(orderMap.values());
}

async function getOrderForWarehouseEmployee(filters, logic, limit, sort, order) {
    let get_attr = `
        order.id, 
        order.name_recipient,
        order.created_at as order_date,
        order.status,
        order.amount,
        order_detail.product_id,
        product.name as product_name,
        order_detail.quantity_sold as quantity,
        order_detail.sale_price as price
    `;

    let get_table = `\`order\``;
    let query_join = `
        LEFT JOIN order_detail ON order.id = order_detail.order_id
        LEFT JOIN product ON order_detail.product_id = product.id
    `;

    try {
        const orders = await executeSelectData({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            limit: limit,
            filter: filters,
            logic: logic,
            sort: sort,
            order: order,
            configData: configOrderData
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            orders
        );
    } catch (error) {
        console.error('Lỗi:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.BAD_REQUEST
        );
    }
}

function configOrderDataForAdministrator(dbResults) {
    if (!dbResults || dbResults.length === 0) {
        return [];
    }

    const orderMap = new Map();

    dbResults.forEach(record => {
        if (!orderMap.has(record.id)) {
            orderMap.set(record.id, {
                id: record.id,
                saler_name: record.saler_name,
                shipper_name: record.shipper_name,
                customer_name: record.customer_name,
                name_recipient: record.name_recipient,
                address: record.address,
                phone: record.phone,
                amount: record.amount,
                status: record.status,
                note: record.note,
                warehouse_inventory: record.warehouse_inventory,
                products: [],
                is_fulfillable: true, 
            });
        }

        const order = orderMap.get(record.id);

        if (record.product_id) {
            const product = {
                id: record.product_id,
                name: record.product_name,
                quantity: record.quantity_sold,
                total_stock: record.total_stock,
            };
            order.products.push(product);

            if (product.quantity > product.total_stock) {
                order.is_fulfillable = false;
            }
        }
    });

    return Array.from(orderMap.values());
}

async function getOrdersForAdministrator(filters, logic, limit, sort, order) {
    let get_attr = `
        order.id,
        CONCAT(employee.surname, ' ',employee.lastname) AS saler_name,
        CONCAT(shipper.surname, ' ',shipper.lastname) AS shipper_name,
        CONCAT(customer.surname, ' ',customer.lastname) AS customer_name,
        order.name_recipient,
        order.address,
        order.phone,
        order.amount,
        order.status,
        order.note,
        warehouse_inventory.total_stock,
        warehouse_inventory.total_delta,
        order_detail.product_id,
        warehouse_inventory.product_name,
        order_detail.quantity_sold
    `;

    let get_table = `\`order\``;
    let query_join = `
        LEFT JOIN customer ON order.customer_id = customer.id
        LEFT JOIN employee ON order.saler_id = employee.id
        LEFT JOIN employee shipper ON order.shipper_id = shipper.id
        LEFT JOIN order_detail ON order.id = order_detail.order_id
        LEFT JOIN (
            SELECT
                product_id,
                product.name AS product_name,
                SUM(stock) AS total_stock,
                SUM(delta) AS total_delta
            FROM warehouse_inventory
                LEFT JOIN product ON warehouse_inventory.product_id = product.id
            WHERE warehouse_inventory.deleted_at IS NULL
            GROUP BY product_id
        ) AS warehouse_inventory ON order_detail.product_id = warehouse_inventory.product_id
    `;

    try {
        const orders = await executeSelectData({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            limit: limit,
            filter: filters,
            logic: logic,
            sort: sort,
            order: order,
            configData: configOrderDataForAdministrator
        });

        const cardAnalysis = await queryHelper.queryRaw(`
            SELECT
                SUM(CASE WHEN status IN (${ORDER.PENDING}) THEN 1 ELSE 0 END) AS total_pending_orders,
                SUM(CASE WHEN status IN (${ORDER.PREPARING}) THEN 1 ELSE 0 END) AS total_preparing_orders,
                SUM(CASE WHEN status IN (${ORDER.PENDING_SHIPPING}, ${ORDER.SHIPPING}) THEN 1 ELSE 0 END) AS total_processing_orders,
                SUM(CASE WHEN status IN (${ORDER.DELIVERED}, ${ORDER.COMPLETED}) THEN 1 ELSE 0 END) AS total_completed_orders
            FROM \`order\`
            WHERE deleted_at IS NULL;    
        `)

        orders.cardAnalysis = cardAnalysis[0];

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            orders
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
 * Enhanced version của getOrdersForAdministrator với support filter theo shipper và employee
 * @param {Array} filters - Các bộ lọc
 * @param {string} logic - Logic kết hợp filter
 * @param {number} limit - Giới hạn số lượng
 * @param {string} sort - Trường sắp xếp  
 * @param {string} order - Thứ tự sắp xếp
 * @param {Object} additionalFilters - Bộ lọc bổ sung {shipper_id, employee_id, status}
 * @returns {Object} - Danh sách đơn hàng
 */
async function getOrdersForAdministratorEnhanced(filters, logic, limit, sort, order, additionalFilters = {}) {
    // Tạo danh sách filter động
    let dynamicFilters = [...(filters || [])];

    // Thêm filter cho shipper nếu có
    if (additionalFilters.shipper_id) {
        dynamicFilters.push({
            field: "order.shipper_id",
            condition: "=",
            value: additionalFilters.shipper_id
        });
    }

    // Thêm filter cho employee (saler) nếu có
    if (additionalFilters.employee_id) {
        dynamicFilters.push({
            field: "order.saler_id", 
            condition: "=",
            value: additionalFilters.employee_id
        });
    }

    // Thêm filter cho status nếu có
    if (additionalFilters.status) {
        if (Array.isArray(additionalFilters.status)) {
            // Nếu status là array, dùng IN
            dynamicFilters.push({
                field: "order.status",
                condition: "IN",
                value: additionalFilters.status
            });
        } else {
            // Nếu status là giá trị đơn
            dynamicFilters.push({
                field: "order.status",
                condition: "=", 
                value: additionalFilters.status
            });
        }
    }

    // Thêm filter cho date range nếu có
    if (additionalFilters.start_date) {
        dynamicFilters.push({
            field: "order.created_at",
            condition: ">=",
            value: additionalFilters.start_date
        });
    }

    if (additionalFilters.end_date) {
        dynamicFilters.push({
            field: "order.created_at", 
            condition: "<=",
            value: additionalFilters.end_date
        });
    }

    let get_attr = `
        order.id,
        CONCAT(employee.surname, ' ',employee.lastname) AS saler_name,
        CONCAT(shipper.surname, ' ',shipper.lastname) AS shipper_name,
        CONCAT(customer.surname, ' ',customer.lastname) AS customer_name,
        order.name_recipient,
        order.address,
        order.phone,
        order.amount,
        order.status,
        order.note,
        order.created_at as order_date,
        warehouse_inventory.total_stock,
        warehouse_inventory.total_delta,
        order_detail.product_id,
        warehouse_inventory.product_name,
        order_detail.quantity_sold
    `;

    let get_table = `\`order\``;
    let query_join = `
        LEFT JOIN customer ON order.customer_id = customer.id
        LEFT JOIN employee ON order.saler_id = employee.id
        LEFT JOIN employee shipper ON order.shipper_id = shipper.id
        LEFT JOIN order_detail ON order.id = order_detail.order_id
        LEFT JOIN (
            SELECT
                product_id,
                product.name AS product_name,
                SUM(stock) AS total_stock,
                SUM(delta) AS total_delta
            FROM warehouse_inventory
                LEFT JOIN product ON warehouse_inventory.product_id = product.id
            WHERE warehouse_inventory.deleted_at IS NULL
            GROUP BY product_id
        ) AS warehouse_inventory ON order_detail.product_id = warehouse_inventory.product_id
    `;

    try {
        const orders = await executeSelectData({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            limit: limit,
            filter: dynamicFilters,
            logic: logic,
            sort: sort,
            order: order,
            configData: configOrderDataForAdministrator
        });

        // Thống kê tổng quan với filter áp dụng
        let statsConditions = [];
        if (additionalFilters.shipper_id) {
            statsConditions.push(`shipper_id = '${additionalFilters.shipper_id}'`);
        }
        if (additionalFilters.employee_id) {
            statsConditions.push(`saler_id = '${additionalFilters.employee_id}'`);
        }
        if (additionalFilters.start_date) {
            statsConditions.push(`created_at >= '${additionalFilters.start_date}'`);
        }
        if (additionalFilters.end_date) {
            statsConditions.push(`created_at <= '${additionalFilters.end_date}'`);
        }

        const whereClause = statsConditions.length > 0 
            ? `WHERE deleted_at IS NULL AND ${statsConditions.join(' AND ')}`
            : 'WHERE deleted_at IS NULL';

        const cardAnalysis = await queryHelper.queryRaw(`
            SELECT
                SUM(CASE WHEN status IN (${ORDER.PENDING}) THEN 1 ELSE 0 END) AS total_pending_orders,
                SUM(CASE WHEN status IN (${ORDER.PREPARING}) THEN 1 ELSE 0 END) AS total_preparing_orders,
                SUM(CASE WHEN status IN (${ORDER.PENDING_SHIPPING}, ${ORDER.SHIPPING}) THEN 1 ELSE 0 END) AS total_processing_orders,
                SUM(CASE WHEN status IN (${ORDER.DELIVERED}, ${ORDER.COMPLETED}) THEN 1 ELSE 0 END) AS total_completed_orders,
                COUNT(*) AS total_orders,
                SUM(amount) AS total_revenue
            FROM \`order\`
            ${whereClause};    
        `);

        orders.cardAnalysis = cardAnalysis[0];
        orders.appliedFilters = additionalFilters;

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            orders
        );
    } catch (error) {
        console.error('Lỗi:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.BAD_REQUEST
        );
    }
}

function configOrderDetailData(dbResults) {
    if (!dbResults || dbResults.length === 0) {
        return [];
    }

    const orderMap = new Map();

    dbResults.forEach(record => {
        if (!orderMap.has(record.id)) {
            orderMap.set(record.id, {
                id: record.id,
                saler_name: record.saler_name,
                shipper_name: record.shipper_name,
                customer_name: record.customer_name,
                export_date: record.export_date,
                total_import_money: record.total_import_money,
                discount: record.discount,
                vat: record.vat,
                shipping_fee: record.shipping_fee,
                amount: record.amount,
                payment_method: record.payment_method,
                phone: record.phone,
                platform_order: record.platform_order,
                note: record.note,
                status: record.status,
                address: record.address,
                name_recipient: record.name_recipient,
                products: []
            });
        }

        if (record.product_id) {
            const order = orderMap.get(record.id);
            order.products.push({
                id: record.product_id,  
                name: record.product_name,
                image: record.product_image,
                quantity: record.quantity,
                price: record.sale_price,
                unit: record.unit,
                delivery_date: record.delivery_date,
                receiving_date: record.receiving_date,
                is_gift: record.is_gift,
                discount: record.discount,
                amount: record.amount,
                note: record.note,
                // status: record.status,
            });
        }
    });

    return Array.from(orderMap.values());
}

async function getOrderDetailService(order_id) {
    const get_attr = `
        order.id,
        CONCAT(saler.surname, ' ',saler.lastname) AS saler_name,
        CONCAT(shipper.surname, ' ',shipper.lastname) AS shipper_name,
        CONCAT(customer.surname, ' ',customer.lastname) AS customer_name,
        order.export_date,
        order.total_import_money,
        order.discount,
        order.vat,
        order.shipping_fee,
        order.amount,
        order.payment_method,
        order.phone,
        order.platform_order,
        order.note,
        order.status,
        order.address,
        order.name_recipient,
        order_detail.product_id,
        product.name as product_name,
        product.image as product_image,
        order_detail.unit,
        product.image,
        order_detail.quantity_sold,
        order_detail.sale_price,
        order_detail.delivery_date,
        order_detail.receiving_date,
        order_detail.discount,
        order_detail.amount
    `;

    const get_table = '`order`';
    const query_join = `
        LEFT JOIN order_detail ON order.id = order_detail.order_id
        LEFT JOIN product ON order_detail.product_id = product.id
        LEFT JOIN employee shipper ON order.shipper_id = shipper.id
        LEFT JOIN employee saler ON order.saler_id = saler.id
        LEFT JOIN customer ON order.customer_id = customer.id
    `;

    const filter = {
        field: "order.id",
        condition: "=",
        value: order_id
    };

    try {
        const result = await executeSelectData({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            filter: filter, 
            configData: configOrderDetailData
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            result
        );
    } catch (error) {
        console.error('Lỗi:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.BAD_REQUEST
        );
    }
}

async function getOrdersForCustomer(customer_id, filters, logic, limit, sort, order) {
    sort = 'order.created_at';
    order = 'DESC';
    const get_attr = `
        order.id,
        order.total_money,
        order.discount,
        order.vat,
        order.amount,
        order.payment_method,
        order.payment_account,
        order.phone,
        order.platform_order,
        order.note,
        order.status,
        order.address,
        order.name_recipient,
        order_detail.product_id,
        product.name as product_name,
        product.image,
        order_detail.quantity_sold as quantity,
        order_detail.sale_price as price
    `;

    const get_table = '`order`';
    const query_join = `
        LEFT JOIN order_detail ON order.id = order_detail.order_id
        LEFT JOIN product ON order_detail.product_id = product.id
    `;

    const filter = `[{"field":"customer_id","condition":"=","value":"${customer_id}"}]`;

    try {
        const result = await executeSelectData({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            limit: limit,
            filter: filter,
            logic: logic,
            sort: sort,
            order: order
        });

        // Group lại order theo id
        const groupedOrders = Object.values(
            result.data.reduce((acc, row) => {
                if (!acc[row.id]) {
                    acc[row.id] = {
                        id: row.id,
                        order_id: row.order_id,
                        total_money: row.total_money,
                        prepaid: row.prepaid,
                        remaining: row.remaining,
                        discount: row.discount,
                        vat: row.vat,
                        amount: row.amount,
                        payment_method: row.payment_method,
                        payment_account: row.payment_account,
                        phone: row.phone,
                        name_recipient: row.name_recipient,
                        platform_order: row.platform_order,
                        note: row.note,
                        status: row.status,
                        address: row.address,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                        deleted_at: row.deleted_at,
                        details: []
                    };
                }

                if (row.product_id) {
                    acc[row.id].details.push({
                        product_id: row.product_id,
                        product_name: row.product_name,
                        image: row.image,
                        quantity: row.quantity,
                        price: row.price
                    });

                    acc[row.id].count_product = (acc[row.id].count_product || 0) + 1;
                }

                return acc;
            }, {})
        );

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            {
                data: groupedOrders,
                total_page: result.total_page
            }
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
 * Lấy đơn hàng cho nhân viên shipper cụ thể
 * @param {string} shipper_id - ID của shipper
 * @param {Array} filters - Các bộ lọc khác
 * @param {string} logic - Logic kết hợp filter
 * @param {number} limit - Giới hạn số lượng
 * @param {string} sort - Trường sắp xếp
 * @param {string} order - Thứ tự sắp xếp
 * @returns {Object} - Danh sách đơn hàng của shipper
 */
async function getOrdersForShipper(username_shipper, filters = [], logic = 'AND', limit = 20, sort = 'order.created_at', order = 'DESC') {
    const account = await prisma.account.findFirst({
        where: {
            username: username_shipper,
            deleted_at: null
        }
    });
    const shipper_id = account.employee_id
    console.log(account)

    // Thêm filter cho shipper_id
    const shipperFilter = {
        field: "order.shipper_id",
        condition: "=", 
        value: shipper_id
    };

    // Kết hợp với các filter khác
    const allFilters = [shipperFilter, ...filters];

    let get_attr = `
        order.id,
        CONCAT(employee.surname, ' ',employee.lastname) AS saler_name,
        CONCAT(shipper.surname, ' ',shipper.lastname) AS shipper_name,
        CONCAT(customer.surname, ' ',customer.lastname) AS customer_name,
        order.name_recipient,
        order.address,
        order.phone,
        order.amount,
        order.status,
        order.note,
        order.created_at as order_date,
        warehouse_inventory.total_stock,
        warehouse_inventory.total_delta,
        order_detail.product_id,
        warehouse_inventory.product_name,
        order_detail.quantity_sold
    `;

    let get_table = `\`order\``;
    let query_join = `
        LEFT JOIN customer ON order.customer_id = customer.id
        LEFT JOIN employee ON order.saler_id = employee.id
        LEFT JOIN employee shipper ON order.shipper_id = shipper.id
        LEFT JOIN order_detail ON order.id = order_detail.order_id
        LEFT JOIN (
            SELECT
                product_id,
                product.name AS product_name,
                SUM(stock) AS total_stock,
                SUM(delta) AS total_delta
            FROM warehouse_inventory
                LEFT JOIN product ON warehouse_inventory.product_id = product.id
            WHERE warehouse_inventory.deleted_at IS NULL
            GROUP BY product_id
        ) AS warehouse_inventory ON order_detail.product_id = warehouse_inventory.product_id
    `;

    try {
        const orders = await executeSelectData({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            limit: limit,
            filter: allFilters,
            logic: logic,
            sort: sort,
            order: order,
            configData: configOrderDataForAdministrator
        });

        // Thống kê đơn hàng cho shipper
        const shipperStats = await queryHelper.queryRaw(`
            SELECT
                SUM(CASE WHEN status IN (${ORDER.PENDING_SHIPPING}) THEN 1 ELSE 0 END) AS pending_shipping,
                SUM(CASE WHEN status IN (${ORDER.SHIPPING}) THEN 1 ELSE 0 END) AS shipping,
                SUM(CASE WHEN status IN (${ORDER.DELIVERED}) THEN 1 ELSE 0 END) AS delivered,
                SUM(CASE WHEN status IN (${ORDER.COMPLETED}) THEN 1 ELSE 0 END) AS completed
            FROM \`order\`
            WHERE shipper_id = '${shipper_id}' AND deleted_at IS NULL;    
        `);

        orders.shipperStats = shipperStats[0];

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            orders
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
 * Lấy đơn hàng được phân cho nhân viên cụ thể (saler)
 * @param {string} employee_id - ID của nhân viên saler
 * @param {Array} filters - Các bộ lọc khác
 * @param {string} logic - Logic kết hợp filter
 * @param {number} limit - Giới hạn số lượng
 * @param {string} sort - Trường sắp xếp
 * @param {string} order - Thứ tự sắp xếp
 * @returns {Object} - Danh sách đơn hàng của nhân viên
 */
async function getOrdersForEmployee(employee_id, filters = [], logic = 'AND', limit = 20, sort = 'order.created_at', order = 'DESC') {
    // Thêm filter cho saler_id
    const employeeFilter = {
        field: "order.saler_id", 
        condition: "=",
        value: employee_id
    };

    // Kết hợp với các filter khác
    const allFilters = [employeeFilter, ...filters];

    let get_attr = `
        order.id,
        CONCAT(employee.surname, ' ',employee.lastname) AS saler_name,
        CONCAT(shipper.surname, ' ',shipper.lastname) AS shipper_name,
        CONCAT(customer.surname, ' ',customer.lastname) AS customer_name,
        order.name_recipient,
        order.address,
        order.phone,
        order.amount,
        order.status,
        order.note,
        order.created_at as order_date,
        warehouse_inventory.total_stock,
        warehouse_inventory.total_delta,
        order_detail.product_id,
        warehouse_inventory.product_name,
        order_detail.quantity_sold
    `;

    let get_table = `\`order\``;
    let query_join = `
        LEFT JOIN customer ON order.customer_id = customer.id
        LEFT JOIN employee ON order.saler_id = employee.id
        LEFT JOIN employee shipper ON order.shipper_id = shipper.id
        LEFT JOIN order_detail ON order.id = order_detail.order_id
        LEFT JOIN (
            SELECT
                product_id,
                product.name AS product_name,
                SUM(stock) AS total_stock,
                SUM(delta) AS total_delta
            FROM warehouse_inventory
                LEFT JOIN product ON warehouse_inventory.product_id = product.id
            WHERE warehouse_inventory.deleted_at IS NULL
            GROUP BY product_id
        ) AS warehouse_inventory ON order_detail.product_id = warehouse_inventory.product_id
    `;

    try {
        const orders = await executeSelectData({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            limit: limit,
            filter: allFilters,
            logic: logic,
            sort: sort,
            order: order,
            configData: configOrderDataForAdministrator
        });

        // Thống kê đơn hàng cho nhân viên
        const employeeStats = await queryHelper.queryRaw(`
            SELECT
                SUM(CASE WHEN status IN (${ORDER.PENDING}) THEN 1 ELSE 0 END) AS pending_orders,
                SUM(CASE WHEN status IN (${ORDER.PREPARING}) THEN 1 ELSE 0 END) AS preparing_orders,
                SUM(CASE WHEN status IN (${ORDER.PENDING_SHIPPING}, ${ORDER.SHIPPING}) THEN 1 ELSE 0 END) AS processing_orders,
                SUM(CASE WHEN status IN (${ORDER.DELIVERED}, ${ORDER.COMPLETED}) THEN 1 ELSE 0 END) AS completed_orders,
                SUM(amount) AS total_sales_amount
            FROM \`order\`
            WHERE saler_id = '${employee_id}' AND deleted_at IS NULL;    
        `);

        orders.employeeStats = employeeStats[0];

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            orders
        );
    } catch (error) {
        console.error('Lỗi:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.BAD_REQUEST
        );
    }
}

async function createOrder(orderData, platform_order) {
    const { shipping, payment, order, products } = orderData;

    // 1. Kiểm tra thông tin sản phẩm
    const checkProduct = await check_list_info_product(products);
    if (checkProduct.status_code !== STATUS_CODE.OK) return checkProduct;

    // 2. Kiểm tra thông tin saler (nếu có)
    if (order.saler_id) {
        const checkSaler = await prisma.account.findFirst({
            where: {
                employee_id: order.saler_id,
                role_id: "SALER",
                is_active: true,
                deleted_at: null
            }
        });
        if (!checkSaler) {
            return get_error_response(ERROR_CODES.EMPLOYEE_SALER_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
        }
    }
    
    // 3. Kiểm tra thông tin shipper (nếu có)
    if (order.shipper_id) {
        const checkShipper = await prisma.account.findFirst({
            where: {
                employee_id: order.shipper_id,
                role_id: "SHIPPER",
                is_active: true,
                deleted_at: null
            }
        });
        if (!checkShipper) {
            return get_error_response(ERROR_CODES.EMPLOYEE_SHIPPER_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
        }
    }

    // 4. Kiểm tra thông tin khách hàng
    const customer = await prisma.account.findFirst({
        where: {
            customer_id: order.customer_id.toString(),
            deleted_at: null
        }
    });
    if (!customer) {
        return get_error_response(ERROR_CODES.CUSTOMER_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    // 5. Kiểm tra số tiền trong đơn hàng
    const check_number_in_order = validateOrderNumbers(order);
    if (check_number_in_order) return check_number_in_order;

    // 6. Tính toán lại tổng tiền và số lượng
    const shippingFee = shipping.shippingMethod === 'standard' ? 30000 : 50000;
    const orderTotals = calculateOrderTotals(products, order.discount, order.vat, shippingFee);

    // 7. Kiểm tra tính nhất quán của dữ liệu
    if (orderTotals.totalMoney !== order.total_money) {
        return get_error_response(ERROR_CODES.ORDER_TOTAL_MONEY_NOT_SAME, STATUS_CODE.BAD_REQUEST);
    }
    if (orderTotals.amount !== order.amount) {
        return get_error_response(ERROR_CODES.ORDER_AMOUNT_NOT_SAME, STATUS_CODE.BAD_REQUEST);
    }

    // 8. Tạo địa chỉ đơn hàng
    const fullAddress = shipping.address + ', ' + shipping?.ward + ', ' + shipping?.district + ', ' + shipping?.city;

    // 9. Sinh orderNumber và order_id
    const result_order_number = await getOrderNumber(new Date());
    const orderNumber = Number(result_order_number) + 1;
    const order_id = generateOrderID(orderNumber);
    // 10. Transaction: tạo đơn hàng và chi tiết đơn hàng
    try {
        const result = await prisma.$transaction(async (tx) => {
            // Tạo đơn hàng
            const newOrder = await tx.order.create({
                data: {
                    id: order_id,
                    order_number: orderNumber,
                    customer: {
                        connect: { id: order.customer_id }
                    },
                    export_date: order.export_date || new Date(),
                    total_import_money: orderTotals.totalImportMoney,
                    discount: order.discount || 0,
                    vat: order.vat || 0,
                    total_money: orderTotals.totalMoney,
                    shipping_fee: shippingFee,
                    amount: orderTotals.amount,
                    address: fullAddress,
                    payment_method: payment.payment_method,
                    payment_account: payment.payment_account || null,
                    phone: shipping.phone,
                    name_recipient: shipping.fullName,
                    platform_order: platform_order || 'WEB',
                    note: order.note || '',
                    status: order.status || 0,
                }
            });

            // Tạo chi tiết đơn hàng
            for (const product of products) {
                const totalMoney = product.selling_price * product.quantity_sold;
                const discountAmount = (totalMoney * (product.discount || 0)) / 100;
                const finalAmount = totalMoney - discountAmount;

                await tx.order_detail.create({
                    data: {
                        order: {
                            connect: { id: newOrder.id }
                        },
                        product: {
                            connect: { id: product.id }
                        },
                        unit: product.unit,
                        sale_price: product.price,
                        discount: product.discount || 0,
                        quantity_sold: product.quantity,
                        amount: product.price * product.quantity * (1 - product.discount / 100),
                    }
                });
            }

            // Trả về kết quả thành công
            return {
                error_code: ERROR_CODES.SUCCESS,
                status_code: STATUS_CODE.OK,
                data: {
                    order_id: newOrder.id,
                    total_money: newOrder.total_money,
                    status: newOrder.status,
                    created_at: newOrder.created_at
                }
            };
        });

        return result;
    } catch (error) {
        console.error('Error in transaction:', error);
        return get_error_response(ERROR_CODES.ORDER_CREATE_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
}

// Hàm validate các trường số
function validateOrderNumbers(order) {
    const fields = [
        { value: order.total_money, error: ERROR_CODES.ORDER_TOTAL_MONEY_INVALID },
        { value: order.amount, error: ERROR_CODES.ORDER_AMOUNT_INVALID },
        { value: order.discount, error: ERROR_CODES.ORDER_DISCOUNT_INVALID },
        { value: order.vat, error: ERROR_CODES.ORDER_VAT_INVALID }
    ];

    for (const field of fields) {
        if (field.value !== undefined && field.value !== null) {
            const error = validateNumber(field.value);
            if (error) {
                return get_error_response(field.error, STATUS_CODE.BAD_REQUEST);
            }
        }
    }
    
    return null;
}

// Hàm tính toán tổng tiền và số lượng
function calculateOrderTotals(products, discount = 0, vat = 0, shippingFee = 0) {
    let totalImportMoney = 0;
    let totalMoney = 0;
    let totalAmount = 0;

    for (const product of products) {
        const productTotal = product.price * product.quantity;
        totalMoney += productTotal;
        totalImportMoney += (product.import_price || 0) * product.quantity;
    }

    // Áp dụng giảm giá
    const discountAmount = (totalMoney * discount) / 100;
    totalAmount = totalMoney - discountAmount;

    // Áp dụng VAT
    if (vat > 0) {
        totalAmount = totalAmount * (1 + vat / 100);
    }

    return {
        totalImportMoney,
        totalMoney,
        amount: totalAmount + shippingFee
    };
}

// Hàm tạo chi tiết đơn hàng
async function createOrderDetail(orderId, product) {
    try {
        const totalMoney = product.selling_price * product.quantity_sold;
        const discountAmount = (totalMoney * (product.discount || 0)) / 100;
        const finalAmount = totalMoney - discountAmount;

        const orderDetail = await prisma.order_detail.create({
            data: {
                order_id: orderId,
                product_id: product.product_id,
                unit: product.unit,
                sale_price: product.selling_price,
                discount: product.discount || 0,
                quantity_sold: product.quantity_sold,
                amount: finalAmount,
                is_gift: product.is_gift || false
            }
        });

        return orderDetail;
    } catch (error) {
        console.error('Error creating order detail:', error);
        return null;
    }
}

async function cancelOrderService(order_id) {
    try {
        const orderId = order_id
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return get_error_response(
                errors=ERROR_CODES.ORDER_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        if (order.status !== ORDER.PENDING && order.status !== ORDER.PREPARING) {
            return get_error_response(
                errors=ERROR_CODES.ORDER_NOT_STATUS_CANCELLED,
                status_code=STATUS_CODE.BAD_REQUEST
            );
        }

        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: ORDER.CANCELLED
            }
        });

        return get_error_response(
            errors=ERROR_CODES.SUCCESS,
            status_code=STATUS_CODE.OK
        );
    } catch (error) {
        console.log('Cancel order error:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

async function respondListOrderService(orderIds) {
    try {
        const listOrder = await prisma.order.findMany({
            where: { id: { in: orderIds }, deleted_at: null, status: ORDER.PENDING },
            include: {
                order_detail: true
            }
        });

        if (listOrder.length !== orderIds.length) {
            return get_error_response(
                errors=ERROR_CODES.ORDER_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        // Lấy danh sách số lượng sản phẩm trong kho và kiểm tra
        const listProduct = []; // Danh sách sản phẩm trong kho
        /**
         * [
         *      {
         *          product_id: 1,
         *          quantity: 10
         *      },
         *      {
         *          product_id: 2,
         *          quantity: 20
         *      }
         * ]
         */
        for (const order of listOrder) {
            for (const product of order.order_detail) {
                const productId = product.product_id;
                const quantity = product.quantity_sold;

                const productIndex = listProduct.findIndex(item => item.product_id === productId);
                if (productIndex !== -1) {
                    listProduct[productIndex].quantity += quantity;
                } else {
                    listProduct.push({ product_id: productId, quantity: quantity });
                }
            }
        }

        const resultCheckProductInWarehouse = await checkProductInWarehouse(listProduct)
        if (resultCheckProductInWarehouse) return resultCheckProductInWarehouse;

        await prisma.$transaction(async (tx) => {

            // Cập nhật trạng thái đơn hàng
            await tx.order.updateMany({
                where: { id: { in: orderIds } },
                data: { status: ORDER.PREPARING }
            });


            // if (result.count !== orderIds.length) {
            //     return get_error_response(
            //         errors=ERROR_CODES.ORDER_CONFIRM_ORDER_FAILED,
            //         status_code=STATUS_CODE.BAD_REQUEST
            //     );
            // }

            // Cập nhật số lượng sản phẩm trong kho


            for (const item of listProduct) {
                const quantityToDecrease = item.quantity;
            
                // Lấy các lô hàng còn tồn kho theo product_id (và deleted_at = null nếu cần)
                const lots = await tx.warehouse_inventory.findMany({
                    where: {
                        product_id: item.product_id,
                        stock: { gt: 0 }
                    },
                    orderBy: { created_at: 'asc' } // FIFO dùng created_at để lấy lô hàng lâu nhất
                });
                
                let remaining = quantityToDecrease; // Số lượng cần giảm
            
                for (const lot of lots) {
                    if (remaining <= 0) break;
            
                    const decrement = Math.min(lot.stock, remaining);
            
                    await prisma.warehouse_inventory.update({
                        where: { id: lot.id },
                        data: { stock: { decrement } }
                    });
            
                    remaining -= decrement;

                    // Nếu không đủ tồn kho → throw để rollback
                    if (decrement === 0 && remaining > 0) {
                        throw new Error(`Insufficient stock for product ${item.product_id}`);
                    }
                }
                if (remaining > 0) {
                    throw new Error(`Insufficient total stock for product ${item.product_id}`);
                }
            }
        });

        return get_error_response(
            errors=ERROR_CODES.ORDER_CONFIRM_ORDER_SUCCESS,
            status_code=STATUS_CODE.OK
        );
    } catch (error) {
        console.log('Respond list order error:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

// Hàm kiểm tra số lượng sản phẩm trong kho
async function checkProductInWarehouse(listProduct) {
    const productIds = listProduct.map(item => item.product_id);
    const inClause = productIds.map(id => `'${id}'`).join(',');

    const result = await queryHelper.queryRaw(`
        SELECT 
            wi.product_id, 
            p.name AS product_name, 
            p.delta AS delta,
            SUM(wi.stock) AS total_stock
        FROM warehouse_inventory wi
        JOIN product p ON wi.product_id = p.id
        WHERE wi.product_id IN (${inClause}) AND wi.deleted_at IS NULL
        GROUP BY wi.product_id, p.name
    `);

    const warehouseData = result.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        stock: item.total_stock,
        delta: item.delta
    }));
    
    const errorsData = [];


    const validProducts = warehouseData.filter(w => {
        const match = listProduct.find(p => p.product_id === w.product_id);
        if (w.stock < match.quantity + w.delta) {
            errorsData.push({
                type: 'product_stock_not_enough',
                message: `Sản phẩm ${w.product_name} không đủ số lượng. Còn lại ${w.stock + w.delta} sản phẩm`
            });
        }
        return match && w.stock >= match.quantity;
    });

    if (validProducts.length !== listProduct.length) {
        return get_error_response(
            errors=ERROR_CODES.WAREHOUSE_INVENTORY_PRODUCT_STOCK_NOT_ENOUGH,
            status_code = STATUS_CODE.BAD_REQUEST,
            data = errorsData
        );
    }

    return undefined;
}

async function StartShippingOrderService(order_id, account_id) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: order_id }
        });

        if (!order) {
            return get_error_response(
                errors=ERROR_CODES.ORDER_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        if (order.status !== ORDER.PREPARING) {
            return get_error_response(
                errors=ERROR_CODES.ORDER_REQUIRE_STATUS_SHIPPING,
                status_code=STATUS_CODE.BAD_REQUEST
            );
        }

        const employee = await prisma.account.findUnique({
            where: { id: account_id, deleted_at: null }
        });

        if (!employee) {
            return get_error_response(
                errors=ERROR_CODES.EMPLOYEE_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        if (employee.role_id !== ROLE.SHIPPER && employee.role_id !== ROLE.EMPLOYEE_WAREHOUSE && employee.role_id !== ROLE.MANAGER_WAREHOUSE && employee.role_id !== ROLE.SALER) {
            return get_error_response(
                errors=ERROR_CODES.EMPLOYEE_NOT_AUTHORIZED_SHIPPER,
                status_code=STATUS_CODE.BAD_REQUEST
            );
        }

        await prisma.order.update({
            where: { id: order_id },
            data: {
                status: ORDER.SHIPPING,
                shipper_id: employee.id
            }
        });

        // Firebase notification

        return get_error_response(
            errors=ERROR_CODES.SUCCESS,
            status_code=STATUS_CODE.OK
        );
    }
    catch (error) {
        console.log('Start shipping order error:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

/**
 * Xác nhận đã giao hàng (chỉ có shipper và manager warehouse mới có quyền xác nhận)
 * @param {string} order_id - ID của đơn hàng
 * @param {string} image_proof - Ảnh chứng minh đã giao hàng
 * @param {string} account_id - ID tài khoản của nhân viên
 * @returns {Promise<Response>} - Kết quả xác nhận đã giao hàng
 */
async function confirmShippingOrderService(order_id, image_proof, account_id) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: order_id }
        });

        if (!order) {
            return get_error_response(
                errors = ERROR_CODES.ORDER_NOT_FOUND,
                status_code = STATUS_CODE.NOT_FOUND
            );
        }

        if (order.status !== ORDER.SHIPPING) {
            return get_error_response(
                errors = ERROR_CODES.ORDER_REQUIRE_STATUS_SHIPPING,
                status_code = STATUS_CODE.BAD_REQUEST
            );
        }

        const employee = await prisma.account.findUnique({
            where: { id: account_id, deleted_at: null }
        });

        if (!employee) {
            return get_error_response(
                errors = ERROR_CODES.EMPLOYEE_NOT_FOUND,
                status_code = STATUS_CODE.NOT_FOUND
            );
        }

        if (employee.role_id !== ROLE.SHIPPER && employee.role_id !== ROLE.EMPLOYEE_WAREHOUSE && employee.role_id !== ROLE.MANAGER_WAREHOUSE && employee.role_id !== ROLE.SALER) {
            return get_error_response(
                errors=ERROR_CODES.EMPLOYEE_NOT_AUTHORIZED,
                status_code=STATUS_CODE.BAD_REQUEST
            );
        }

        await prisma.order.update({
            where: { id: order_id },
            data: {
                status: ORDER.DELIVERED,
                image_shipped: image_proof
            }
        });

        // Firebase notification

        return get_error_response(
            errors = ERROR_CODES.SUCCESS,
            status_code = STATUS_CODE.OK
        );
    } catch (error) {
        console.log('Confirm shipping order error:', error);
        return get_error_response(
            errors = ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code = STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

async function assignShipperToOrders(order_ids, employeeId) {
    try {
        const employee = await prisma.employee.findFirst({
            where: {
                id: employeeId,
                deleted_at: null,
            },
            select: {
                account: {
                    select: {
                        role_id: true
                    }
                },
                id: true
            }
        });

        if (!employee) {
            return get_error_response(
                ERROR_CODES.EMPLOYEE_NOT_FOUND,
                STATUS_CODE.NOT_FOUND
            );
        }

        if (employee.account[0].role_id !== ROLE.SHIPPER) {
            return get_error_response(
                ERROR_CODES.EMPLOYEE_NOT_AUTHORIZED_SHIPPER,
                STATUS_CODE.BAD_REQUEST
            );
        }

        const orders = await prisma.order.findMany({
            where: {
                id: { in: order_ids }, deleted_at: null,
                status: {
                    in: [ORDER.PREPARING, ORDER.PENDING, ORDER.PENDING_SHIPPING]
                }
            }
        });
        if (orders.length !== order_ids.length) {
            return get_error_response(
                errors = ERROR_CODES.ORDER_LIST_ASSIGN_SHIPPER_INVALID,
                status_code = STATUS_CODE.BAD_REQUEST
            );
        }

        await prisma.order.updateMany({
            where: { id: { in: order_ids } },
            data: { shipper_id: employeeId }
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK    
        );
    } catch (error) {
        console.log('Assign shipper to orders error:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

async function confirmFinishedOrderService(order_id, customer_id) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: order_id, customer_id: customer_id, deleted_at: null }
        });

        if (!order) {
            return get_error_response(
                ERROR_CODES.ORDER_NOT_FOUND,
                STATUS_CODE.NOT_FOUND
            );
        }

        if (order.status !== ORDER.DELIVERED) {
            return get_error_response(
                ERROR_CODES.ORDER_REQUIRE_STATUS_DELIVERED,
                STATUS_CODE.BAD_REQUEST
            );
        }

        await prisma.order.update({
            where: { id: order_id },
            data: {
                status: ORDER.COMPLETED
            }
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK
        );
    } catch (error) {
        console.log('Confirm finished order error:', error);
        if (error.code === 'P2025') {
            return get_error_response(
                ERROR_CODES.ORDER_NOT_FOUND,
                STATUS_CODE.NOT_FOUND
            );
        }
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    createOrder,
    getOrdersForAdministrator,
    getOrdersForAdministratorEnhanced,
    getOrdersForShipper,
    getOrdersForEmployee,
    getOrdersForCustomer,
    cancelOrderService,
    getOrderDetailService,
    respondListOrderService,
    getOrderForWarehouseEmployee,
    StartShippingOrderService,
    confirmShippingOrderService,
    assignShipperToOrders,
    confirmFinishedOrderService
}