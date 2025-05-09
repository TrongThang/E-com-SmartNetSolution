const {
    getContactService,
    getContactDetailService,
    createContactService,
    updateContactStatusService,
    deleteContactService
} = require('../services/contact_service');

class ContactController {
    async getContact(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};
        const response = await getContactService(filter, limit, sort, order);
        return res.status(response.status_code).json(response);
    }

    async getContactDetail(req, res) {
        const { id } = req.params;
        const response = await getContactDetailService(id);
        return res.status(response.status_code).json(response);
    }

    async createContact(req, res) {
        const { fullname, title, content, email } = req.body;
        const response = await createContactService({ fullname, title, content, email });
        return res.status(response.status_code).json(response);
    }

    async updateContactStatus(req, res) {
        const { id, status } = req.body;
        const response = await updateContactStatusService({ id: Number(id), status });
        return res.status(response.status_code).json(response);
    }

    async deleteContact(req, res) {
        const { id } = req.params;
        const response = await deleteContactService(Number(id));
        return res.status(response.status_code).json(response);
    }
}

module.exports = new ContactController();