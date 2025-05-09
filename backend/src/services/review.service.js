const { ERROR_CODES, STATUS_CODE } = require("../contants/errors");
const { get_error_response } = require("../helpers/response.helper");
const { executeSelectData } = require("../helpers/sql_query");

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

module.exports = {
    getReviewService,
    // createReviewService,
    // updateReviewService,
    // deleteReviewService,
    // getReviewDetailService
};