const { getAddressBookService, getDetailAddressBookService, createAddressBookService, updateAddressBookService, deleteAddressBookService } = require('../services/address_book.service');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');

class AddressBookController {
    async getAddressBook(req, res) {
        const { customer_id } = req.params;

        const response = await getAddressBookService(customer_id);

        return res.status(response.status_code).json(response);
    };

    async getAddressBookDetail(req, res) {
        const { id } = req.params;

        const response = await getDetailAddressBookService(id);

        return res.status(response.status_code).json(response);
    }

    async createAddressBook(req, res) {
        const { customer_id, receiver_name, phone, district, city, ward, street, detail, is_default } = req.body;

        const response = await createAddressBookService(customer_id, receiver_name, phone, district, city, ward, street, detail, is_default);

        return res.status(response.status_code).json(response);
    };

    async updateAddressBook(req, res) {
        const { customer_id, id, receiver_name, phone, district, city, ward, street, detail, is_default } = req.body;

        const response = await updateAddressBookService(customer_id, id, receiver_name, phone, district, city, ward, street, detail, is_default);

        return res.status(response.status_code).json(response);
    }

    async deleteAddressBook(req, res) {
        const { customer_id, id } = req.params;

        const response = await deleteAddressBookService(customer_id, id);

        return res.status(response.status_code).json(response);
    };
}

module.exports = new AddressBookController();
