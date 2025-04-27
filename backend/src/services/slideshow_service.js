const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response');
const { executeSelectData } = require('../helpers/sql_query');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSlideshowService = async (filter, limit, sort, order) => {
    let get_attr = ` slideshow.text_button, slideshow.link, slideshow.image, slideshow.status`;
    let get_table = `slideshow`;

    try {
        const slideshows = await executeSelectData({
            table: get_table,
            strGetColumn: get_attr,
            limit: limit,
            filter: filter,
            sort: sort,
            order: order
        });

        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, slideshows);
    } catch (error) {
        console.error('Error in getSlideshowService:', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

const getSlideshowDetailService = async (id) => {
    try {
        const filter = JSON.stringify([
            { field: "slideshow.id", condition: "=", value: Number(id) }
        ]);
        const slideshows = await executeSelectData({
            table: "slideshow",
            strGetColumn: "slideshow.id, slideshow.text_button, slideshow.link, slideshow.image, slideshow.status, slideshow.created_at, slideshow.updated_at",
            filter: filter,
            limit: 1
        });
        const data = slideshows?.data?.[0];
        if (!data) {
            return get_error_response(ERROR_CODES.SLIDESHOW_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, data);
    } catch (error) {
        console.error('Error in getSlideshowDetailService:', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

const createSlideshowService = async ({ text_button, link, image, status }) => {
    try {
        const slideshow = await prisma.slideshow.create({
            data: { text_button, link, image, status, created_at: new Date(), updated_at: new Date() }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.CREATED, slideshow);
    } catch (error) {
        console.error('Error in createSlideshowService:', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

const updateSlideshowService = async ({ id, text_button, link, image, status }) => {
    try {
        const slideshow = await prisma.slideshow.findUnique({ where: { id } });
        if (!slideshow || slideshow.deleted_at) {
            return get_error_response(ERROR_CODES.SLIDESHOW_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        const updated = await prisma.slideshow.update({
            where: { id },
            data: { text_button, link, image, status, updated_at: new Date() }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK, updated);
    } catch (error) {
        console.error('Error in updateSlideshowService:', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

const deleteSlideshowService = async (id) => {
    try {
        const slideshow = await prisma.slideshow.findUnique({ where: { id: Number(id) } });
        if (!slideshow || slideshow.deleted_at) {
            return get_error_response(ERROR_CODES.SLIDESHOW_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        await prisma.slideshow.update({
            where: { id: Number(id) },
            data: { deleted_at: new Date() }
        });
        return get_error_response(ERROR_CODES.SUCCESS, STATUS_CODE.OK);
    } catch (error) {
        console.error('Error in deleteSlideshowService:', error);
        return get_error_response(ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    getSlideshowService,
    getSlideshowDetailService,
    createSlideshowService,
    updateSlideshowService,
    deleteSlideshowService
};