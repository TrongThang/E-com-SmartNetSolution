const { getLikedService, createLikedService, deleteLikedService, checkLikedService } = require('../services/liked.service');

class LikedController {
    async getLiked(req, res) {
        const { customer_id } = req.params;

        const response = await getLikedService(customer_id);

        return res.status(response.status_code).json(response);
    };

    async checkLiked(req, res) {
        const { customer_id, product_id } = req.params;
        const response = await checkLikedService(customer_id, product_id);
        return res.status(response.status_code).json(response);
    };

    async createLiked(req, res) {
        const { product_id, customer_id } = req.body;

        const response = await createLikedService(product_id, customer_id);

        return res.status(response.status_code).json(response);
    };

    async deleteLiked(req, res) {
        const { customer_id, product_id } = req.params;

        const response = await deleteLikedService(customer_id, product_id);

        return res.status(response.status_code).json(response);
    };
}

module.exports = new LikedController();

