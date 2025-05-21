const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getAddressBook, getAddressBookDetail, createAddressBook, updateAddressBook, deleteAddressBook } = require('../controllers/address_book.controller');
const { CreateAddressBookSchema, UpdateAddressBookSchema, DeleteAddressBookSchema } = require('../schemas/addressBook.schema');
const addressBookRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

addressBookRouter.get('/customer/:customer_id', asyncHandler(getAddressBook));
addressBookRouter.get('/detail/:id', asyncHandler(getAddressBookDetail));
addressBookRouter.post('/', validateMiddleware(CreateAddressBookSchema), asyncHandler(createAddressBook));
addressBookRouter.put('/', validateMiddleware(UpdateAddressBookSchema), asyncHandler(updateAddressBook));
addressBookRouter.delete('/:customer_id/:id', validateMiddleware(DeleteAddressBookSchema), asyncHandler(deleteAddressBook));

module.exports = addressBookRouter;
