const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getCardStatistics, getChartStatistics } = require('../controllers/dashboard.contoller');
const dashboardRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

dashboardRouter.get(
    '/card',
    asyncHandler(getCardStatistics)
);

dashboardRouter.get(
    '/chart',
    asyncHandler(getChartStatistics)
);

module.exports = dashboardRouter;
