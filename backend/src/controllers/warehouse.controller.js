const {
    getWarehouseService,
    getWarehouseDetailService,
    createWarehouseService,
    updateWarehouseService,
    deleteWarehouseService
} = require('../services/warehouse.service');

class WarehouseController {
    async getWarehouse(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};
        const response = await getWarehouseService(filter, limit, sort, order);
        return res.status(response.status_code).json(response);
    }

    async getWarehouseDetail(req, res) {
        const { id } = req.params;
        const response = await getWarehouseDetailService(id);
        return res.status(response.status_code).json(response);
    }

    async createWarehouse(req, res) {
        const { name, address } = req.body;
        const response = await createWarehouseService({ name, address });
        return res.status(response.status_code).json(response);
    }

    async updateWarehouse(req, res) {
        const { id, name, address } = req.body;
        const response = await updateWarehouseService({ id: Number(id), name, address });
        return res.status(response.status_code).json(response);
    }

    async deleteWarehouse(req, res) {
        const { id } = req.params;
        const response = await deleteWarehouseService(Number(id));
        return res.status(response.status_code).json(response);
    }
}

module.exports = new WarehouseController();