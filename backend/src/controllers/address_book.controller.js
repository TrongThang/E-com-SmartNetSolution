const { PrismaClient } = require('@prisma/client');
const { getAddressBookService, createAddressBookService, updateAddressBookService, deleteAddressBookService } = require('../services/address_book_service');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { get_error_response } = require('../helpers/response');

class AddressBookController {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getAddressBook(req, res) {
        const { customer_id } = req.params;

        const response = await getAddressBookService(customer_id);

        return res.status(response.status_code).json(response);
    };

    async createAddressBook(req, res) {
        const { customer_id, district, city, ward, street, detail, is_default } = req.body;

        const response = await createAddressBookService(customer_id, district, city, ward, street, detail, is_default);

        return res.status(response.status_code).json(response);
    };

    async updateAddressBook(req, res) {
        const { customer_id, id, district, city, ward, street, detail, is_default } = req.body;

        const response = await updateAddressBookService(customer_id, id, district, city, ward, street, detail, is_default);
    }

    async deleteAddressBook(req, res) {
        const { customer_id, id } = req.params;

        const response = await deleteAddressBookService(customer_id, id);

        return res.status(response.status_code).json(response);
    };
}

module.exports = new AddressBookController();
