const express = require('express');
const router = express.Router();

const authRouter = require('./auth_route');
const productRouter = require('./product.route');
const reviewRouter = require('./review.route');

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/review', reviewRouter)

module.exports = router