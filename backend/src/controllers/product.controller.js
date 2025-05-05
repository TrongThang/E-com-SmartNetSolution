const { PrismaClient } = require('@prisma/client');
const {
    getProductService,
    getProductDetailService,
    createProductService,
    updateProductService,
    deleteProductService,
    getProductsByCategoryIdService,
    getProductsByCategoryIdAndStatusService,
    getProductsByCategoryIdAndStatusAndIsHideService
} = require('../services/product_service');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response');

class ProductController {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getProduct(req, res) {
        const { filter = null, limit = null, sort = null, order = null, role = null, type = null } = req.body || {};

        const response = await getProductService(filter, limit, sort, order, role, type)

        return res.status(response.status_code).json(response);
    }

    async getProductDetail(req, res) {
        console.log('Xem chi tiết sản phẩm!');

        const { id } = req.params;

        const response = await getProductDetailService(Number(id))

        return res.status(response.status_code).json(response);
    }

    async createProduct(req, res) {
        const { name, description, description_normal, image, selling_price, category_id, unit_id, warrenty_time_id, views, is_hide, status, attributes } = req.body;

        const response = await createProductService({
            name, description, image, selling_price, category_id, unit_id, warrenty_time_id, views, is_hide, status, attributes
        })

        return res.status(response.status_code).json(response);
    }
    


}

module.exports = new ProductController();