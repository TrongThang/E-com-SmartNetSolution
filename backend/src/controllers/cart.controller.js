const {
    addToCart,
    updateQuantityCartItem,
    removeFromCart,
    removeAllFromCart,
    getCart,
    confirmCart,
    updateCart,
    removeSelected
} = require('../services/cart.service');

class CartController {
    async getCart(req, res) {
        const { customer_id } = req.params;
        
        const cart = await getCart(customer_id);

        return res.status(cart.status_code).json(cart);
    }

    async addToCart(req, res) {
        const { customer_id } = req.params;
        const { product_id, quantity } = req.body;

        const cart = await addToCart(customer_id, product_id, quantity);

        return res.status(cart.status_code).json(cart);
    }

    async updateQuantityCartItem(req, res) {
        const cart = await updateQuantityCartItem(req.body);

        return res.status(200).json(cart);
    }
    
    async removeFromCart(req, res) {
        const { customer_id, product_id } = req.params;
        const cart = await removeFromCart(customer_id, product_id);
        return res.status(200).json(cart);
    }
    
    async removeSelected(req, res) {
        const { customer_id } = req.params;
        const { items } = req.body;
        const cart = await removeSelected(customer_id, items);
        return res.status(200).json(cart);
    }

    async removeAllFromCart(req, res) {
        const { customer_id } = req.params;
        const cart = await removeAllFromCart(customer_id);
        return res.status(200).json(cart);
    }

    async confirmCart(req, res) {
        const { customer_id } = req.body;
        const cart = await confirmCart(customer_id);
        return res.status(200).json(cart);
    }

    async updateCart(req, res) {
        const { customer_id, items } = req.body;
        const cart = await updateCart(customer_id, items);
        return res.status(200).json(cart);
    }
}

module.exports = new CartController();
