const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response');
const { executeSelectData } = require('../helpers/sql_query');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lấy danh sách review (lọc, phân trang, sắp xếp)
const getReviewService = async (filter, limit, sort, order, page = 1) => {
    let get_attr = `
        review_product.id, review_product.customer_id, review_product.product_id, 
        review_product.comment, review_product.image, review_product.rating, 
        review_product.response, review_product.note, review_product.created_at, review_product.updated_at,
        customer.surname, customer.lastname, customer.image as customer_image
    `;
    let get_table = "review_product";
    let query_join = `
        LEFT JOIN customer ON review_product.customer_id = customer.id
    `;

    try {
        const reviews = await executeSelectData({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            limit,
            filter,
            sort,
            order,
            page
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, reviews);
    } catch (error) {
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Tạo review mới
const createReviewService = async ({ customer_id, product_id, comment, image, rating }) => {
    try {
        // Kiểm tra đã mua hàng và hoàn tất đơn chưa
        const order = await prisma.order.findFirst({
            where: {
                customer_id,
                deleted_at: null,
            }
        });
        if (!order) {
            return get_error_response(ERROR_CODES.REVIEW_ORDER_REQUIRED, STATUS_CODE.FORBIDDEN);
        }

        // Kiểm tra đã đánh giá chưa (chỉ 1 review cho mỗi lần mua)
        const exist = await prisma.review_product.findFirst({
            where: { customer_id, product_id, deleted_at: null }
        });
        if (exist) {
            return get_error_response(ERROR_CODES.REVIEW_EXISTED, STATUS_CODE.CONFLICT);
        }

        const review = await prisma.review_product.create({
            data: {
                customer_id,
                product_id,
                comment,
                image,
                rating,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.CREATED, review);
    } catch (error) {
        console.log(error);
        return get_error_response(ERROR_CODES.REVIEW_CREATE_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Cập nhật review
const updateReviewService = async ({ id, customer_id, comment, image, rating }) => {
    try {
        const review = await prisma.review_product.findUnique({ where: { id } });
        if (!review || review.deleted_at) {
            return get_error_response(ERROR_CODES.REVIEW_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        if (review.customer_id !== customer_id) {
            return get_error_response(ERROR_CODES.REVIEW_FORBIDDEN, STATUS_CODE.FORBIDDEN);
        }

        const updated = await prisma.review_product.update({
            where: { id },
            data: {
                comment,
                image,
                rating,
                updated_at: new Date()
            }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, updated);
    } catch (error) {
        return get_error_response(ERROR_CODES.REVIEW_UPDATED_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Xóa mềm review (ẩn)
const deleteReviewService = async (id) => {
    try {
        const review = await prisma.review_product.findUnique({ where: { id } });
        if (!review || review.deleted_at) {
            return get_error_response(ERROR_CODES.REVIEW_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        await prisma.review_product.update({
            where: { id },
            data: { deleted_at: new Date() }
        });
        return get_error_response(ERROR_CODES.REVIEW_SUCCESS, STATUS_CODE.OK);
    } catch (error) {
        return get_error_response(ERROR_CODES.REVIEW_DELETED_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

// Lấy chi tiết review theo id
const getReviewDetailService = async (id) => {
    try {
        const review = await prisma.review_product.findUnique({
            where: { id: Number(id) },
            include: {
                customer: {
                    select: {
                        surname: true,
                        lastname: true,
                        image: true
                    }
                },
                product: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        });
        if (!review || review.deleted_at) {
            return get_error_response(ERROR_CODES.REVIEW_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, review);
    } catch (error) {
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    getReviewService,
    createReviewService,
    updateReviewService,
    deleteReviewService,
    getReviewDetailService
};
