const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getLiked, createLiked, deleteLiked } = require('../controllers/liked.controller');
const { CreateLikedSchema, DeleteLikedSchema } = require('../schemas/liked.schema');
const likedRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

likedRouter.get('/:customer_id', asyncHandler(getLiked));
likedRouter.post('/', validateMiddleware(CreateLikedSchema), asyncHandler(createLiked));
likedRouter.delete('/:customer_id/:id', validateMiddleware(DeleteLikedSchema), asyncHandler(deleteLiked));

module.exports = likedRouter;
