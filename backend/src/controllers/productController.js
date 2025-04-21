const { PrismaClient } = require('@prisma/client');
const {
    getProductService,
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