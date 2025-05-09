const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { CreateCustomerSchema, UpdateCustomerSchema, DeleteCustomerSchema } = require('../schemas/customer.schema');
const { getCustomers, getCustomerDetail, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customer.controller');
const customerRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

customerRouter.get('/', asyncHandler(getCustomers));
customerRouter.get('/:id', asyncHandler(getCustomerDetail));
customerRouter.post('/', validateMiddleware(CreateCustomerSchema), asyncHandler(createCustomer));
customerRouter.put('/', validateMiddleware(UpdateCustomerSchema), asyncHandler(updateCustomer));
customerRouter.delete('/:id', validateMiddleware(DeleteCustomerSchema), asyncHandler(deleteCustomer));

module.exports = customerRouter;



