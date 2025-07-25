const jwt = require('jsonwebtoken');
const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const { hashPassword, verifyPassword } = require('../helpers/auth.helper');
const { generateAccountId, generateCustomerId } = require('../helpers/generate.helper');
const { getVietnamTimeNow } = require('../helpers/time.helper');
const prisma = require('../config/database');

async function getUserAdminInfo(account_id) {
	const user = await prisma.account.findFirst({
		where: {
			account_id: account_id
		},
		include: {
			customer: true,
			employee: true
		}
	});

	return user;
}

async function loginAPI(username, password, remember_me = null) {
	try {

		const user = await prisma.account.findFirst({
			where: {
				username: username,
				// report: { equals: 0 }
			}
		})
		if (!user) {
			return get_error_response(ERROR_CODES.ACCOUNT_INVALID, STATUS_CODE.BAD_REQUEST);
		}

		if (await verifyPassword(password, user.password) === false) {
			return get_error_response(ERROR_CODES.ACCOUNT_INVALID, STATUS_CODE.BAD_REQUEST);
		}

		infoUser = await prisma.customer.findFirst({
			where: {
				id: user.customer_id,
				deleted_at: null
			},
		})

		// Tạo token JWT khi đăng nhập thành công
		accessToken = jwt.sign(
			{
				userId: user.account_id,
				// account_id: user.account_id,
				username: user.username,
				customer_id: infoUser.id || undefined,
				name: infoUser.lastname + ' ' + infoUser.surname || undefined,
				role_id: user.role_id
			},
			process.env.JWT_SECRET,
			{ expiresIn: remember_me ? '30d' : '3h' }
		);

		console.log('accessToken', jwt.decode(accessToken));

		const response = {
			accessToken: accessToken,
			data: user
		};

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

async function loginEmployee({ username, password }) {
	const account = await prisma.account.findFirst({ where: { username: username, deleted_at: null } });
	if (!account) {
		return get_error_response(ERROR_CODES.ACCOUNT_INVALID, STATUS_CODE.BAD_REQUEST);
	}

	if (!account.password) {
		return get_error_response(ERROR_CODES.ACCOUNT_INVALID, STATUS_CODE.BAD_REQUEST);
	} else {
		const isPasswordValid = await verifyPassword(password, account.password);
		if (!isPasswordValid) {
			return get_error_response(ERROR_CODES.ACCOUNT_INVALID, STATUS_CODE.BAD_REQUEST);
		}
	}

	if (!account.employee_id) {
		return get_error_response(ERROR_CODES.ACCOUNT_INVALID, STATUS_CODE.BAD_REQUEST);
	}	

	const employee = await prisma.employee.findFirst(
		{ where: { id: account.employee_id, deleted_at: null } }
	);
	if (!employee) {
		return get_error_response(ERROR_CODES.ACCOUNT_INVALID, STATUS_CODE.BAD_REQUEST);
	}

	const accessToken = jwt.sign(
		{
			accountId: account.account_id,
			username: account.username,
			employee_id: employee.id,
			roleId: account.role_id || 'employee',
		},
		process.env.JWT_SECRET,
		{ expiresIn: '8h' }
	);

	const refreshToken = jwt.sign(
		{ employeeId: account.account_id, type: 'refresh' },
		process.env.JWT_SECRET,
		{ expiresIn: '8h' }
	);

	// Redis logic - có thể comment để disable
	// const previousAccessToken = await redisClient.get(`employee:token:${account.account_id}`);
	// const previousRefreshToken = await redisClient.get(`employee:refresh:${account.account_id}`);
	// if (previousAccessToken) {
	// 	await blacklistToken(previousAccessToken, 8 * 60 * 60);
	// }
	// if (previousRefreshToken) {
	// 	await blacklistToken(previousRefreshToken, 8 * 60 * 60);
	// }
	// await redisClient.setex(`employee:token:${account.account_id}`, 8 * 60 * 60, accessToken);
	// await redisClient.setex(`employee:refresh:${account.account_id}`, 8 * 60 * 60, refreshToken);

	return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, { accessToken, refreshToken });
}

const refreshTokenAPI = async (req, res) => {
	try {
		const { refresh_token } = req.body;

		const decoded = jwt.verify(refresh_token, process.env.REFRESH_SECRET_KEY || process.env.JWT_SECRET);
		const newAccessToken = jwt.sign(
			{
				user_id: decoded.user_id,
				username: decoded.username
			},
			process.env.JWT_SECRET,
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

/*
	Luồng chạy đổi mật khẩu
	Người dùng gửi yêu cầu đổi mật khẩu -> (username và email)
	Đưa vào hàm checkAccountEmail kiểm tra đúng hay không -> trả về thông tin account
	Nếu đúng -> gửi bắt đầu gửi OTP bằng account_id vừa nhận được khi call api check
	Người dùng nhập OTP vừa được gửi qua mail
	Call APi verify OTP
	Nếu đúng thì bắt đầu Đổi mật khẩu
*/
const ChangedPasswordAccountForgot = async (payload) => {
	const { email, newPassword, confirmPassword } = payload;

	if (newPassword !== confirmPassword) {
		return get_error_response(ERROR_CODES.ACCOUNT_PASSWORD_NOT_MATCH, STATUS_CODE.BAD_REQUEST);
	}

	const account = await prisma.account.findFirst({
		where: {
			customer: { email }
		},
		select: {
			account_id: true
		}
	});

	if (!account) {
		return get_error_response(ERROR_CODES.ACCOUNT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
	}

	const hashedPassword = await hashPassword(newPassword);

	await prisma.account.update({
		where: { account_id: account.account_id },
		data: { password: hashedPassword }
	});

	return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, null);
};

const ChangedPasswordAccount = async (payload, userId) => {
	
	const { password, newPassword, confirmPassword } = payload;

	const account = await prisma.account.findFirst({
		where: {
			account_id: userId
		}
	});

	if (!account) {
		return get_error_response(ERROR_CODES.ACCOUNT_INVALID, STATUS_CODE.NOT_FOUND);
	}

	console.log("Raw password:", password);
	console.log("Hashed password from DB:", account.password);

	if (await verifyPassword(password, account.password) === false) {
		return get_error_response(ERROR_CODES.ACCOUNT_INVALID, STATUS_CODE.BAD_REQUEST);
	}
	
	if (newPassword !== confirmPassword) {
		return get_error_response(ERROR_CODES.ACCOUNT_NEW_PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH, STATUS_CODE.BAD_REQUEST);
	}

	const hashedPassword = await hashPassword(newPassword);

	await prisma.account.update({
		where: { account_id: account.account_id },
		data: { password: hashedPassword, updated_at: getVietnamTimeNow() }
	});

	return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, null);
}

const getMe = async (token) => {
	try {
		console.log('token', token);
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await prisma.account.findFirst({
			where: {
				account_id: decoded.userId,
				deleted_at: null
			},
			include: {
				customer: {
					select: {
						id: true,
						lastname: true,
						surname: true,
						phone: true,
						email: true,
						gender: true,
						image: true,
					}
				}
			}
		})

		return get_error_response(
			ERROR_CODES.SUCCESS,
			STATUS_CODE.OK,
			user
		);
	} catch (error) {
		console.error(error);
		return get_error_response(
			ERROR_CODES.INTERNAL_SERVER_ERROR,
			STATUS_CODE.INTERNAL_SERVER_ERROR,
		);
	}
}

const getMeEmployee = async (token) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user_employee = await prisma.account.findFirst({
			where: {
				account_id: decoded.account_id,
				deleted_at: null
			},
			select: {
				account_id: true,
				username: true,
				employee: {
					select: {
						id: true,
						lastname: true,
						surname: true,
						phone: true,
						email: true,
						image: true,
					}
				},
				role: {
					select: {
						id: true,
						name: true
					}
				}
			}
		})

		if (!user_employee.employee.id) {
			return get_error_response(ERROR_CODES.ACCOUNT_INVALID, STATUS_CODE.BAD_REQUEST);
		}

		return get_error_response(
			ERROR_CODES.SUCCESS,
			STATUS_CODE.OK,
			user_employee
		);
	} catch (error) {
		console.error(error);
		return get_error_response(
			ERROR_CODES.INTERNAL_SERVER_ERROR,
			STATUS_CODE.INTERNAL_SERVER_ERROR,
		);
	}
}


module.exports = {
	loginAPI, register_service: register,
	refreshTokenAPI,
	ChangedPasswordAccountForgot,
	ChangedPasswordAccount,
	loginEmployee,
	getMe,
	getMeEmployee
}