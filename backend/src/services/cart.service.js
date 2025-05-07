const { ERROR_CODES, STATUS_CODE } = require("../contants/errors");
const { prisma, isExistId } = require("../helpers/query.helper");
const { get_error_response, get_success_response } = require("../helpers/response.helper");
const { validateNumber } = require("../helpers/number.helper");
const logger = require("../utils/logger");

async function checkCustomerAndProduct (customer_id, product_id) {
    const customer = await isExistId(customer_id, "customer");
    if (!customer) {
        return get_error_response(
            ERROR_CODES.CUSTOMER_NOT_FOUND,
            STATUS_CODE.BAD_REQUEST
        );
    }

    const product = await isExistId(product_id, "product");
    if (!product) {
        return get_error_response(
            ERROR_CODES.PRODUCT_NOT_FOUND,
            STATUS_CODE.BAD_REQUEST
        );
    }

    return undefined;
};

async function checkQuantityAndInventory (product_id, quantity) {
    const quantityError = validateNumber(quantity);
    if (quantityError) {
        return get_error_response(
            ERROR_CODES.CART_PRODUCT_QUANTITY_INVALID,
            STATUS_CODE.BAD_REQUEST
        );
    }

    // Kiểm tra tồn kho
    const inventory = await prisma.warehouse_inventory.aggregate({
        where: {
            product_id,
            deleted_at: null,
            stock: { gt: 0 },
        },
        _sum: { stock: true },
    });

    if (!inventory._sum.quantity || inventory._sum.quantity < quantity) {
        return get_error_response(
            ERROR_CODES.CART_PRODUCT_INSUFFICIENT_INVENTORY,
            STATUS_CODE.BAD_REQUEST
        );
    }
    return undefined;
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {Object} cartItem - Thông tin sản phẩm trong giỏ hàng (customer_id, product_id, quantity)
 * @returns {Object} - Phản hồi thành công hoặc lỗi
 */
async function addToCart(cartItem) {
    const { customer_id, product_id, quantity } = cartItem;

    try {
        // Kiểm tra sự tồn tại của khách hàng và sản phẩm
        const isErrorCustomerOrProduct = checkCustomerAndProduct(customer_id, product_id);
        if (isErrorCustomerOrProduct) {
            return isErrorCustomerOrProduct;
        }

        // Kiểm tra số lượng hợp lệ và tồn kho
        const isQuantityError = checkQuantityAndInventory(product_id, quantity);
        if (isQuantityError) {
            return isQuantityError;
        }

        // Thêm sản phẩm vào giỏ hàng trong transaction
        const cartData = await prisma.$transaction(async (tx) => {
            // Tìm hoặc tạo giỏ hàng cho khách hàng
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            let existingItem = await tx.cart.findFirst({
                where: { customer_id, product_id, deleted_at: null },
            });

            if (!existingItem) {
                cart = await tx.cart.create({
                    data: { customer_id, product_id, quantity },
                });
            } else {
                // Cập nhật số lượng nếu sản phẩm đã tồn tại
                cartItem = await tx.cart.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + quantity },
                });
            }

            return { cart, cartItem };
        });

        logger.info(`Added product ${product_id} to cart for customer ${customer_id}`);
        return get_success_response(
            ERROR_CODES.CART_SUCCESS,
            STATUS_CODE.OK
        );
    } catch (err) {
        logger.error(`Error adding to cart: ${err.message}`);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * @param {Object} cartItem - Thông tin cập nhật (customer_id, product_id, quantity)
 * @returns {Object} - Phản hồi thành công hoặc lỗi
 */
async function updateCartItem(cartItem) {
    const { customer_id, product_id, quantity } = cartItem;

    try {
        // Kiểm tra sự tồn tại của khách hàng và sản phẩm
        const isErrorCustomerOrProduct = checkCustomerAndProduct(customer_id, product_id);
        if (isErrorCustomerOrProduct) {
            return isErrorCustomerOrProduct;
        }

        // Kiểm tra số lượng hợp lệ
        const isQuantityError = checkQuantityAndInventory(product_id, quantity);
        if (isQuantityError) {
            return isQuantityError;
        }

        // Cập nhật giỏ hàng trong transaction
        const cartData = await prisma.$transaction(async (tx) => {
            // Tìm giỏ hàng
            const cart = await tx.cart.findFirst({
                where: { customer_id, product_id, deleted_at: null },
            });

            if (!cart) {
                return get_error_response(
                    ERROR_CODES.CART_ITEM_NOT_FOUND,
                    STATUS_CODE.BAD_REQUEST
                );
            }

            // Cập nhật số lượng
            const updatedItem = await tx.cart.update({
                where: { id: cart.id },
                data: { quantity },
            });

            return { cart, updatedItem };
        });

        if (cartData.status) return cartData; // Trả về lỗi nếu có

        logger.info(`Updated product ${product_id} quantity to ${quantity} in cart for customer ${customer_id}`);
        return get_success_response(
            ERROR_CODES.CART_SUCCESS,
            STATUS_CODE.OK,
        );
    } catch (err) {
        logger.error(`Error updating cart item: ${err.message}`);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * @param {Object} cartItem - Thông tin xóa (customer_id, product_id)
 * @returns {Object} - Phản hồi thành công hoặc lỗi
 */
async function removeFromCart(cartItem) {
    const { customer_id, product_id } = cartItem;

    try {
        // Kiểm tra sự tồn tại của khách hàng
        const customer = await isExistId(customer_id, "customer");
        if (!customer) {
            return get_error_response(
                ERROR_CODES.CUSTOMER_NOT_FOUND,
                STATUS_CODE.BAD_REQUEST
            );
        }

        // Xóa sản phẩm trong transaction
        const cartData = await prisma.$transaction(async (tx) => {
            // Tìm giỏ hàng và sản phẩm cần xoá
            const cart = await tx.cart.findFirst({
                where: {
                    customer_id,
                    product_id,
                    deleted_at: null
                },
            });

            if (!cart) {
                return get_error_response(
                    ERROR_CODES.CART_ITEM_NOT_FOUND,
                    STATUS_CODE.BAD_REQUEST
                );
            }

            await tx.cart.delete({
                where: { 
                    id: cart.id,
                    deleted_at: null
                },
            });

            return { cart };
        });

        if (cartData.status) return cartData;

        logger.info(`Removed product ${product_id} from cart for customer ${customer_id}`);
        return get_success_response(
            ERROR_CODES.CART_SUCCESS,
            STATUS_CODE.OK,
        );
    } catch (err) {
        logger.error(`Error removing from cart: ${err.message}`);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

/**
 * Xem giỏ hàng của khách hàng
 * @param {number} customer_id - ID của khách hàng
 * @returns {Object} - Phản hồi chứa thông tin giỏ hàng
 */
async function getCart(customer_id) {
    // Kiểm tra customer_id
    const { error } = Joi.number().required().validate(customer_id);
    if (error) {
        return get_error_response(
            ERROR_CODES.INVALID_INPUT,
            STATUS_CODE.BAD_REQUEST,
            "Invalid customer_id"
        );
    }

    try {
        // Kiểm tra sự tồn tại của khách hàng
        const customer = await isExistId(customer_id, "customer");
        if (!customer) {
            return get_error_response(
                ERROR_CODES.CUSTOMER_NOT_FOUND,
                STATUS_CODE.BAD_REQUEST
            );
        }

        // Lấy giỏ hàng và các sản phẩm
        const cart = await prisma.cart.findFirst({
            where: { customer_id, deleted_at: null },
        });

        if (!cart) {
            return get_success_response(
                ERROR_CODES.CART_NOT_FOUND,
                STATUS_CODE.OK,
                { cart: null, items: [] },
            );
        }

        logger.info(`Retrieved cart for customer ${customer_id}`);
        return get_success_response(
            ERROR_CODES.CART_SUCCESS,
            STATUS_CODE.OK,
            cart
        );
    } catch (err) {
        logger.error(`Error retrieving cart: ${err.message}`);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

/**
 * Xác nhận giỏ hàng để tạo đơn hàng
 * @param {Object} confirmData - Thông tin xác nhận (customer_id)
 * @returns {Object} - Phản hồi thành công hoặc lỗi
 */
async function confirmCart(confirmData) {
    const { customer_id, product_list } = confirmData;

    try {
        // Kiểm tra sự tồn tại của khách hàng
        const customer = await isExistId(customer_id, "customer");
        if (!customer) {
            return get_error_response(
                ERROR_CODES.CUSTOMER_NOT_FOUND,
                STATUS_CODE.BAD_REQUEST
            );
        }

        // Tạo đơn hàng từ giỏ hàng trong transaction
        const result = await prisma.$transaction(async (tx) => {
            // Tìm giỏ hàng
            const cart = await tx.cart.findFirst({
                where: { customer_id, deleted_at: null },
                include: {
                    cart_items: {
                        select: {
                            product_id: true,
                            quantity: true,
                            product: {
                                select: { unit_price: true },
                            },
                        },
                    },
                },
            });

            // Tính tổng giá trị đơn hàng
            const total_price = cart.cart_items.reduce(
                (sum, item) => sum + item.quantity * item.product.unit_price,
                0
            );

            // Tạo đơn hàng
            const order = await tx.order.create({
                data: {
                    customer_id,
                    total_price,
                    status: "PREPARING",
                },
            });

            await tx.cart.delete({
                where: { id: cart.id },
            });

            return order;
        });

        if (result.status) return result;

        logger.info(`Confirmed cart and created order for customer ${customer_id}`);
        return get_success_response(
            STATUS_CODE.OK,
            result,
            "Order created successfully"
        );
    } catch (err) {
        logger.error(`Error confirming cart: ${err.message}`);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    addToCart,
    updateCartItem,
    removeFromCart,
    getCart,
    confirmCart,
};