const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../controllers/review.controller');
const { createReviewSchema, updateReviewSchema, deleteReviewSchema } = require('../schemas/review.schema');

const { validateMiddleware } = require('../middleware/validate.middleware');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

// Lấy danh sách review
reviewRouter.get('/', asyncHandler(reviewController.getReviews));

module.exports = reviewRouter;