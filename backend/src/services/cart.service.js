const { ERROR_CODES, STATUS_CODE } = require("../contants/errors");
const { isExistId } = require("../helpers/query.helper");
const { get_error_response, get_success_response } = require("../helpers/response.helper");
const { validateNumber } = require("../helpers/number.helper");
const { getProductService } = require("./product.service");
const prisma = require('../config/database');

async function checkCustomerAndProduct (customer_id, product_id) {
    const customer = await prisma.customer.findFirst({
        where: {
            id: customer_id,
            deleted_at: null
        }
    });
    if (!customer) {
        return get_error_response(
            ERROR_CODES.CUSTOMER_NOT_FOUND,
            STATUS_CODE.BAD_REQUEST
        );
    }

    const product = await prisma.product.findFirst({
        where: {
            id: product_id,
            deleted_at: null
        }
    });
    if (!product) {
        return get_error_response(
            ERROR_CODES.PRODUCT_NOT_FOUND,
            STATUS_CODE.BAD_REQUEST
        );
    }
    return undefined;
};

async function checkQuantityAndInventory(product_id, quantity) {
    
    // Kiểm tra tồn kho
    const inventory = await prisma.warehouse_inventory.aggregate({
        where: {
            product_id,
            deleted_at: null,
            stock: { gt: 0 },
        },
        _sum: { stock: true },
    });
    
    if (!inventory._sum.stock || inventory._sum.stock < quantity) {
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
async function addToCart(customer_id, product_id, quantity) {

    try {
        // Kiểm tra sự tồn tại của khách hàng và sản phẩm
        const isErrorCustomerOrProduct = await checkCustomerAndProduct(customer_id, product_id);
        if (isErrorCustomerOrProduct) {
            return isErrorCustomerOrProduct;
        }

        // Kiểm tra số lượng hợp lệ và tồn kho
        const isQuantityError = await checkQuantityAndInventory(product_id, quantity);
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

                const ware_house_inventory = await tx.warehouse_inventory.aggregate({
                    where: { product_id, deleted_at: null },
                    _sum: { stock: true },
                });

                if (!ware_house_inventory._sum.stock || ware_house_inventory._sum.stock < quantity) {
                    return get_error_response(
                        ERROR_CODES.CART_PRODUCT_INSUFFICIENT_INVENTORY,
                        STATUS_CODE.BAD_REQUEST
                    );
                }

                await tx.cart.create({
                    data: { customer_id, product_id, quantity, selected: true },
                });
            } else {
                // Cập nhật số lượng nếu sản phẩm đã tồn tại
                const cartItem = await tx.cart.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + quantity, selected: existingItem.selected },
                });
            }
        });

        return get_error_response(
            ERROR_CODES.CART_SUCCESS,
            STATUS_CODE.OK
        );
    } catch (err) {
        console.log("err", err)
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
async function updateQuantityCartItem(cartItem) {
    const { customer_id, product_id, quantity } = cartItem;
    try {
        // Kiểm tra sự tồn tại của khách hàng và sản phẩm
        const isErrorCustomerOrProduct = await checkCustomerAndProduct(customer_id, product_id);
        if (isErrorCustomerOrProduct) {
            return isErrorCustomerOrProduct;
        }

        // Kiểm tra số lượng hợp lệ
        const isQuantityError = await checkQuantityAndInventory(product_id, quantity);

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
                data: { quantity: quantity, selected: cart.selected },
            });

            return { cart, updatedItem };
        });

        return get_error_response(
            ERROR_CODES.CART_SUCCESS,
            STATUS_CODE.OK,
            cartData
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
async function removeFromCart(customer_id, product_id) {
    try {
        // Kiểm tra sự tồn tại của khách hàng
        const customer = await prisma.customer.findFirst({
            where: {
                id: customer_id,
                deleted_at: null
            }
        });
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
                    product_id: product_id,
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
        
        return get_error_response(
            ERROR_CODES.CART_SUCCESS,
            STATUS_CODE.OK,
        );
    } catch (err) {
        console.log("err", err)
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
async function getCart(customer_id = null) {
    try {
        // Kiểm tra sự tồn tại của khách hàng
        const customer = await prisma.customer.findFirst({
            where: { id: customer_id, deleted_at: null }
        });

        if (!customer) {
            return get_error_response(
                ERROR_CODES.CUSTOMER_NOT_FOUND,
                STATUS_CODE.BAD_REQUEST
            );
        }

        const cart = await prisma.cart.findMany({
            where: { customer_id, deleted_at: null },
        });

        // Lấy lại giỏ hàng đã cập nhật
        if (cart.length > 0) {
            let filters = [{
                field: "product.id",
                condition: "in",
                value: cart.map(item => item.product_id)
            }]

            const productCart = await getProductService(filters = filters)

            const productCartConfig = productCart.data.data.map(item => ({
                id: item.id,
                image: item.image,
                name: item.name,
                selling_price: item.selling_price,
                status: item.status,
                stock: item.stock,
                delta: item.delta,
                quantity: cart.find(cartItem => cartItem.product_id === item.id)?.quantity || 0,
                selected: cart.find(cartItem => cartItem.product_id === item.id)?.selected || 1
            }))

            return get_error_response(
                ERROR_CODES.CART_SUCCESS,
                STATUS_CODE.OK,
                productCartConfig
            );
        }

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            []
        );
    } catch (err) {
        console.log('err', err)
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

async function fetchLatestProductInfo(filters) {
    const product = await getProductService(filters = filters)

    const productCartConfig = product.data.data.map(item => ({
        id: item.id,
        image: item.image,
        name: item.name,
        selling_price: item.selling_price,
        status: item.status,
        stock: item.stock,
        delta: item.delta,
    }))

    return get_error_response(
        ERROR_CODES.CART_SUCCESS,
        STATUS_CODE.OK,
        productCartConfig
    );
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

const updateCart = async (customer_id, items) => {

    try {
        // Lấy danh sách sản phẩm hiện có trong giỏ hàng
        const existingCart = await prisma.cart.findMany({
            where: { customer_id, deleted_at: null },
        });

        // Nếu không có cart hiện tại
        if (!existingCart) {
            return get_error_response(
                ERROR_CODES.CART_NOT_FOUND,
                STATUS_CODE.BAD_REQUEST
            );
        }

        // Danh sách product_id đã có trong cart
        const existingProductIds = existingCart.map(item => item.product_id);

        // Phân loại sản phẩm đã thêm và chưa thêm
        const itemsAlreadyInCart = items.filter(item =>
            existingProductIds.includes(item.id)
        );

        const itemsNotInCart = items.filter(item =>
            !existingProductIds.includes(item.id)
        );

        // Thêm sản phẩm mới vào cart
        for (const item of itemsNotInCart) {
            await prisma.cart.create({
                data: {
                    customer_id,
                    product_id: item.id,
                    quantity: item.quantity,
                    created_at: new Date()
                }
            });
        }

        const productCart = await getCart(customer_id)
        
        return get_error_response(
            ERROR_CODES.CART_SUCCESS,
            STATUS_CODE.OK,
            productCart.data
        );
    } catch (error) {
        console.error(error);
        return get_error_response(
            ERROR_CODES.CART_UPDATE_FAILED,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const removeAllFromCart = async (customer_id) => {
    try {
        await prisma.cart.deleteMany({
            where: { customer_id, deleted_at: null }
        });
    } catch (error) {
        console.error(error);
        return get_error_response(
            ERROR_CODES.CART_DELETE_FAILED,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const removeSelected = async (customer_id, items) => {
    try {
        console.log("items", items)

        await prisma.cart.deleteMany({
            where: { customer_id, product_id: { in: items.map(item => item.id) }, deleted_at: null }
        });
    } catch (error) {
        console.error(error);
        return get_error_response(
            ERROR_CODES.CART_DELETE_FAILED,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}



module.exports = {
    addToCart,
    updateQuantityCartItem,
    removeFromCart,
    getCart,
    confirmCart,
    updateCart,
    removeAllFromCart,
    removeSelected,
    fetchLatestProductInfo
};