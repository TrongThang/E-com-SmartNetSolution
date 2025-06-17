const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { executeSelectData } = require('../helpers/sql_query')
const { get_error_response } = require('../helpers/response.helper');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getLikedService = async (id) => {
    const customer = await prisma.customer.findFirst({
        where: {
            id: id
        }
    })

    if (!customer) {
        return get_error_response(
            errors=ERROR_CODES.LIKED_CUSTOMER_ID_REQUIRED,
            status_code=STATUS_CODE.BAD_REQUEST
        );
    }

    // Các cột cần lấy từ liked và product
    let get_attr = `liked.product_id, product.name, product.image, product.selling_price, product.description, product.slug`
    
    let get_table = `liked`

    // Join với bảng product
    let query_join = `LEFT JOIN product ON ${get_table}.product_id = product.id`

    // Điều kiện lọc theo customer_id và deleted_at is null
    let filter = `[{"field":"${get_table}.customer_id","condition":"=","value":"${id}"}]`

    try {
        const liked = await executeSelectData({ 
            table: get_table,
            queryJoin: query_join, 
            strGetColumn: get_attr,
            filter: filter
        })

        return get_error_response(
            errors=ERROR_CODES.SUCCESS, 
            status_code=STATUS_CODE.OK, 
            data=liked
        );
    } catch (error) {
        console.error('Error in getLikedService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR, 
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const checkLikedService = async (customer_id, product_id) => {
    const liked = await prisma.liked.findFirst({
        where: {
            customer_id: customer_id,
            product_id: product_id,
            deleted_at: null
        }
    })

    console.log("liked: ", liked ? true : false)

    return {
        status_code: STATUS_CODE.OK,
        data: liked ? true : false
    }
}

const createLikedService = async (product_id, customer_id) => {
    try {
        // Chuyển đổi product_id từ chuỗi sang số nguyên
        const productId = product_id;
        
        if (isNaN(productId)) {
            return get_error_response(
                errors=ERROR_CODES.LIKED_PRODUCT_ID_REQUIRED,
                status_code=STATUS_CODE.BAD_REQUEST,
                data="Invalid product ID format"
            );
        }

        // Kiểm tra xem đã like sản phẩm này chưa
        const existingLike = await prisma.liked.findFirst({
            where: {
                customer_id: customer_id,
                product_id: productId,
                deleted_at: null
            }
        });

        if (existingLike) {
            return get_error_response(
                errors=ERROR_CODES.LIKED_ALREADY_EXISTS,
                status_code=STATUS_CODE.BAD_REQUEST
            );
        }

        const liked = await prisma.liked.create({
            data: {
                customer_id,
                product_id: productId,
                created_at: new Date(),
            }
        });

        if (!liked) {
            return get_error_response(
                errors=ERROR_CODES.LIKED_CREATE_FAILED,
                status_code=STATUS_CODE.BAD_REQUEST
            );
        }

        return get_error_response(
            errors=ERROR_CODES.SUCCESS, 
            status_code=STATUS_CODE.OK, 
            data=liked
        );
    }
    catch (error) {
        console.error('Error in createLikedService:', error);
        return get_error_response(
            errors=ERROR_CODES.LIKED_CREATE_FAILED, 
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const deleteLikedService = async (customer_id, product_id) => {
    try {
        // Kiểm tra xem liked có tồn tại không
        const likedToDelete = await prisma.liked.findFirst({
            where: { customer_id: customer_id, product_id: product_id, deleted_at: null }
        });

        if (!likedToDelete) {
            return get_error_response(
                errors=ERROR_CODES.LIKED_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        // Xóa mềm liked 
        await prisma.liked.update({
            where: { id: likedToDelete.id },
            data: {
                deleted_at: new Date()
            }
        });

        return get_error_response(
            errors=ERROR_CODES.SUCCESS, 
            status_code=STATUS_CODE.OK, 
            data="Liked deleted successfully"
        );
    }
    catch (error) {
        console.error('Error in deleteLikedService:', error);
        return get_error_response(
            errors=ERROR_CODES.LIKED_DELETED_FAILED, 
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    getLikedService,
    createLikedService,
    deleteLikedService,
    checkLikedService
};

