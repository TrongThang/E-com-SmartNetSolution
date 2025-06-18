const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const employeeRouter = express.Router();
const { getEmployees, getEmployeeDetails,
    createEmployee, updateEmployee,
    updateProfileEmployee, toggleDeleteRestoreEmployee,
    getImportWarehouseNotFinishForEmployee
} = require('../controllers/employee.controller');
const { CreateEmployeeSchema, UpdateEmployeeSchema } = require('../schemas/employee.schema');
const authMiddleware = require('../middleware/auth.middleware');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}


employeeRouter.get('/', asyncHandler(getEmployees));
employeeRouter.get('/:id', asyncHandler(getEmployeeDetails));
employeeRouter.post('/', validateMiddleware(CreateEmployeeSchema), asyncHandler(createEmployee));
employeeRouter.put('/admin/:id', validateMiddleware(UpdateEmployeeSchema), asyncHandler(updateEmployee));
employeeRouter.put('/profile/:id', validateMiddleware(UpdateEmployeeSchema), asyncHandler(updateProfileEmployee));
employeeRouter.patch('/:id', asyncHandler(toggleDeleteRestoreEmployee));
employeeRouter.get('/invoice-not-finish',
    authMiddleware,
    asyncHandler(getImportWarehouseNotFinishForEmployee)
);

module.exports = employeeRouter;

