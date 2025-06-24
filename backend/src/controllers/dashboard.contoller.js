const { getDashboardService, getChartStatisticsService, getCardStatisticsService } = require('../services/dashboard.service');
const { get_error_response } = require('../helpers/response.helper');

class DashboardController {
    async getDashboard(req, res) {
        const { period } = req.query;

        const response = await getDashboardService(period);

        return res.status(response.status_code).json(response);
    }

    async getChartStatistics(req, res) {
        const { period } = req.query;

        const response = await getChartStatisticsService(period);

        return res.status(response.status_code).json(response);
    }

    async getCardStatistics(req, res) {
        const { period } = req.query;

        const response = await getCardStatisticsService(period);

        return res.status(response.status_code).json(response);
    }
}

module.exports = new DashboardController();