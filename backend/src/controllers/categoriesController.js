const { getCategoriesService,
    getCategoriesDetailService,
    createCategoriesService } = require('../services/categories.service');
const { get_error_response } = require('../helpers/response');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { PrismaClient } = require('@prisma/client');

class CategoriesController {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getCategories(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};
        const response = await getCategoriesService(filter, limit, sort, order);
        return res.status(response.status_code).json(response);
    }

    async getCategoriesDetail(req, res) {
        const { id } = req.params;
        const response = await getCategoriesDetailService(Number(id));
        return res.status(response.status_code).json(response);
    }
    async createCategories(req, res) {
        const { name, description, image, is_hide, attribute } = req.body || {};
        const response = await createCategoriesService({ name, description, image, is_hide, attribute });
        return res.status(response.status_code).json(response);
    }
}

module.exports = new CategoriesController();