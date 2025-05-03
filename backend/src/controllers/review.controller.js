const {
    getReviewService,
    createReviewService,
    updateReviewService,
    deleteReviewService,
    getReviewDetailService
} = require('../services/review_service');

// Lấy danh sách review
const getReview = async (req, res) => {
    const { filter, limit, sort, order, page } = req.query;
    const result = await getReviewService(filter, limit, sort, order, page);
    res.status(result.status_code).json(result);
};

// Tạo review mới
const createReview = async (req, res) => {
    const { customer_id, product_id, comment, image, rating } = req.body;
    const result = await createReviewService({ customer_id, product_id, comment, image, rating });
    res.status(result.status_code).json(result);
};

// Cập nhật review
const updateReview = async (req, res) => {
    const { id, customer_id, comment, image, rating } = req.body;
    const result = await updateReviewService({ id, customer_id, comment, image, rating });
    res.status(result.status_code).json(result);
};

// Xóa review
const deleteReview = async (req, res) => {
    const { id } = req.params;
    const result = await deleteReviewService(Number(id));
    res.status(result.status_code).json(result);
};

// Lấy chi tiết review
const getReviewDetail = async (req, res) => {
    const { id } = req.params;
    const result = await getReviewDetailService(Number(id));
    res.status(result.status_code).json(result);
};

module.exports = {
    getReview,
    createReview,
    updateReview,
    deleteReview,
    getReviewDetail
};
