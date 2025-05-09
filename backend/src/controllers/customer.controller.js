const {
    getCustomersService,
    getCustomerDetailService,
    createCustomerService,
    updateCustomerService,
    deleteCustomerService
} = require('../services/customer.service');

class CustomerController {
    async getCustomers(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};

        const response = await getCustomersService(filter, limit, sort, order);

        return res.status(response.status_code).json(response);
    }

    async getCustomerDetail(req, res) {
        const { id } = req.params;
        
        const response = await getCustomerDetailService(id);
        
        return res.status(response.status_code).json(response);
    }

    async createCustomer(req, res) {
        const { surname, lastname, image, phone, email, gender, birthdate } = req.body;

        const response = await createCustomerService({
            surname,
            lastname,
            image,
            phone,
            email,
            gender,
            birthdate
        });

        return res.status(response.status_code).json(response);
    }

    async updateCustomer(req, res) {
        const { id, surname, lastname, phone, email, gender, birthdate } = req.body;

        const response = await updateCustomerService({
            id,
            surname,
            lastname,
            phone,
            email,
            gender,
            birthdate
        });

        return res.status(response.status_code).json(response);
    }

    async deleteCustomer(req, res) {
        const { id } = req.params;

        const response = await deleteCustomerService(id);

        return res.status(response.status_code).json(response);
    }
}

module.exports = new CustomerController();
