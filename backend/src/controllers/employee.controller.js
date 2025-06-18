const { getEmployeeService, getEmployeeDetailService,
    createEmployeeService,
    updateEmployeeService,
    updateProfileEmployeeService,
    toggleDeleteRestoreEmployeeService,
} = require('../services/employee.service');
const { PrismaClient } = require('@prisma/client');
const { getImportWarehouseNotFinishForEmployee } = require('../services/import.warehouse.service');


class EmployeeController {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getEmployees(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};
        const response = await getEmployeeService(filter, limit, sort, order);
        return res.status(response.status_code).json(response);
    }
    async getEmployeeDetails(req, res) {
        const { id } = req.params;
        const response = await getEmployeeDetailService(id);
        return res.status(response.status_code).json(response);
    }
    async createEmployee(req, res) {
        const { surname, lastname, image, birthdate, gender, email, phone, status, username, role } = req.body || {};
        const response = await createEmployeeService(surname, lastname, image, birthdate, gender, email, phone, status, username, role);
        return res.status(response.status_code).json(response);
    }

    async updateEmployee(req, res) {
        const { id } = req.params;

        const { surname, lastname, image, birthdate, gender, email, phone, status, role } = req.body || {};
        const response = await updateEmployeeService(id, surname, lastname, image, birthdate, gender, email, phone, status, role);
        return res.status(response.status_code).json(response);
    }
    async updateProfileEmployee(req, res) {
        const { id } = req.params;
        const { surname, lastname, image, birthdate, gender, email, phone } = req.body || {};
        const response = await updateProfileEmployeeService(id, surname, lastname, image, birthdate, gender, email, phone);
        return res.status(response.status_code).json(response);
    }
    async toggleDeleteRestoreEmployee(req, res) {
        const { id } = req.params;
        const { isRestore } = req.body || {};
        const response = await toggleDeleteRestoreEmployeeService(id, isRestore);
        return res.status(response.status_code).json(response);
    }

    async getImportWarehouseNotFinishForEmployee(req, res) {
        const response = await getImportWarehouseNotFinishForEmployee(req.user.id);
        return res.status(response.status_code).json(response);
    }
}

module.exports = new EmployeeController();
