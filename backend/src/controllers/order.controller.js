const { getOrdersForAdministrator, getOrdersForCustomer, createOrder, cancelOrderService, getOrderDetailService, respondListOrderService, getOrderForWarehouseEmployee, StartShippingOrderService, confirmShippingOrderService, assignShipperToOrders, confirmFinishedOrderService} = require("../services/order.service");

class OrderController {
    async getOrdersForWarehouseEmployee(req, res) {
        const { filter, logic, limit, sort, order } = req.query;
        const result = await getOrderForWarehouseEmployee(filter, logic, limit, sort, order);
        res.status(result.status_code).json(result);
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
        const response = res.status(result.status_code).json(result);
        return response;
    }

    async canceledOrder(req, res) {
        const { order_id } = req.body;  
        const result = await cancelOrderService(order_id);
        res.status(result.status_code).json(result);
    }

    async respondListOrder(req, res) {
        const { orderIds } = req.body;
        const result = await respondListOrderService(orderIds);
        res.status(result.status_code).json(result);
    }

    async shippingOrder(req, res) {
        const account_id = req.user.userId;
        const { order_id } = req.body;

        const result = await StartShippingOrderService(order_id, account_id);
        res.status(result.status_code).json(result);
    }

    async confirmShippingOrder(req, res) {
        const { order_id, image_proof } = req.body;
        const result = await confirmShippingOrderService(order_id);
        res.status(result.status_code).json(result);
    }
    
    async assignShipperToOrders(req, res) {
        const { orderIds, employeeId } = req.body;
        const result = await assignShipperToOrders(orderIds, employeeId);
        res.status(result.status_code).json(result);
    }

    async confirmFinishedOrder(req, res) {
        const { order_id, customer_id } = req.body;
        console.log('order_id', order_id);
        console.log('customer_id', customer_id);
        const result = await confirmFinishedOrderService(order_id, customer_id);
        res.status(result.status_code).json(result);
    }
}

module.exports = new OrderController();
