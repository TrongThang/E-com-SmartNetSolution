const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getBlog, getBlogDetail, createBlog, updateBlog, deleteBlog } = require('../controllers/blog.controller');
const { CreateBlogSchema, UpdateBlogSchema, DeleteBlogSchema } = require('../schemas/blog.schema');
const blogRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

blogRouter.get('/', asyncHandler(getBlog));
blogRouter.get('/:id', asyncHandler(getBlogDetail));
blogRouter.post('/', validateMiddleware(CreateBlogSchema), asyncHandler(createBlog));
blogRouter.put('/', validateMiddleware(UpdateBlogSchema), asyncHandler(updateBlog));
blogRouter.delete('/', validateMiddleware(DeleteBlogSchema), asyncHandler(deleteBlog));

module.exports = blogRouter;



