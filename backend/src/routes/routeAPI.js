const express = require('express');
const router = express.Router();

const authRouter = require('./auth_route');
const productRouter = require('./product_route');
const unitRouter = require('./unit_route');

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/unit', unitRouter)

module.exports = router