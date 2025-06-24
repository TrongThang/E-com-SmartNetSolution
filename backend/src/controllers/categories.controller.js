const { getCategoriesService,
    getCategoriesDetailService,
    createCategoriesService,
    updateCategoriesService,
    deletedSoftCategoriesService,
    restoreCategoriesService,
    deletedCategoriesService
} = require('../services/categories.service');
class CategoriesController {
    async getCategories(req, res) {
        const { filters, limit, sort, order } = req.query  || {};
        const response = await getCategoriesService(filters, limit, sort, order);
        return res.status(response.status_code).json(response);
    }

    async getCategoriesDetail(req, res) {
        const { id } = req.params;
        const response = await getCategoriesDetailService(Number(id));
        return res.status(response.status_code).json(response);
    }
    async createCategories(req, res) {
        const { name, slug,description, image, is_hide,attribute_id, parent_id } = req.body || {};
        const response = await createCategoriesService({ name, slug, description, image, is_hide, attribute_id, parent_id });
        return res.status(response.status_code).json(response);
    }
    async updateCategories(req, res) {
        const { id } = req.params;
        const { name, slug, description, image, is_hide, attribute_id, parent_id } = req.body || {};
        const response = await updateCategoriesService({ id, name, slug, description, image, is_hide, attribute_id, parent_id });
        return res.status(response.status_code).json(response);
    }

    async deletedSoftCategories(req, res) {
        const { id } = req.params;
        const { forceDelete } = req.body || {};
        const response = await deletedSoftCategoriesService(Number(id), forceDelete);
        return res.status(response.status_code).json(response);
    }
    async deletedCategories(req, res) {
        const { id } = req.params;
        const response = await deletedCategoriesService(id);
        return res.status(response.status_code).json(response);
    }
    async restoreCategories(req, res) {
        const { id } = req.params;
        const response = await restoreCategoriesService(id);
        return res.status(response.status_code).json(response);
    }

}

module.exports = new CategoriesController();