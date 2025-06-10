const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getLiked, createLiked, deleteLiked, checkLiked } = require('../controllers/liked.controller');
const { CreateLikedSchema, DeleteLikedSchema } = require('../schemas/liked.schema');
const likedRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

likedRouter.get('/detail/:customer_id', asyncHandler(getLiked));
likedRouter.get('/:customer_id/:product_id/check', asyncHandler(checkLiked));
likedRouter.post('/', validateMiddleware(CreateLikedSchema), asyncHandler(createLiked));
likedRouter.delete('/:customer_id/:product_id', validateMiddleware(DeleteLikedSchema), asyncHandler(deleteLiked));

module.exports = likedRouter;
