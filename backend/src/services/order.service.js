const { ERROR_CODES, STATUS_CODE, ERROR_MESSAGES } = require("../contants/errors");
const { validateNumber } = require("../helpers/number.helper");
const { check_list_info_product } = require("../helpers/product.helper");
const { prisma, isExistId } = require("../helpers/query.helper");

const { get_error_response } = require("../helpers/response.helper");

async function createOrder(order) {
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
    
    const detailOrder = await prisma.order_detail.create({
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

    if (!detailOrder) {
        return get_error_response(ERROR_CODES.ORDER_DETAIL_CREATE_FAILED, STATUS_CODE.BAD_REQUEST);
    }
    
    return total;
}

module.exports = {
    createOrder,
}