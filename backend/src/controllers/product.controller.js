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
} = require('../services/product.service');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const { check_info_product, check_list_info_product } = require('../helpers/product.helper');

class ProductController {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getProduct(req, res) {
        const { filters, limit, sort, order, logic, role, type, page } = req.query || {};

        const response = await getProductService(filters, logic, limit, sort, order, role, type, page)

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
            name, description, description_normal, image, selling_price, category_id, unit_id, warrenty_time_id, views, is_hide, status, attributes
        })

        return res.status(response.status_code).json(response);
    }
    
    async updateProduct(req, res) {
        const { name, description, description_normal, image, selling_price, category_id, unit_id, warrenty_time_id, views, is_hide, status, attributes } = req.body;

        const response = await updateProductService({
            name, description, description_normal, image, selling_price, category_id, unit_id, warrenty_time_id, views, is_hide, status, attributes
        })

        return res.status(response.status_code).json(response);
    }

    async checkListInfoProduct(req, res) {
        const { products } = req.body;

        const response = await check_list_info_product(products)

        if (response) {
            return response
        }

        return res.status(STATUS_CODE.OK).json({
            status_code: STATUS_CODE.OK,
            message: 'Sản phẩm đã được kiểm tra thành công!'
        });
    }
}

module.exports = new ProductController();