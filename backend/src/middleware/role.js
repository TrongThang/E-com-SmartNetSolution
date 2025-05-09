import { get_user_from_token } from '../helpers/token';

// const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const {prisma} = require('../config/database');
const { STATUS_CODE, ERROR_CODES, ERROR_MESSAGES } = require('../docs/contants');
const { get_error_response } = require('../helpers/response.helper');

const requireRoles = (role_required) => async (req, res, next) => {
    const account = await get_user_from_token(req, res);
    if (!account) {
        return get_error_response(ERROR_CODES.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }
    if (account.report <= 0) {
        return get_error_response(ERROR_CODES.ACCOUNT.BLOCKED, STATUS_CODE.FORBIDDEN);
    }
    if (role_required.includes(account.role)) {
        return get_error_response(ERROR_CODES.ACCOUNT.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    req.account = account;
    next();
}

export { requireRoles };