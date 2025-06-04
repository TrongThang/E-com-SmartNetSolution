const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getPermissionRole, modifyPermissionForRole, getRole } = require('../controllers/permission_role.controller');
const permissionRoleRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

permissionRoleRouter.get(
    '/role',
    asyncHandler(getRole)
);

permissionRoleRouter.get(
    '/role/detail',
    asyncHandler(getPermissionRole)
);

permissionRoleRouter.patch(
    '/modify-permission',
    asyncHandler(modifyPermissionForRole)
);

module.exports = permissionRoleRouter;