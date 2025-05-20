const { ERROR_CODES, STATUS_CODE } = require("../contants/errors");
const { generateOrderID } = require("../helpers/generate.helper");
const { getOrderNumber } = require("../helpers/import.warehouse.helper");
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

async function createOrder(orderData) {
    const { shipping, payment, order, products } = orderData;

    // 1. Kiểm tra thông tin sản phẩm
    const checkProduct = await check_list_info_product(products);
    if (checkProduct) return checkProduct;

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
}

async function getOrdersForCustomer(customer_id, filters, logic, limit, sort, order) {
    const get_attr = `
        order.id,
        order.order_id,
        order.total_money,
        order.prepaid,
        order.remaining,
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


async function createOrder(shipping, payment) {
    
    const checkProduct = order.products.map((item) => { check_list_info_product(item.products) })
    if(checkProduct) {
        return get_error_response(ERROR_CODES.PRODUCT_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
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
                    customer_id: order.customer_id,
                    saler_id: order.saler_id || null,
                    shipper_id: order.shipper_id || null,
                    export_date: order.export_date || new Date(),
                    total_import_money: orderTotals.totalImportMoney,
                    discount: order.discount || 0,
                    vat: order.vat || 0,
                    total_money: orderTotals.totalMoney,
                    shipping_fee: shippingFee,
                    amount: orderTotals.amount,
                    prepaid: payment.prepaid || 0,
                    remaining: payment.remaining || orderTotals.totalMoney,
                    address: fullAddress,
                    payment_method: payment.payment_method,
                    payment_account: payment.payment_account || null,
                    phone: shipping.phone,
                    name_recipient: shipping.name_recipient,
                    platform_order: order.platform_order || 'WEB',
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
                        order_id: newOrder.id,
                        product_id: product.id,
                        unit: product.unit,
                        sale_price: product.price,
                        discount: product.discount || 0,
                        quantity_sold: product.quantity,
                        amount: product.price * product.quantity * (1 - product.discount / 100),
                        is_gift: product.is_gift || false
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
        const orderId = Number(order_id)
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return get_error_response(
                errors=ERROR_CODES.ORDER_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        if (order.status === -1) {
            return get_error_response(
                errors=ERROR_CODES.ORDER_ALREADY_CANCELLED,
                status_code=STATUS_CODE.BAD_REQUEST
            );
        }

        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: -1
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

module.exports = {
    createOrder,
    getOrdersForAdministrator,
    getOrdersForCustomer,
    cancelOrderService
}