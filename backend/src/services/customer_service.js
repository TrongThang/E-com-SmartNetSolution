const { PrismaClient } = require('@prisma/client');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response');
const { executeSelectData } = require('../helpers/sql_query');
const { generateCustomerId } = require('../helpers/generate.helper');

const prisma = new PrismaClient();

async function getCustomersService(filter, limit, sort, order) {
    try {
        let get_attr = `surname, lastname, phone, email, gender, birthdate, created_at, updated_at, deleted_at`
        
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
        const customer = await prisma.customer.findUnique({
            where: { id }
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

async function createCustomerService({ surname, lastname, phone, email, gender, birthdate }) {
    try {
        const id = generateCustomerId();
        
        // Chuyển đổi gender thành boolean hoặc null
        const genderValue = gender === undefined ? null : (gender === "true" || gender === true);

        const customer = await prisma.customer.create({
            data: {
                id: id,
                surname: surname,
                lastname: lastname,
                phone: phone || null,
                email: email || null,
                gender: genderValue,
                birthdate: birthdate ? new Date(birthdate) : null,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
                email_verified: false
            }
        });

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

async function updateCustomerService({ id, surname, lastname, phone, email, gender, birthdate }) {
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
                phone: phone || null,
                email: email || null,
                gender: genderValue,
                birthdate: birthdate ? new Date(birthdate) : null,
                updated_at: new Date()
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