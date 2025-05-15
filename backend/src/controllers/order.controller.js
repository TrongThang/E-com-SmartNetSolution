const { getOrdersForAdministrator, createOrder } = require("../services/order.service");
const { PrismaClient } = require('@prisma/client');

class OrderController {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getOrdersForAdministrator(req, res) {
        const { filter, logic, limit, sort, order } = req.query;
        
        const result = await getOrdersForAdministrator(
            filter,
            logic,
            limit,
            sort,
            order
        );

        res.status(result.status_code).json(result);
    }

    async createOrder(req, res) {
        const { shipping, payment } = req.body;

        const result = await createOrder(shipping, payment);
        
        res.status(result.status_code).json(result);
    }
}

module.exports = new OrderController();
