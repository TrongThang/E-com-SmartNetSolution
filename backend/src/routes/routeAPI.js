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
const addressBookRouter = require('./address_book_route');
const likeRouter = require('./liked_route');
const blogRouter = require('./blog_route');
const customerRouter = require('./customer_route');
const categoriesRouter = require('./categories_route');
const attributeGroupRouter = require('./attribute_group_route')
const employeeRouter = require('./employee_route');
const roleRouter = require('./role_route');

router.use('/auth', authRouter)
router.use('/product', productRouter)
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

module.exports = router