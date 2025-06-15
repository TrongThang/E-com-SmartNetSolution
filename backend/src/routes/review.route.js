const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { createReviewSchema, updateReviewSchema, deleteReviewSchema } = require('../schemas/review.schema');

const { validateMiddleware } = require('../middleware/validate.middleware');
const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Lấy danh sách review
router.get('/', asyncHandler(reviewController.getReviews));

// Tạo review mới
router.post('/', validateMiddleware(createReviewSchema), asyncHandler(reviewController.createReview));

// Cập nhật review
router.put('/', validateMiddleware(updateReviewSchema), asyncHandler(reviewController.updateReview));

// Xóa review
router.delete('/:id', validateMiddleware(deleteReviewSchema), asyncHandler(reviewController.deleteReview));

// Lấy chi tiết review theo id
router.get('/detail/:id', asyncHandler(reviewController.getReviewDetail));

// Lấy review theo product_id
router.get('/product/:product_id', asyncHandler(reviewController.getReviewByProductId));

// Kiểm tra khách hàng đã mua và đánh giá sản phẩm
router.get('/check-customer-is-order-and-review', asyncHandler(reviewController.checkCustomerIsOrderAndReview));

module.exports = router;