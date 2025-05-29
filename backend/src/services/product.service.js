const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { ROLE } = require('../contants/info');
const { get_error_response } = require('../helpers/response.helper');
const { PrismaClient, sql } = require('@prisma/client');
const { convertToSlug, removeTagHtml } = require('../helpers/extension.helper');
const { executeSelectData } = require('../helpers/sql_query')
const { configDataProductDetail, diffAttributeSets, configDataProduct } = require('../helpers/product.helper')


const prisma = new PrismaClient()
// 0: Sản phẩm ngừng bán
// >= 1: Sản phẩm đang bán
// 1: Sản phẩm bán
// 2: Sản phẩm khuyến mãi
// 3: Sản phẩm nổi bật
// 4: Sản phẩm mới
// Nếu không nhập limit thì mặc định là lấy hết
const getProductService = async (filters, logic, limit, sort, order, role, type, page = 1) => {
    let get_attr = `product.name, product.slug, product.description, product.image, selling_price, views, status,
    product.category_id, categories.name as categories, COALESCE(sold.sold, 0) AS sold, COALESCE(CAST(review.total_review AS CHAR), 0) AS total_review, COALESCE(review.avg_rating, 0) AS average_rating,
    COALESCE(CAST(total_reviews_today.total_reviews_today AS CHAR), 0) AS total_reviews_today`

    let get_table = `product`
    let query_join = `LEFT JOIN categories ON product.category_id = categories.category_id`

    query_join += `
        LEFT JOIN (
            SELECT product_id, AVG(rating) AS avg_rating, COUNT(id) AS total_review
            FROM review_product
            GROUP BY product_id
        ) review ON product.id = review.product_id
        LEFT JOIN (
            SELECT product_id, COUNT(id) AS total_liked
            FROM liked
            GROUP BY product_id
        ) liked ON product.id = liked.product_id
        LEFT JOIN (
            SELECT product_id, SUM(quantity_sold) AS sold
            FROM order_detail
            GROUP BY product_id
        ) sold ON product.id = sold.product_id
        LEFT JOIN (
            SELECT
                product_id,
                COUNT(id) as total_reviews_today
            FROM review_product
            WHERE deleted_at IS NULL
            AND created_at >= CURDATE()
            GROUP BY product_id
        ) total_reviews_today ON product.id = total_reviews_today.product_id
    `

    try {
        console.log('Page:', page, 'Limit:', limit, 'Filters:', filters, 'Logic:', logic, 'Sort:', sort, 'Order:', order);

        const products = await executeSelectData({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            limit: limit || 10,
            page: page, // Truyền page
            filter: filters,
            logic: logic,
            sort: sort,
            order: order,
            configData: configDataProduct
        });

        console.log('Products raw:', products);
        console.log('Total page:', products.total_page);

        const formattedProducts = products.data || [];

        return get_error_response(
            errors = ERROR_CODES.SUCCESS,
            status_code = STATUS_CODE.OK,
            data = {
                data: formattedProducts,
                total_page: products.total_page || 1
            }
        );
    } catch (error) {
        console.error('Lỗi:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
};

const getProductDetailService = async (id, role = null, type = null) => {
    const product = await prisma.product.findUnique({
        where: { id: id }
    })

    if (!product) {
        return get_error_response(
            errors = ERROR_CODES.PRODUCT_NOT_FOUND,
            status_code = STATUS_CODE.INTERNAL_SERVER_ERROR
        )
    }

    const filter = JSON.stringify([
        {
            field: "product.id",
            condition: "contains",
            value: id
        }
    ])
    let get_attr = `product.name, product.slug, product.description, description_normal, product.image, selling_price, views, status, product.is_hide,
        product.category_id, categories.name as categories, unit_id, unit.name as unit_name,
        attribute.id as attribute_id, attribute.name as attribute, attribute_group.id as attribute_group_id, attribute_group.name as attribute_group, attribute_product.value as attribute_value
    `
    let get_table = `product`
    let query_join = `
        LEFT JOIN categories ON product.category_id = categories.category_id
        LEFT JOIN unit ON product.unit_id = unit.id
        -- LEFT JOIN warranty_time ON product.warranty_time_id = warranty_time.id
        LEFT JOIN attribute_product ON product.id = attribute_product.product_id
        LEFT JOIN attribute ON attribute_product.attribute_id = attribute.id
        LEFT JOIN attribute_group ON attribute.group_attribute_id = attribute_group.id
    `

    get_attr += `, COALESCE(review.avg_rating, 0) AS average_rating, COALESCE(CAST(review.total_review AS CHAR), 0) AS total_review, COALESCE(CAST(liked.total_liked AS CHAR), '0') AS total_liked, COALESCE(inventory.stock, 0) AS stock, COALESCE(sold.sold, 0) AS sold`
    query_join = query_join + `
        LEFT JOIN (
            SELECT product_id, CAST(AVG(rating) AS DECIMAL(5,2)) AS avg_rating, COUNT(id) AS total_review
            FROM review_product
            GROUP BY product_id
        ) review ON product.id = review.product_id
        LEFT JOIN (
            SELECT product_id, COUNT(id) AS total_liked
            FROM liked
            GROUP BY product_id
        ) liked ON product.id = liked.product_id
        LEFT JOIN (
            SELECT product_id, SUM(stock) AS stock
            FROM warehouse_inventory
            GROUP BY product_id
        ) inventory ON product.id = inventory.product_id
        LEFT JOIN (
            SELECT product_id, SUM(quantity_sold) AS sold
            FROM order_detail
            GROUP BY product_id
        ) sold ON product.id = sold.product_id
    `

    const products = await executeSelectData({
        table: get_table, queryJoin: query_join, strGetColumn: get_attr, filter: filter, configData: configDataProductDetail,
    })

    const images = await prisma.image_product.findMany({
        where: { product_id: id },
        select: {
            id: true,
            product_id: true,
            image: true
        }
    });

    products.data[0].images = images;

    return get_error_response(errorCode = ERROR_CODES.SUCCESS, status_code = STATUS_CODE.OK, data = products);
}

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
    const { toAdd, toUpdate, toDelete } = (attributes, attributes_in_category);

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

    for (const item of attributes) {
        const attribute = attributes_in_category.find(
            (attr) => attr.id === item.id
        )

        if (!attribute) {
            return get_error_response(
                ERROR_CODES.ATTRIBUTE_NOT_FOUND,
                STATUS_CODE.BAD_REQUEST
            )
        }

        if (attribute.datatype !== typeof item.value) {
            return get_error_response(
                ERROR_CODES.ATTRIBUTE_DATATYPE_NOT_MATCH,
                STATUS_CODE.BAD_REQUEST
            )
        }
    }

    return null; // Return null if no errors found
}

module.exports = {
    getProductService,
    getProductDetailService,
    createProductService,
    updateProductService,
    deleteProductService,
};