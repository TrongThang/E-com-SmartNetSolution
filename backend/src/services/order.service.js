const { ERROR_CODES, STATUS_CODE } = require("../contants/errors");
const { validateNumber } = require("../helpers/number.helper");
const { check_list_info_product } = require("../helpers/product.helper");
const { prisma, isExistId } = require("../helpers/query.helper");

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

async function getOrdersForAdministrator(filters, logic, limit, sort, order) {
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

async function getOrdersForCustomer(customer_id, filter, logic, limit, sort, order) {
    let get_attr = `
        order.id, 
        order.total_money,
        order.prepaid,
        order.remaining,
        order.discount,
        order.vat,
        order.total_money,
        order.amount,
        order.payment_method,
        order.payment_account,
        order.phone,
        order.platform_order,
        order.note,
        order.status,
        order.address
        `;
        // order_detail.product_id,
        // product.name as product_name,
        // order_detail.quantity_sold as quantity,
        // order_detail.sale_price as price

    let get_table = `\`order\``;
    // let query_join = `
    //     LEFT JOIN order_detail ON order.id = order_detail.order_id
    //     LEFT JOIN product ON order_detail.product_id = product.id
    // `;

    let filter = `[{"field":"customer_id","condition":"=","value":"${customer_id}"}]`

    try {
        const orders = await executeSelectData({
            table: get_table,
            // queryJoin: query_join,
            strGetColumn: get_attr,
            limit: limit,
            filter: filter,
            configData: configOrderData
        })
        
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

async function createOrder(shipping, payment) {
    
    const checkProduct = order.products.map((item) => { check_list_info_product(item.products) })
    if(checkProduct) {
        return get_error_response(ERROR_CODES.PRODUCT_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    if (order.shipper_id) {
        const checkShipper = await prisma.account.findFirst({
            where: {
                employee_id: order.shiper_id,
                role_id: "SHIPPER",
            }
        })
        if (!checkShipper) {
            return get_error_response(ERROR_CODES.EMPLOYEE_SHIPPER_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
        }
    }

    const saler = await prisma.account.findFirst({
        where: {
            employee_id: order.saler_id,
            role_id: "SALER",
        }
    })

    if (!saler) {
        return get_error_response(ERROR_CODES.EMPLOYEE_SALER_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    const customer = await prisma.account.findFirst({
        where: {
            customer_id: order.customer_id
        }
    })

    if (!customer) {
        return get_error_response(ERROR_CODES.CUSTOMER_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    const check_number_in_order = check_info_number_in_order(order);
    if (check_number_in_order) {
        return check_number_in_order;
    }

    const newOrder = await prisma.order.create({
        data: {
            customer_id: order.customer_id,
            saler_id: order.saler_id,
            shipper_id: order.shipper_id,
            export_date: order.export_date,
            total_import_money: order.total_import_money,
            discount: order.discount,
            vat: order.vat,
            total_money: order.total_money,
            amount: order.amount,
            prepaid: order.prepaid,
            remaining: order.remaining,
            address: order.address,
            payment_method: order.payment_method,
            payment_account: order.payment_account,
            phone: order.phone,
            name_recipient: order.name_recipient,
            platform_order: order.platform_order,
            note: order.note,
            status: order.status,
        }
    })

    let invoiceTotalMoney  = 0
    let amount             = 0
    
    for (const detailOrder of order.products) {
        const detailOrderResult = await addOrderDetail(newOrder.id, detailOrder)

        if (detailOrderResult instanceof Object == false)
            return detailOrderResult

        invoiceTotalMoney  += detailOrderResult.totalMoney
        amount             += detailOrderResult.totalAmount
    } 

    if (invoiceTotalMoney != order.totalMoney) {
        return get_error_response(ERROR_CODES.ORDER_TOTAL_MONEY_NOT_SAME, STATUS_CODE.BAD_REQUEST);
    }

    if (amount != order.amount) {
        return get_error_response(ERROR_CODES.ORDER_AMOUNT_NOT_SAME, STATUS_CODE.BAD_REQUEST);
    }

    return get_error_response(ERROR_CODES.ORDER_SUCCESS)
}

const check_info_number_in_order = (order) => {
    const fields = [
        { value: order.total_import_money, error: ERROR_CODES.TOTAL_IMPORT_MONEY_NOT_NUMBER },
        { value: order.total_money,        error: ERROR_CODES.ORDER_TOTAL_MONEY_INVALID },
        { value: order.amount,             error: ERROR_CODES.ORDER_AMOUNT_INVALID },
        { value: order.prepaid,            error: ERROR_CODES.ORDER_PREPAID_INVALID },
        { value: order.discount,           error: ERROR_CODES.ORDER_DISCOUNT_INVALID },
        { value: order.vat,                error: ERROR_CODES.ORDER_VAT_INVALID },
    ];

    for (const field of fields) {
        const error = validateNumber(field.value);
        if (error) {
            return get_error_response(field.error, STATUS_CODE.BAD_REQUEST);
        }
    }
    
    return;
}

async function addOrderDetail(order_id, detailOrder) {
    // Kiểm tra sản phẩm
    const error = await check_list_info_product([detailOrder])

    if (error) return error

    const totalMoney = detailOrder.selling_price * detailOrder.quantity_sold;

    const total = {
        selling_price: detailOrder.selling_price,
        quantity_sold: detailOrder.quantity_sold,
        totalMoney: totalMoney,
        totalAmount: totalMoney * (1 - detailOrder.discount / 100),
    }
    
    const detailOrderNew = await prisma.order_detail.create({
        data: {
            order_id: order_id,
            product_id: detailOrder.product_id,
            unit: detailOrder.unit,
            sale_price: detailOrder.selling_price,
            discount: detailOrder.discount,
            quantity_sold: detailOrder.quantity_sold,
            amount: total.totalAmount,
            is_gift: detailOrder.is_gift,
        }
    })

    if (!detailOrderNew) {
        return get_error_response(ERROR_CODES.ORDER_DETAIL_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }
    
    return total;
}


module.exports = {
    createOrder,
    getOrdersForAdministrator,
    getOrdersForCustomer,
}