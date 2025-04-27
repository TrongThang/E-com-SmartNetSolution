const express = require('express');
const { getSlideshow, getSlideshowDetail, createSlideshow, updateSlideshow, deleteSlideshow } = require('../controllers/slideshow.controller');
const { validateMiddleware } = require('../middleware/validate.middleware');
const { CreateSlideshowSchema, UpdateSlideshowSchema, DeleteSlideshowSchema } = require('../schemas/slideshow.schema');
const slideshowRouter = express.Router();

const asyncHandler = fn => (req, res, next) => fn(req, res, next).catch(next);

slideshowRouter.get('/', asyncHandler(getSlideshow)); // GET all slideshow
slideshowRouter.get('/:id', asyncHandler(getSlideshowDetail));
slideshowRouter.post('/', validateMiddleware(CreateSlideshowSchema), asyncHandler(createSlideshow));
slideshowRouter.put('/', validateMiddleware(UpdateSlideshowSchema), asyncHandler(updateSlideshow));
slideshowRouter.delete('/:id', validateMiddleware(DeleteSlideshowSchema), asyncHandler(deleteSlideshow));

module.exports = slideshowRouter;