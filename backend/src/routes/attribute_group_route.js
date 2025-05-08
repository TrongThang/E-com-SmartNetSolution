const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { getAttributeGroups,
    getAttributeGroupDetails,
    createAttributeGroup,
    updateAttributeGroup,
    toggleDeleteRestoreAttributeGroup,
    restoreAttributeGroup
} = require('../controllers/attribute_groupController');
const { CreateAttributeGroupSchema, UpdateAttributeGroupSchema } = require('../schemas/groupAttribute.schema');

const attributeGroupRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

// GET all attribute groups
attributeGroupRouter.get('/', asyncHandler(getAttributeGroups));
attributeGroupRouter.get('/:id', asyncHandler(getAttributeGroupDetails));
attributeGroupRouter.post('/', validateMiddleware(CreateAttributeGroupSchema), asyncHandler(createAttributeGroup));
attributeGroupRouter.put('/:id', validateMiddleware(UpdateAttributeGroupSchema), asyncHandler(updateAttributeGroup));
attributeGroupRouter.patch('/:id', asyncHandler(toggleDeleteRestoreAttributeGroup));
module.exports = attributeGroupRouter;