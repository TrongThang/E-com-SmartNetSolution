const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const { check_info_product } = require('../helpers/product.helper');
const { getReviewService,
    createReviewService,
    updateReviewService,
    deleteReviewService,
    getReviewDetailService,
    getReviewByProductIdService,
    checkCustomerIsOrderAndReview
} = require('../services/review.service');

class ReviewController {

    async getReviews(req, res) {
        const { filter, limit, sort, order, page } = req.query;

        const result = await getReviewService(filter, limit, sort, order, page);
        res.status(result.status_code).json(result);
    };

    async createReview(req, res) {
        const { customer_id, product_id, comment, image, rating } = req.body;
        const result = await createReviewService({ customer_id, product_id, comment, image, rating });
        res.status(result.status_code).json(result);
    };

    async updateReview(req, res) {
        const { id, customer_id, comment, image, rating } = req.body;
        const result = await updateReviewService({ id, customer_id, comment, image, rating });
        res.status(result.status_code).json(result);
    };

    // Xóa review
    async deleteReview(req, res) {
        const { id } = req.params;
        const result = await deleteReviewService(Number(id));
        res.status(result.status_code).json(result);
    };

    // Lấy chi tiết review
    async getReviewDetail(req, res) {
        const { id } = req.params;
        const result = await getReviewDetailService(Number(id));
        res.status(result.status_code).json(result);
    };

    // Lấy review theo product_id
    async getReviewByProductId(req, res) {
        const { product_id } = req.params;
        const { filter, limit, sort, order, page } = req.query;
        const result = await getReviewByProductIdService(product_id, filter, limit, sort, order, page);
        res.status(result.status_code).json(result);
    }

    async checkCustomerIsOrderAndReview(req, res) {
        const { customer_id, product_id } = req.query;
        const result = await checkCustomerIsOrderAndReview(customer_id, product_id);
        res.status(result.status_code).json(result);
    }
}

module.exports = new ReviewController();
