const express = require('express');
const contactRouter = express.Router();
const contactController = require('../controllers/contact.controller');
const { createContactSchema, updateContactSchema, deleteContactSchema } = require('../schemas/contact.schema');
const { validateMiddleware } = require('../middleware/validate.middleware');
const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

contactRouter.get('/', asyncHandler(contactController.getContact));
contactRouter.get('/:id', asyncHandler(contactController.getContactDetail)); 
contactRouter.post('/', validateMiddleware(createContactSchema), asyncHandler(contactController.createContact)); 
contactRouter.patch('/', validateMiddleware(updateContactSchema), asyncHandler(contactController.updateContactStatus));
contactRouter.delete('/:id', validateMiddleware(deleteContactSchema), asyncHandler(contactController.deleteContact)); 

module.exports = contactRouter;