const { get_error_response } = require('../helpers/response.helper');
const { executeSelectData } = require('../helpers/sql_query');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { getVietnamTimeNow, formatDateToDDMMYYYY } = require('../helpers/time.helper');
const { PrismaClient } = require('@prisma/client');
const { generateEmployeeId, generateAccountId } = require('../helpers/generate.helper');
const { hashPassword } = require('../helpers/auth.helper');

const prisma = new PrismaClient();

const getEmployeeService = async (filter, limit, sort, order) => {
    try {
        let get_attr = `employee.surname, employee.lastname, employee.image, employee.birthdate, employee.gender, employee.email, employee.phone, 
    employee.status, role.name as role_name, employee.created_at, employee.updated_at`;
        let get_table = "employee";
        let query_join = `LEFT JOIN account ON employee.id = account.employee_id
        LEFT JOIN role ON account.role_id = role.id`;

        const filter = JSON.stringify([
            {
                field: "employee.deleted_at",
                condition: "is",
                value: null
            }
        ]);

        const result = await executeSelectData({
            strGetColumn: get_attr,
            table: get_table,
            queryJoin: query_join,
            filter: filter,
            limit: limit,
            sort: sort,
            order: order
        })
        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            result,
        );
    } catch (error) {
        console.error('Error in getEmployeeService:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
        );
    }
}
const getEmployeeDetailService = async (id) => {
    try {

        const employee = await prisma.employee.findUnique({
            where: { id: id }
        });
        if (!employee) {
            return get_error_response(
                ERROR_CODES.EMPLOYEE_NOT_FOUND,
                STATUS_CODE.NOT_FOUND,
            );
        }

        let get_attr = `employee.surname, employee.lastname, employee.image, 
        employee.birthdate, employee.gender, employee.email, employee.phone, 
        employee.status, role.name as role_name, employee.created_at, employee.updated_at`;
        let get_table = "employee";
        let query_join = `LEFT JOIN account ON employee.id = account.employee_id
        LEFT JOIN role ON account.role_id = role.id`;

        const filter = JSON.stringify([
            {
                field: "employee.id",
                condition: "=",
                value: id
            }
        ]);
        const result = await executeSelectData({
            strGetColumn: get_attr,
            table: get_table,
            queryJoin: query_join,
            filter: filter,
        })
        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            result,
        );

    } catch (error) {
        console.error('Error in getEmployeeDetailService:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
        );
    }
}
const createEmployeeService = async (surname, lastname, image, birthdate, gender, email, phone, status, username, role) => {
    try {
        // Kiểm tra email có tồn tại hay không
        const emailExists = await prisma.employee.findFirst({
            where: { email: email },
        });
        if (emailExists) {
            return get_error_response(
                ERROR_CODES.EMPLOYEE_EMAIL_ALREADY_EXISTS,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        // Kiểm tra số điện thoại có tồn tại hay không
        const phoneExists = await prisma.employee.findFirst({
            where: { phone: phone },
        });
        if (phoneExists) {
            return get_error_response(
                ERROR_CODES.EMPLOYEE_PHONE_EXISTED,
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

        const employee_id = generateEmployeeId();
        // Tạo nhân viên
        const employee = await prisma.employee.create({
            data: {
                id: employee_id,
                surname,
                lastname,
                image,
                birthdate: new Date(birthdate),
                gender, // 1 là nam, 0 là nữ
                email,
                phone,
                status, // 1 là hoạt động, 0 là không hoạt động
                created_at: getVietnamTimeNow(),
            }
        });

        if (employee) {
            const account_id = generateAccountId();
            const hashedPassword = await hashPassword("91092004"); // Mật khẩu mặc định cho tài khoản mới

            // Tạo tài khoản cho nhân viên
            const accountEmployee = await prisma.account.create({
                data: {
                    account_id: account_id,
                    username: username,
                    password: hashedPassword,
                    role: {
                        connect: { id: role } // Kết nối tài khoản với role
                    },
                    employee: {
                        connect: { id: employee.id } // Kết nối tài khoản với nhân viên
                    },
                    status: 1, // 1 là hoạt động, 0 là không hoạt động
                    is_new: true, // true là tài khoản mới, false là tài khoản cũ
                    is_locked: false, // false là chưa bị khóa, true là đã bị khóa
                    created_at: getVietnamTimeNow()
                }
            });

            // Trả về thông tin nhân viên và tài khoản
            return get_error_response(
                ERROR_CODES.SUCCESS,
                STATUS_CODE.OK,
                {
                    employee, // Thông tin nhân viên
                    account: accountEmployee // Thông tin tài khoản
                }
            );
        }
        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            employee
        );
    } catch (error) {
        console.error('Error in createEmployeeService:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
        );
    }
};
const updateEmployeeService = async (id, surname, lastname, image, birthdate, gender, email, phone, status, role) => {
    try {
        // Kiểm tra email có tồn tại hay không
        const emailExists = await prisma.employee.findFirst({
            where: { email: email },
        });
        if (emailExists) {
            return get_error_response(
                ERROR_CODES.EMPLOYEE_EMAIL_ALREADY_EXISTS,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        // Kiểm tra số điện thoại có tồn tại hay không
        const phoneExists = await prisma.employee.findFirst({
            where: { phone: phone },
        });
        if (phoneExists) {
            return get_error_response(
                ERROR_CODES.EMPLOYEE_PHONE_EXISTED,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        const employee = await prisma.employee.findFirst({
            where: { id: id }
        });
        if (!employee) {
            return get_error_response(
                ERROR_CODES.EMPLOYEE_NOT_FOUND,
                STATUS_CODE.NOT_FOUND,
            );
        }

        const updatedEmployee = await prisma.employee.update({
            where: { id: id },
            data: {
                surname,
                lastname,
                image,
                birthdate: new Date(birthdate),
                gender, // 1 là nam, 0 là nữ
                email, // email riêng
                phone,
                status, // 1 là hoạt động, 0 là không hoạt động
                updated_at: getVietnamTimeNow(),
            }
        });
        if (updatedEmployee) {
            const account = await prisma.account.findFirst({
                where: { employee_id: id }
            });
            if (!account) {
                return get_error_response(
                    ERROR_CODES.ACCOUNT_NOT_FOUND,
                    STATUS_CODE.NOT_FOUND,
                );
            }
            const role_id = await prisma.role.findFirst({
                where: { id: role }
            });
            if (!role_id) {
                return get_error_response(
                    ERROR_CODES.ROLE_NOT_FOUND,
                    STATUS_CODE.NOT_FOUND,
                );
            }
            const accountEmployee = await prisma.account.update({
                where: { account_id: account.account_id },
                data: {
                    role: {
                        connect: { id: role } // Kết nối tài khoản với role
                    },
                    status: status, // 1 là hoạt động, 0 là không hoạt động
                    updated_at: getVietnamTimeNow()
                }
            });
            return get_error_response(
                ERROR_CODES.SUCCESS,
                STATUS_CODE.OK,
                {
                    employee: updatedEmployee, // Thông tin nhân viên
                    account: accountEmployee // Thông tin tài khoản
                }
            );
        }

    } catch (error) {
        console.error('Error in updateEmployeeService:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
        );
    }
}
const updateProfileEmployeeService = async (id, surname, lastname, image, birthdate, gender, email, phone) => {
    try {

        // Kiểm tra email có tồn tại hay không
        const emailExists = await prisma.employee.findFirst({
            where: { email: email },
        });
        if (emailExists) {
            return get_error_response(
                ERROR_CODES.EMPLOYEE_EMAIL_ALREADY_EXISTS,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        // Kiểm tra số điện thoại có tồn tại hay không
        const phoneExists = await prisma.employee.findFirst({
            where: { phone: phone },
        });
        if (phoneExists) {
            return get_error_response(
                ERROR_CODES.EMPLOYEE_PHONE_EXISTED,
                STATUS_CODE.BAD_REQUEST,
            );
        }
        const employee = await prisma.employee.findFirst({
            where: { id: id }
        });
        if (!employee) {
            return get_error_response(
                ERROR_CODES.EMPLOYEE_NOT_FOUND,
                STATUS_CODE.NOT_FOUND,
            );
        }
        const updatedEmployee = await prisma.employee.update({
            where: { id: id },
            data: {
                surname,
                lastname,
                image,
                birthdate: new Date(birthdate),
                email, // email riêng
                gender, // 1 là nam, 0 là nữ
                phone,
                // status, // 1 là hoạt động, 0 là không hoạt động
            }
        });
        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            updatedEmployee
        );
    } catch (error) {
        console.error('Error in updateEmployeeService:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
        );
    }
}
const toggleDeleteRestoreEmployeeService = async (id, isRestore = false) => {
    try {
        const employee = await prisma.employee.findFirst({
            where: { id: id }
        });

        if (!employee) {
            return get_error_response(
                ERROR_CODES.EMPLOYEE_NOT_FOUND,
                STATUS_CODE.NOT_FOUND,
            );
        }

        const message = isRestore ? "Khôi phục nhân viên thành công" : "Xóa nhân viên thành công";
        let updatedEmployee;

        if (isRestore) {
            // isRestore = true, xóa giá trị deleted_at để khôi phục
            updatedEmployee = await prisma.employee.update({
                where: { id: id },
                data: {
                    deleted_at: null,
                    updated_at: getVietnamTimeNow(),
                },
            });

            await prisma.account.updateMany({
                where: { employee_id: id },
                data: {
                    is_locked: false,
                    updated_at: getVietnamTimeNow(),
                },
            });
        } else {
            // Xóa mềm
            updatedEmployee = await prisma.employee.update({
                where: { id: id },
                data: {
                    deleted_at: getVietnamTimeNow(),
                },
            });

            await prisma.account.updateMany({
                where: { employee_id: id },
                data: {
                    is_locked: true,
                },
            });
        }

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            message,
        );
    } catch (error) {
        console.error('Error in toggleDeleteRestoreEmployeeService:', error);
        return get_error_response(
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            error.message
        );
    }
};

module.exports = {
    getEmployeeService,
    getEmployeeDetailService,
    createEmployeeService,
    updateEmployeeService,
    updateProfileEmployeeService,
    toggleDeleteRestoreEmployeeService
}
