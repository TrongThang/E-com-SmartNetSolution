const {
    getWarrentyTimeService,
    getWarrentyTimeDetailService,
    createWarrentyTimeService,
    updateWarrentyTimeService,
    deleteWarrentyTimeService
} = require('../services/warrentyTime.service');

class WarrentyTimeController {
    async getAllWarrentyTime(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};
        const response = await getWarrentyTimeService(filter, limit, sort, order);
        return res.status(response.status_code).json(response);
    }

    async getDetailWarrentyTime(req, res) {
        const { id } = req.params;
        const response = await getWarrentyTimeDetailService(id);
        return res.status(response.status_code).json(response);
    }

    async createWarrentyTime(req, res) {
        const { name, time } = req.body;
        const response = await createWarrentyTimeService({ name, time });
        return res.status(response.status_code).json(response);
    }

    async updateWarrentyTime(req, res) {
        const { id, name, time } = req.body;
        const response = await updateWarrentyTimeService({ id, name, time });
        return res.status(response.status_code).json(response);
    }

    async deleteWarrentyTime(req, res) {
        const { id } = req.params;
        const response = await deleteWarrentyTimeService(Number(id));
        return res.status(response.status_code).json(response);
    }
}

module.exports = new WarrentyTimeController();