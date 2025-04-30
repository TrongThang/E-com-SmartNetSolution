const { PrismaClient } = require('@prisma/client');
const {
    getBlogService,
    getBlogDetailService,
    createBlogService,
    updateBlogService,
    deleteBlogService
} = require('../services/blog_service');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response');

class BlogController {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getBlog(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};

        const response = await getBlogService(filter, limit, sort, order);

        return res.status(response.status_code).json(response);
    }

    async getBlogDetail(req, res) {
        const { id } = req.params;
        
        const response = await getBlogDetailService(Number(id));
        
        return res.status(response.status_code).json(response);
    }

    async createBlog(req, res) {
        const { category_id, product_id, title, author, content, content_normal, image, score, is_hide } = req.body;

        const response = await createBlogService({
            category_id,
            product_id,
            title,
            author,
            content,
            content_normal,
            image,
            score,
            is_hide
        });

        return res.status(response.status_code).json(response);
    }

    async updateBlog(req, res) {
        const { id, category_id, product_id, title, author, content, content_normal, image, score, is_hide } = req.body;

        const response = await updateBlogService({
            id: Number(id),
            category_id,
            product_id,
            title,
            author,
            content,
            content_normal,
            image,
            score,
            is_hide
        });

        return res.status(response.status_code).json(response);
    }

    async deleteBlog(req, res) {
        const { id } = req.params;

        const response = await deleteBlogService(Number(id));

        return res.status(response.status_code).json(response);
    }
}

module.exports = new BlogController();


