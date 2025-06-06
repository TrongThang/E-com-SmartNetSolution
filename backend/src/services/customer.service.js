const { PrismaClient } = require('@prisma/client');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const { executeSelectData } = require('../helpers/sql_query');
const { generateCustomerId, generateAccountId } = require('../helpers/generate.helper');
const { getVietnamTimeNow } = require('../helpers/time.helper');
const { hashPassword } = require('../helpers/auth.helper');

const prisma = new PrismaClient();

async function getCustomersService(filter, limit, sort, order) {
    try {
        let get_attr = `surname, lastname, image, phone, email, gender, birthdate, email_verified, created_at, updated_at, deleted_at`
        
        let get_table = `customer`

        const result = await executeSelectData({ 
            table: get_table, 
            strGetColumn: get_attr, 
            limit: limit, 
            filter: filter, 
            sort: sort, 
            order: order 
        });

        if (result && result.data) {
            // Chuyển đổi kết quả để thêm tên đầy đủ
            const transformedCustomers = result.data.map(customer => ({
                ...customer,
                fullname: customer.surname && customer.lastname 
                    ? `${customer.surname} ${customer.lastname}`
                    : null
            }));

            return get_error_response(
                errors=ERROR_CODES.SUCCESS,
                status_code=STATUS_CODE.OK,
                data=transformedCustomers
            );
        }

        return get_error_response(
            errors=ERROR_CODES.SUCCESS,
            status_code=STATUS_CODE.OK,
            data=[]
        );
    } catch (error) {
        console.error('Lỗi trong getCustomersService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

async function getCustomerDetailService(id) {
    try {
        const customer = await prisma.customer.findFirst({
            where: { id },
            include: {
                account: {
                    select: {
                        account_id: true,
                        username: true,
                        status: true
                    }
                }
            }
        });

        if (!customer) {
            return get_error_response(
                errors=ERROR_CODES.CUSTOMER_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        // Thêm fullname vào kết quả
        const customerWithFullname = {
            ...customer,
            fullname: customer.surname && customer.lastname 
                ? `${customer.surname} ${customer.lastname}`
                : null
        };

        return get_error_response(
            errors=ERROR_CODES.SUCCESS,
            status_code=STATUS_CODE.OK,
            data=customerWithFullname
        );
    } catch (error) {
        console.error('Error in getCustomerDetailService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

async function createCustomerService({ surname, lastname, image, phone, email, gender, birthdate, username, status }) {
    try {
        const id = generateCustomerId();

        const emailExists = await prisma.customer.findFirst({
            where: { email: email },
        });
        if (emailExists) {
            return get_error_response(
                ERROR_CODES.CUSTOMER_EMAIL_EXISTED,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        // Kiểm tra số điện thoại có tồn tại hay không
        const phoneExists = await prisma.customer.findFirst({
            where: { phone: phone },
        });
        if (phoneExists) {
            return get_error_response(
                ERROR_CODES.CUSTOMER_PHONE_EXISTED,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        // Kiểm tra username có tồn tại hay không
        const usernameExists = await prisma.account.findFirst({
            where: { username: username },
        });
        if (usernameExists) {
            return get_error_response(
                ERROR_CODES.ACCOUNT_USERNAME_ALREADY_EXISTS,
                STATUS_CODE.BAD_REQUEST,
            );
        }
        
        // Chuyển đổi gender thành boolean hoặc null
        const genderValue = gender === undefined ? null : (gender === "true" || gender === true);
        
        const customer = await prisma.customer.create({
            data: {
                id: id,
                surname: surname,
                lastname: lastname,
                image: image || null,
                phone: phone || null,
                email: email || null,
                gender: genderValue,
                birthdate: birthdate ? new Date(birthdate) : null,
                created_at: getVietnamTimeNow(),
                updated_at: getVietnamTimeNow(),
                email_verified: false
            }
        });
        
        if (customer) {
            const account_id = generateAccountId();
            const hashedPassword = await hashPassword("91092004"); // Mật khẩu mặc định cho tài khoản mới

            // Tạo tài khoản cho khách hàng mới
            const accountCustomer = await prisma.account.create({
                data: {
                    account_id: account_id,
                    username: username,
                    password: hashedPassword,
                    role: {
                        connect: { id: 2 } // Kết nối tài khoản với role
                    },
                    customer: {
                        connect: { id: customer.id } // Kết nối tài khoản với khách hàng
                    },
                    status: Number(status), // 1 là hoạt động, 0 là không hoạt động
                    is_new: true, // true là tài khoản mới, false là tài khoản cũ
                    is_locked: false, // false là chưa bị khóa, true là đã bị khóa
                    created_at: getVietnamTimeNow()
                }
            });

            // Trả về thông tin khách hàng và tài khoản
            return get_error_response(
                ERROR_CODES.SUCCESS,
                STATUS_CODE.OK,
                {
                    customer, // Thông tin khách hàng
                    account: accountCustomer // Thông tin tài khoản
                }
            );
        }

        return get_error_response(
            errors=ERROR_CODES.SUCCESS,
            status_code=STATUS_CODE.OK,
            data=customer
        );
    } catch (error) {
        console.error('Error in createCustomerService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

async function updateCustomerService({ id, account_id, surname, lastname, image, phone, email, gender, birthdate, status }) {
    try {
        // Kiểm tra customer có tồn tại không
        const existingCustomer = await prisma.customer.findUnique({
            where: { id }
        });

        if (!existingCustomer) {
            return get_error_response(
                errors=ERROR_CODES.CUSTOMER_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        // Chuyển đổi gender thành boolean hoặc null
        const genderValue = gender === undefined ? null : (gender === "true" || gender === true);

        // Cập nhật thông tin khách hàng
        const updatedCustomer = await prisma.customer.update({
            where: { id },
            data: {
                surname,
                lastname,
                image: image || null,
                phone: phone || null,
                email: email || null,
                gender: genderValue,
                birthdate: birthdate ? new Date(birthdate) : null,
                updated_at: new Date(),
                account: {
                    updateMany: {
                        where: { account_id: account_id },
                        data: {
                          status: 0
                        }
                      }
                  }
            }
        });

        return get_error_response(
            errors=ERROR_CODES.SUCCESS,
            status_code=STATUS_CODE.OK,
            data=updatedCustomer
        );
    } catch (error) {
        console.error('Error in updateCustomerService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

async function deleteCustomerService(id) {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id }
        });

        if (!customer) {
            return get_error_response(
                errors=ERROR_CODES.CUSTOMER_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        // Xóa mềm khách hàng
        await prisma.customer.update({
            where: { id },
            data: {
                deleted_at: new Date()
            }
        });

        return get_error_response(
            errors=ERROR_CODES.SUCCESS,
            status_code=STATUS_CODE.OK
        );
    } catch (error) {
        console.error('Error in deleteCustomerService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    getCustomersService,
    getCustomerDetailService,
    createCustomerService,
    updateCustomerService,
    deleteCustomerService
}; 