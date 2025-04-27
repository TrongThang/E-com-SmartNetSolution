const express = require('express');
const { getAddressBook, createAddressBook, updateAddressBook, deleteAddressBook } = require('../controllers/address_book.controller');
const addressBookRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

addressBookRouter.get('/:customer_id', asyncHandler(getAddressBook));
addressBookRouter.post('/', asyncHandler(createAddressBook));
addressBookRouter.put('/', asyncHandler(updateAddressBook));
addressBookRouter.delete('/:customer_id/:id', asyncHandler(deleteAddressBook));

module.exports = addressBookRouter;
