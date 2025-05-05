const express = require('express');
const router = express.Router();

const authRouter = require('./auth_route');
const productRouter = require('./product_route');
const categoriesRouter = require('./categories_route');
const attributeGroupRouter = require('./attribute_group_route')
const employeeRouter = require('./employee_route');
const roleRouter = require('./role_route');

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/categories', categoriesRouter)
router.use('/attribute_group', attributeGroupRouter)
router.use('/employee', employeeRouter)
router.use('/role', roleRouter)

module.exports = router