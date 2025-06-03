const express = require('express');
const { getCart, addToCart, updateQuantityCartItem, removeFromCart, confirmCart, updateCart, removeAllFromCart, removeSelected } = require('../controllers/cart.controller');
const { validateMiddleware } = require('../middleware/validate.middleware');
const cartRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

cartRouter.get('/customer/:customer_id',
    asyncHandler(getCart)
);

cartRouter.post('/',
    asyncHandler(addToCart)
);

cartRouter.put('/update-quantity',
    asyncHandler(updateQuantityCartItem)
);

cartRouter.delete('/customer/:customer_id/product/:product_id',
    asyncHandler(removeFromCart)
);

cartRouter.delete('/all/:customer_id',
    asyncHandler(removeAllFromCart)
);

cartRouter.delete('/selected/:customer_id',
    asyncHandler(removeSelected)
);

cartRouter.post('/confirm',
    asyncHandler(confirmCart)
);

cartRouter.put('/update',
    asyncHandler(updateCart)
);

module.exports = cartRouter;