const { getOrdersForAdministrator, getOrdersForCustomer, createOrder, cancelOrderService } = require("../services/order.service");
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

    async getOrdersForCustomer(req, res) {
        const { customer_id } = req.params;
        const { filter, logic, limit, sort, order } = req.query;

        const result = await getOrdersForCustomer(customer_id, filter, logic, limit, sort, order);

        res.status(result.status_code).json(result);
    }

    async createOrder(req, res) {
        const result = await createOrder(req.body);
        
        console.log("result", result)
        const response = res.status(result.status_code).json(result);
        return response;
    }

    async canceledOrder(req, res) {
        const {order_id} = req.body;
        const result = await cancelOrderService(order_id);
        res.status(result.status_code).json(result);
    }
}

module.exports = new OrderController();
