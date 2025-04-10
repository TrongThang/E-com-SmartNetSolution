const jwt = require('jsonwebtoken');
const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response');
const { PrismaClient, sql } = require('@prisma/client');
const { hashPassword } = require('../helpers/auth.helper');
const { generateAccountId, generateCustomerId } = require('../helpers/generate.helper')

const prisma = new PrismaClient();

async function loginAPI (username, password, type, remember_me = null) {
	try {
		include_clause = type === 'CUSTOMER' ? { customer: true } : { employee: true };
		console.log('chuẩn bị tìm kiếm:', username, password, type, remember_me);
		const user = await prisma.account.findFirst({
			where: {
				username: username,
				password: password,
				role_id: type,
				// report: { equals: 0 }
			},
			include: include_clause
		})
		console.log('User:', user);

		let token;
		if (user === null) {
			return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
		}

		// Tạo token JWT khi đăng nhập thành công
		accessToken = jwt.sign(
			{
				account_id: user.customer_id || user.employee_id,
				username: user.username,
				role_id: user.role_id
			},
			process.env.SECRET_KEY,
			{ expiresIn: '3h' }
		);

		const response = {
			accessToken: accessToken,
			data: user
		};

		if (type === 'CUSTOMER' && remember_me) {
			const refreshToken = jwt.sign(
				{
					user_id: user.customer_id,
					username: user.username
				},
				process.env.REFRESH_SECRET_KEY || process.env.SECRET_KEY,
				{ expiresIn: '30d' }
			);

			response.refreshToken = refreshToken;
		}

		return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, response);

	} catch (jwtError) {
		console.error('Login error:', jwtError);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            { message: 'Lỗi server', details: jwtError.message }
        );
	}
}

const refreshTokenAPI = async (req, res) => {
    try {
        const { refresh_token } = req.body;
        
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_SECRET_KEY || process.env.SECRET_KEY);
        const newAccessToken = jwt.sign(
            {
                user_id: decoded.user_id,
                username: decoded.username
            },
            process.env.SECRET_KEY,
            { expiresIn: '3h' }
        );
		
		response = {
			token: newAccessToken
		}

		return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, response);
    } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
			return res.status(401).json({
				success: false,
				message: 'Refresh token đã hết hạn',
				expiredAt: jwtError.expiredAt
			});
		} else if (jwtError.name === 'JsonWebTokenError') {
			return res.status(401).json({
				success: false,
				message: 'Refresh token không hợp lệ',
				details: jwtError.message
			});
		} else {
			throw new Error('Lỗi xác thực token: ' + jwtError.message);
		}
    }
};

const register = async ({ username, password, confirm_password, surname, lastname, phone, email, gender }) => {
	if (password !== confirm_password) {
		return get_error_response(ERROR_CODES.ACCOUNT_PASSWORD_NOT_MATCH, STATUS_CODE.BAD_REQUEST);
	}	

	const checkAccount = await prisma.account.findFirst({
		where: {
			username: username
		}
	});
	if (checkAccount) {
		return get_error_response(ERROR_CODES.ACCOUNT_USERNAME_EXIST, STATUS_CODE.BAD_REQUEST);
	}

	const checkCustomer = await prisma.customer.findFirst({
		where: {
			email: email
		}
	});
	if (checkCustomer) {
		return get_error_response(ERROR_CODES.CUSTOMER_EMAIL_EXISTED, STATUS_CODE.BAD_REQUEST);
	}

	const customer_id = generateCustomerId();
	console.log('Customer ID:', customer_id);
	const customer = await prisma.customer.create({
		data: {
			id: customer_id,
			surname: surname, lastname: lastname, phone: phone, email: email, gender: gender
		}
	})

	// Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
	const hashedPassword = await hashPassword(password);
	const accountId = generateAccountId();
	console.log('Account ID:', accountId);
	const account = await prisma.account.create({
		data: {
			account_id: accountId,
			username: username,
			password: hashedPassword,
			customer_id: customer.id
		}
	});

	return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, account);
}

module.exports = {
    loginAPI, register_service: register,
    refreshTokenAPI,
}