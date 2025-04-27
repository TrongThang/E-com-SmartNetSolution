const express = require('express');
const router = express.Router();

const authRouter = require('./auth_route');
const productRouter = require('./product_route');
const unitRouter = require('./unit_route');
const slideshowRouter = require('./slideshow_route');

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/unit', unitRouter)
router.use('/slideshow', slideshowRouter)

module.exports = router