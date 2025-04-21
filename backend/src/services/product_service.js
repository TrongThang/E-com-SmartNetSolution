const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response');
const { PrismaClient, sql } = require('@prisma/client');
const { convertToSlug, removeTagHtml } = require('../helpers/extension.helper');

const prisma = new PrismaClient();

const checkBeforeProduct = async (category_id, unit_id, warrenty_time_id) => {
    const category = await prisma.category.findUnique({
        where: {
            id: category_id
        }
    })
    
    if (!category) {
        return get_error_response(
            ERROR_CODES.CATEGORY_NOT_FOUND,
            STATUS_CODE.BAD_REQUEST,
            null
        )
    }

    unit = await prisma.unit.findUnique({
        where: {
            id: unit_id
        }
    })

    if (!unit) {
        return get_error_response(
            ERROR_CODES.UNIT_NOT_FOUND,
            STATUS_CODE.BAD_REQUEST,
            null
        )
    }

    if (warrenty_time_id) {
        const warrenty_time = await prisma.warrenty_time.findUnique({
            where: {
                id: warrenty_time_id
            }
        })

        if (!warrenty_time) {
            return get_error_response(
                ERROR_CODES.WARRANTY_TIME_NOT_FOUND,
                STATUS_CODE.BAD_REQUEST,
                null
            )
        }
    }
}

async function createProductService({ name, description, image, selling_price, category_id, unit_id, warrenty_time_id, is_hide, status, attributes }) {
    const check_product = await checkBeforeProduct(category_id, unit_id, warrenty_time_id)
    if (check_product) {
        return check_product
    }

    // CHECK FILE IMAGE
    
    const description_normal = removeTagHtml(description);
    const slug = convertToSlug(name);

    const check_attr = await check_attributes(attributes, category_id)
    if (check_attr) {
        return check_attr
    }

    const product = await prisma.product.create({
        data: {
            name,
            slug,
            description,
            description_normal,
            image,
            selling_price,
            category_id,
            unit_id,
            warrenty_time_id,
            views: 0,
            is_hide,
            status
        }
    })

    const attr_product = await prisma.attribute_product.createMany({
        data: attributes.map((item) => {
            return {
                product_id: product.id,
                attribute_id: item.attribute.id,
                value: item.value
            }
        })
    })

    const data_response = {
        ...product,
        attributes: attr_product
    }
    return get_error_response(
        ERROR_CODES.SUCCESS,
        STATUS_CODE.OK,
        data_response
    )
}

async function updateProductService({ id, name, description, image, selling_price, category_id, unit_id, warrenty_time_id, is_hide, status }) {
    const check_product = await checkBeforeProduct(category_id, unit_id, warrenty_time_id)
    if (check_product) {
        return check_product
    }

    const description_normal = removeTagHtml(description);
    const slug = convertToSlug(name);

    const attributes_in_category = await check_attributes(attributes, category_id)
    if (attributes_in_category.error) {
        return attributes_in_category
    }
    const product = await prisma.product.update({
        where: { id },
        data: {
            name,
            slug,
            description,
            description_normal,
            image,
            selling_price,
            category_id,
            unit_id,
            warrenty_time_id,
            is_hide,
            status
        }
    })

    const check_attr = await check_attributes(attributes, category_id)
    if (check_attr) {
        return check_attr
    }
    const { toAdd, toUpdate, toDelete } =  diffAttributeSets(attributes, attributes_in_category);
    
    createManyAttribute = await prisma.attribute_product.createMany({
        data: toAdd.map(async (item) => {
            return {
                product_id: product.id,
                attribute_id: item.id,
                value: item.value
            }
        })
    })

    updateManyAttribute = await prisma.attribute_group.updateMany({
        where: {
            product_id: product.id,
            attribute_id: item.id,
        },
        data: toUpdate.map(async (item) => { return { value: item.value } })
    })

    await prisma.attribute_group.deleteMany({
        where: {
            product_id: product.id,
            attribute_id: toDelete.map(async (item) => { return { value: item.id } })
        }
    })

    return get_error_response(
        ERROR_CODES.SUCCESS,
        STATUS_CODE.OK,
        product
    )
}

async function deleteProductService(id) {
    const product = await prisma.product.findUnique(id)

    if (!product) {
        return get_error_response(
            ERROR_CODES.PRODUCT_NOT_FOUND
        )
    }

    const relatedTables = [
        { model: prisma.warehouse_inventory, error: ERROR_CODES.DEIVCE_HAS_WAREHOUSE_INVENTORY },
        { model: prisma.detail_export, error: ERROR_CODES.DEIVCE_HAS_DETAIL_EXPORT },
        { model: prisma.image_product, error: ERROR_CODES.DEIVCE_HAS_IMAGE_PRODUCT },
        { model: prisma.review_product, error: ERROR_CODES.DEIVCE_HAS_REVIEW_PRODUCT },
        { model: prisma.liked, error: ERROR_CODES.DEIVCE_HAS_LIKED_PRODUCT },
        { model: prisma.cart, error: ERROR_CODES.DEIVCE_HAS_CART_ITEM },
        { model: prisma.order_detail, error: ERROR_CODES.DEIVCE_HAS_ORDER_DETAIL },
        { model: prisma.detail_import, error: ERROR_CODES.DEIVCE_HAS_DETAIL_IMPORT },
        { model: prisma.blog, error: ERROR_CODES.DEIVCE_HAS_BLOG },
    ];

    const checks = await Promise.all(
        relatedTables.map(({ model }) =>
            model.findFirst({ where: { product_id: id } })
        )
    );

    for (let i = 0; i < checks.length; i++) {
        if (checks[i]) {
            return get_error_response(relatedTables[i].error, STATUS_CODE.BAD_REQUEST);
        }
    }

    await prisma.$transaction([
        prisma.product.delete({ where: { id } })
    ]);
    
    return get_error_response(
        ERROR_CODES.SUCCESS,
        STATUS_CODE.OK
    )
}

const check_attributes = async (attributes, category_id) => {
    const attributes_in_category = await prisma.attribute_category.findMany({
        where: { category_id: category_id },
        include: { attribute: true },
    })

    attributes.forEach(async (item) => {
        const attribute = attributes_in_category.find(
            (attr) => attr.id === item.id
        )

        if (!attribute) {
            return {
                error: true,
                data_error: get_error_response(
                    ERROR_CODES.ATTRIBUTE_NOT_FOUND,
                    STATUS_CODE.BAD_REQUEST
                )
            }
        }        

        if (attribute.datatype != typeof(item.value)) {
            return {
                error: true,
                data_error: get_error_response(
                    ERROR_CODES.ATTRIBUTE_DATATYPE_NOT_MATCH,
                    STATUS_CODE.BAD_REQUEST
                )
            }
        }
    })

    return attributes;
}

module.exports = {
    createProductService
};