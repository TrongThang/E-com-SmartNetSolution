const express = require('express');
const router = express.Router();

const authRouter = require('./auth_route');
const productRouter = require('./product_route');

router.use('/auth', authRouter)
router.use('/product', productRouter)

module.exports = router