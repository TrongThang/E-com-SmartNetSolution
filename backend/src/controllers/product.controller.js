const {
    getProductService,
    getProductDetailService,
    createProductService,
    updateProductService,
    deleteProductService,
    getProductsByCategoryIdService,
    getProductsByCategoryIdAndStatusService,
    getProductsByCategoryIdAndStatusAndIsHideService,
    checkWarehouseInventory,
} = require('../services/product.service');
const {  check_list_info_product } = require('../helpers/product.helper');

class ProductController {

    async getProduct(req, res) {
        const { filters, limit, sort, order, logic, role, type, page } = req.query || {};

        const response = await getProductService(filters, logic, limit, sort, order, role, type, page)

        return res.status(response.status_code).json(response);
    }

    async getProductDetail(req, res) {
        const { id } = req.params;

        const response = await getProductDetailService(id)

        return res.status(response.status_code).json(response);
    }

    async getProductDetailBySlug(req, res) {
        const { slug } = req.params;

        const response = await getProductDetailService(null, slug)

        return res.status(response.status_code).json(response);
    }

    async createProduct(req, res) {
        const { name, description, description_normal, images, selling_price, category_id, unit_id, warrenty_time_id, views, is_hide, status, attributes } = req.body;

        const response = await createProductService({
            name, description, description_normal, images, selling_price, category_id, unit_id, warrenty_time_id, views, is_hide, status, attributes
        })

        return res.status(response.status_code).json(response);
    }
    
    async updateProduct(req, res) {
        const { id, name, description, description_normal, image, selling_price, category_id, unit_id, warrenty_time_id, views, is_hide, status, attributes, images } = req.body;

        const response = await updateProductService({
            id, name, description, description_normal, image, selling_price, category_id, unit_id, warrenty_time_id, views, is_hide, status, attributes, images
        })

        return res.status(response.status_code).json(response);
    }

    async deleteProduct(req, res) {
        const { product_id } = req.params
        const response = await deleteProductService(product_id)

        return res.status(response.status_code).json(response);
    }

    async checkListInfoProduct(req, res) {
        const { products } = req.body;
        const response = await check_list_info_product(products)

        console.log('response --- checkListInfoProduct', response)
        return res.status(response.status_code).json(response);
    }

    async checkWarehouseInventory(req, res) {
        const { product_id } = req.params;
        const response = await checkWarehouseInventory(product_id)
    
        return res.status(response.status_code).json(response);
    }
}

module.exports = new ProductController();