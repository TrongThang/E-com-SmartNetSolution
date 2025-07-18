const express = require('express');

const { validateMiddleware } = require('../middleware/validate.middleware');
const { getRole, getRoleDetail, 
    createRole, updateRole,
    toggleDeleteRestoreRole
} = require('../controllers/role.controller');
const { CreateRoleSchema, UpdateRoleSchema } = require('../schemas/role.schema');
const roleRouter = express.Router();


const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

roleRouter.get('/', asyncHandler(getRole));
roleRouter.get('/detail/:id', asyncHandler(getRoleDetail));
roleRouter.post('/', validateMiddleware(CreateRoleSchema) ,asyncHandler(createRole));
roleRouter.put('/:id',  validateMiddleware(UpdateRoleSchema),asyncHandler(updateRole));
roleRouter.delete('/:id',  asyncHandler(toggleDeleteRestoreRole));

module.exports = roleRouter;