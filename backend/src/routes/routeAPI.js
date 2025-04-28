const express = require('express');
const router = express.Router();

const authRouter = require('./auth_route');
const productRouter = require('./product_route');
const addressBookRouter = require('./address_book_route');
const likeRouter = require('./liked_route');

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/address-book', addressBookRouter)
router.use('/liked', likeRouter)

module.exports = router