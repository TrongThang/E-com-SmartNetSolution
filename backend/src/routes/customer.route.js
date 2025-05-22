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

customerRouter.get('/admin', asyncHandler(getCustomers));
customerRouter.get('/:id', asyncHandler(getCustomerDetail));
customerRouter.post('/admin', validateMiddleware(CreateCustomerSchema), asyncHandler(createCustomer));
customerRouter.put('/admin', validateMiddleware(UpdateCustomerSchema), asyncHandler(updateCustomer));
customerRouter.put('/', validateMiddleware(UpdateCustomerSchema), asyncHandler(updateCustomer));
customerRouter.delete('/admin/:id', validateMiddleware(DeleteCustomerSchema), asyncHandler(deleteCustomer));

module.exports = customerRouter;



