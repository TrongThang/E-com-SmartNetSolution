const { PrismaClient } = require('@prisma/client');
const { get_error_response } = require('../helpers/response');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { executeSelectData } = require('../helpers/sql_query');
const { convertToSlug } = require('../helpers/extension.helper');

const prisma = new PrismaClient();

const getCategoriesService = async (filter, limit, sort, order) => {
    let get_attr = `categories.name, categories.slug, categories.description, 
    categories.image, categories.is_hide`
    let get_table = `categories`

    try {
        const categories = await executeSelectData({
            table: get_table,
            strGetColumn: get_attr,
            limit: limit,
            filter: filter,
            sort: sort,
            order: order
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            categories
        );
    } catch (error) {
        console.error('Error in getCategoriesService:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const getCategoriesDetailService = async (id) => {
    let get_attr = `categories.name, categories.slug, categories.description, 
    categories.image, categories.is_hide`
    let get_table = `categories`

    let filter = JSON.stringify([
        {
            field: "categories.id",
            condition: "contains",
            value: id
        }
    ])
    try {
        const categories = await executeSelectData({
            table: get_table,
            strGetColumn: get_attr,
            filter: filter,
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            categories
        );
    } catch (error) {
        console.error('Error in getCategoriesDetailService:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const createCategoriesService = async ({ name, description, image, is_hide, attribute }) => {
    try {
        const slug = convertToSlug(name);
        const categories = await prisma.categories.create({
            data: {
                name,
                slug,
                description,
                image,
                is_hide,
            }
        });

        const attr_categories = await prisma.attribute_category.createMany({
            data: {
                attribute_id: attribute.id,
                category_id: categories.id,
            }
        });

        const data_response = {
            ...categories,
            attribute: attr_categories
        }

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            data_response
        );
    } catch (error) {
        console.error('Error in createCategoriesService:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    getCategoriesService,
    getCategoriesDetailService,
    createCategoriesService
};

