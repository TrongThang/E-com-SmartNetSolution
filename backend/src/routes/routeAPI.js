const express = require('express');
const router = express.Router();

const authRouter = require('./auth_route');
const productRouter = require('./product_route');
const unitRouter = require('./unit_route');
const slideshowRouter = require('./slideshow_route');
const contactRouter = require('./contact_route');

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/unit', unitRouter)
router.use('/slideshow', slideshowRouter)
router.use('/contact', contactRouter)

module.exports = router