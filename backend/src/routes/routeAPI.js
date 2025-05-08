const express = require('express');
const router = express.Router();

const authRouter = require('./auth_route');
const productRouter = require('./product.route');
const unitRouter = require('./unit_route');
const slideshowRouter = require('./slideshow_route');
const contactRouter = require('./contact_route');
const warrentyTimeRouter = require('./warrentyTime_route');
const warehouseRouter = require('./warehouse_route');
const reviewRouter = require('./review.route');

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/review', reviewRouter)
router.use('/unit', unitRouter)
router.use('/slideshow', slideshowRouter)
router.use('/contact', contactRouter)
router.use('/warrenty-time', warrentyTimeRouter)
router.use('/warehouse', warehouseRouter)

module.exports = router