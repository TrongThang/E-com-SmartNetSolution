const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const { check_info_product } = require('../helpers/product.helper');
const { getReviewService } = require('../services/review.service');

class ReviewController { 
    async getReviews(req, res)  {
        const { filter, limit, sort, order, page } = req.query;
        
        const result = await getReviewService(filter, limit, sort, order, page);
        res.status(result.status_code).json(result);
    };
}

module.exports = new ReviewController();