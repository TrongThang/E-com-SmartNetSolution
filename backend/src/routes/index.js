const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const productRouter = require('./product.route');
const unitRouter = require('./unit.route');
const slideshowRouter = require('./slideshow.route');
const contactRouter = require('./contact.route');
const warrentyTimeRouter = require('./warrentyTime.route');
const warehouseRouter = require('./warehouse.route');
const reviewRouter = require('./review.route');
const addressBookRouter = require('./address_book.route');
const likeRouter = require('./liked.route');
const blogRouter = require('./blog.route');
const customerRouter = require('./customer.route');
const categoriesRouter = require('./categories.route');
const attributeGroupRouter = require('./attribute_group.route')
const employeeRouter = require('./employee.route');
const roleRouter = require('./role.route');
const orderRouter = require('./order.route');
const exportWarehouseRouter = require('./export.warehouse.route');
const importWarehouseRouter = require('./import.warehouse.route');
const socketQRRouter = require('./socketQR.route');
const cartRouter = require('./cart.route');

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/cart', cartRouter)
router.use('/review', reviewRouter)
router.use('/unit', unitRouter)
router.use('/slideshow', slideshowRouter)
router.use('/contact', contactRouter)
router.use('/warrenty-time', warrentyTimeRouter)
router.use('/warehouse', warehouseRouter)
router.use('/address-book', addressBookRouter)
router.use('/liked', likeRouter)
router.use('/blog', blogRouter)
router.use('/customer', customerRouter)
router.use('/categories', categoriesRouter)
router.use('/attribute_group', attributeGroupRouter)
router.use('/employee', employeeRouter)
router.use('/role', roleRouter)
router.use('/order', orderRouter)
router.use('/export-warehouse', exportWarehouseRouter)
router.use('/import-warehouse', importWarehouseRouter)
router.use('/socket-qr', socketQRRouter)

module.exports = router