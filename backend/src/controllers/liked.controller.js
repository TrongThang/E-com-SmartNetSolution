const { PrismaClient } = require('@prisma/client');
const { getLikedService, createLikedService, deleteLikedService } = require('../services/liked.service');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');

class LikedController {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getLiked(req, res) {
        const { customer_id } = req.params;

        const response = await getLikedService(customer_id);

        return res.status(response.status_code).json(response);
    };

    async createLiked(req, res) {
        const { customer_id, product_id } = req.body;

        const response = await createLikedService(customer_id, product_id);

        return res.status(response.status_code).json(response);
    };

    async deleteLiked(req, res) {
        const { customer_id, id } = req.params;

        const response = await deleteLikedService(customer_id, id);

        return res.status(response.status_code).json(response);
    };
}

module.exports = new LikedController();

