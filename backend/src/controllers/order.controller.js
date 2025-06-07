const { getOrdersForAdministrator, getOrdersForCustomer, createOrder, cancelOrderService, getOrderDetailService, respondListOrderService, getOrderForWarehouseEmployee } = require("../services/order.service");
const { PrismaClient } = require('@prisma/client');

class OrderController {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getOrdersForWarehouseEmployee(req, res) {
        const { filter, logic, limit, sort, order } = req.query;
        const result = await getOrderForWarehouseEmployee(filter, logic, limit, sort, order);
        res.status(result.status_code).json(result);
    }

    async getOrdersForAdministrator(req, res) {
        const { filter, logic, limit, sort, order } = req.query;
        
        console.log("filter", filter)
        const result = await getOrdersForAdministrator(
            filter,
            logic,
            limit,
            sort,
            order
        );

        res.status(result.status_code).json(result);
    }

    async getOrderDetailForAdministrator(req, res) {
        const { order_id } = req.params;
        const result = await getOrderDetailService(order_id);
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
        const {id} = req.body;
        const result = await cancelOrderService(id);
        res.status(result.status_code).json(result);
    }

    async respondListOrder(req, res) {
        const { orderIds } = req.body;
        const result = await respondListOrderService(orderIds);
        res.status(result.status_code).json(result);
    }

    async shippingOrder(req, res) {
        // const employee_id = req.user.id;
        const employee_id = ''
        const { orderId } = req.body;

        const result = await shippingOrderService(orderId);
        res.status(result.status_code).json(result);
    }
}

module.exports = new OrderController();
