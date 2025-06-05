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
    let get_attr = `product.name, product.slug, product.description, product.image, selling_price, views, status, product.description_normal,
    product.category_id, categories.name as categories, COALESCE(sold.sold, 0) AS sold, COALESCE(CAST(review.total_review AS CHAR), 0) AS total_review, COALESCE(review.avg_rating, 0) AS average_rating,
    COALESCE(CAST(total_reviews_today.total_reviews_today AS CHAR), 0) AS total_reviews_today, COALESCE(inventory.stock, 0) AS stock`

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
        LEFT JOIN (
            SELECT product_id, SUM(stock) AS stock
            FROM warehouse_inventory
            GROUP BY product_id
        ) inventory ON product.id = inventory.product_id
    `

    try {
        const products = await executeSelectData({
            table: get_table,
            queryJoin: query_join,
            strGetColumn: get_attr,
            limit: limit || 10,
            page: page,
            filter: filters,
            logic: logic,
            sort: sort,
            order: order,
            configData: configDataProduct
        });
        
        const formattedProducts = products.data || [];

        return get_error_response(
            errors = ERROR_CODES.SUCCESS,
            status_code = STATUS_CODE.OK,
            data = {
                data: formattedProducts,
                total_page: products.total_page || 1
            }
        );    } catch (error) {
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
        attribute.id as attribute_id, attribute.name as attribute, attribute_group.id as attribute_group_id, attribute_group.name as attribute_group, attribute_product.value as attribute_value,
        product.warrenty_time_id`
    let get_table = `product`
    let query_join = `
        LEFT JOIN categories ON product.category_id = categories.category_id
        LEFT JOIN unit ON product.unit_id = unit.id
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
    const category = await prisma.categories.findUnique({
        where: {
            category_id: category_id
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

    // if (warrenty_time_id) {
    //     const warrenty_time = await prisma.warrenty_time.findUnique({
    //         where: {
    //             id: warrenty_time_id
    //         }
    //     })

    //     if (!warrenty_time) {
    //         return get_error_response(
    //             ERROR_CODES.WARRANTY_TIME_NOT_FOUND,
    //             STATUS_CODE.BAD_REQUEST,
    //             null
    //         )
    //     }
    // }
    //Khi nào sử dụng đến thời gian bảo hành thì mở
}

async function createProductService({ name, description, images, selling_price, category_id, unit_id, warrenty_time_id, is_hide, status, attributes }) {
    // Kiểm tra dữ liệu đầu vào
    const check_product = await checkBeforeProduct(category_id, unit_id, warrenty_time_id);
    if (check_product) {
        return check_product;
    }

    const check_name = await checkNameExcludingCurrent(name);
    if (check_name) {
        return get_error_response(
            ERROR_CODES.PRODUCT_NAME_EXISTS,
            STATUS_CODE.BAD_REQUEST
        );
    }

    // Kiểm tra mảng images
    if (!images || !Array.isArray(images) || images.length === 0) {
        return get_error_response(
            ERROR_CODES.IMAGE_PRODUCT_IMAGE_REQUIRED,
            STATUS_CODE.BAD_REQUEST
        );
    }

    // Lấy ảnh đầu tiên làm image chính
    const mainImage = images[0].image;

    // Chuẩn bị dữ liệu bổ sung
    const description_normal = removeTagHtml(description);
    let slug = convertToSlug(name);

    // Kiểm tra slug đã tồn tại chưa, nếu tồn tại thì thêm số 1 vào cuối
    const check_slug = await prisma.product.findFirst({
        where: {
            slug: slug
        }
    });

    if (check_slug) {
        slug = slug + '1';
    }

    // Kiểm tra và xử lý thuộc tính
    if (attributes && Array.isArray(attributes) && attributes.length > 0) {
        // Kiểm tra xem attributes có id hợp lệ
        for (const item of attributes) {
            if (!item.id || isNaN(item.id)) {
                return get_error_response(
                    ERROR_CODES.INVALID_ATTRIBUTE_ID,
                    STATUS_CODE.BAD_REQUEST,
                    { message: "Mỗi thuộc tính phải có id hợp lệ." }
                );
            }
        }

        const check_attr = await check_attributes(attributes, category_id);
        if (check_attr) {
            return check_attr;
        }
    }

    // Tạo sản phẩm
    const product = await prisma.product.create({
        data: {
            name,
            slug,
            description,
            description_normal,
            image: mainImage,
            selling_price,
            category_id,
            unit_id,
            warrenty_time_id,
            views: 0,
            is_hide,
            status,
            created_at: new Date(),
            updated_at: new Date()
        }
    });

    // Tạo các bản ghi thuộc tính nếu có
    if (attributes && Array.isArray(attributes) && attributes.length > 0) {
        await prisma.attribute_product.createMany({
            data: attributes.map((item) => ({
                product_id: product.id,
                attribute_id: Number(item.id), // Lấy attribute_id từ item.id
                value: item.value
            }))
        });
    }

    // Lưu toàn bộ mảng images vào image_product
    const imageRecords = images.map((img) => ({
        product_id: product.id,
        image: img.image
    }));
    if (imageRecords.length > 0) {
        await prisma.image_product.createMany({
            data: imageRecords
        });
    }

    // Lấy lại danh sách hình ảnh để trả về
    const allImages = images.map((img) => ({
        id: null,
        product_id: product.id,
        image: img.image
    }));

    // Trả về response
    const data_response = {
        ...product,
        attributes: attributes || [],
        images: allImages
    };

    return get_error_response(
        ERROR_CODES.SUCCESS,
        STATUS_CODE.OK,
        data_response
    );
}

async function updateProductService({ id, name, description, selling_price, category_id, unit_id, warrenty_time_id, is_hide, status, attributes, images }) {
    const check_product = await checkBeforeProduct(category_id, unit_id, warrenty_time_id)
    if (check_product) {
        return check_product
    }

    const check_name = await checkNameExcludingCurrent(name, id); // Truyền id để loại trừ bản ghi hiện tại
    if (check_name) {
        return get_error_response(
            ERROR_CODES.PRODUCT_NAME_EXISTED,
            STATUS_CODE.BAD_REQUEST
        );
    }

    const description_normal = removeTagHtml(description);
    const slug = convertToSlug(name);

    const attributes_in_category = await check_attributes(attributes, category_id)
    if (attributes_in_category) {
        return attributes_in_category
    }

    // Kiểm tra và lấy hình ảnh đầu tiên từ mảng images
    if (!images || images.length === 0) {
        return get_error_response(
            ERROR_CODES.IMAGE_PRODUCT_IMAGE_REQUIRED,
            STATUS_CODE.BAD_REQUEST
        );
    }
    const mainImage = images[0].image;

    // Cập nhật thông tin cơ bản của sản phẩm
    const product = await prisma.product.update({
        where: { id },
        data: {
            name,
            slug,
            description,
            description_normal,
            image: mainImage,
            selling_price,
            category_id,
            unit_id,
            warrenty_time_id,
            is_hide,
            status,
            updated_at: new Date()
        }
    });

    // Xử lý cập nhật thuộc tính
    if (attributes) {
        const check_attr = await check_attributes(attributes, category_id)
        if (check_attr) {
            return check_attr
        }

        // Xóa tất cả thuộc tính hiện có
        await prisma.attribute_product.deleteMany({
            where: { product_id: id }
        });

        // Tạo mới các thuộc tính
        await prisma.attribute_product.createMany({
            data: attributes.map((item) => ({
                product_id: id,
                attribute_id: item.id,
                value: item.value
            }))
        });
    }

    // Xử lý cập nhật hình ảnh
    if (images) {
        // Xóa tất cả hình ảnh hiện có
        await prisma.image_product.deleteMany({
            where: { product_id: id }
        });

        // Tạo mới tất cả hình ảnh
        await prisma.image_product.createMany({
            data: images.map(img => ({
                product_id: id,
                image: img.image
            }))
        });
    }

    return get_error_response(
        ERROR_CODES.SUCCESS,
        STATUS_CODE.OK,
        product
    )
}

async function deleteProductService(id) {
    const product = await prisma.product.findUnique({
        where: {
          id: Number(id),
        },
      });

    if (!product) {
        return get_error_response(
            ERROR_CODES.PRODUCT_NOT_FOUND
        )
    }

    await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
            deleted_at: new Date()
        }
    });

    return get_error_response(
        ERROR_CODES.SUCCESS,
        STATUS_CODE.OK
    )
}

// async function deleteProductService(id) {
//     const product = await prisma.product.findUnique(id)

//     if (!product) {
//         return get_error_response(
//             ERROR_CODES.PRODUCT_NOT_FOUND
//         )
//     }

//     const relatedTables = [
//         { model: prisma.warehouse_inventory, error: ERROR_CODES.DEIVCE_HAS_WAREHOUSE_INVENTORY },
//         { model: prisma.detail_export, error: ERROR_CODES.DEIVCE_HAS_DETAIL_EXPORT },
//         { model: prisma.image_product, error: ERROR_CODES.DEIVCE_HAS_IMAGE_PRODUCT },
//         { model: prisma.review_product, error: ERROR_CODES.DEIVCE_HAS_REVIEW_PRODUCT },
//         { model: prisma.liked, error: ERROR_CODES.DEIVCE_HAS_LIKED_PRODUCT },
//         { model: prisma.cart, error: ERROR_CODES.DEIVCE_HAS_CART_ITEM },
//         { model: prisma.order_detail, error: ERROR_CODES.DEIVCE_HAS_ORDER_DETAIL },
//         { model: prisma.detail_import, error: ERROR_CODES.DEIVCE_HAS_DETAIL_IMPORT },
//         { model: prisma.blog, error: ERROR_CODES.DEIVCE_HAS_BLOG },
//     ];

//     const checks = await Promise.all(
//         relatedTables.map(({ model }) =>
//             model.findFirst({ where: { product_id: id } })
//         )
//     );

//     for (let i = 0; i < checks.length; i++) {
//         if (checks[i]) {
//             return get_error_response(relatedTables[i].error, STATUS_CODE.BAD_REQUEST);
//         }
//     }

//     await prisma.$transaction([
//         prisma.product.delete({ where: { id } })
//     ]);

//     return get_error_response(
//         ERROR_CODES.SUCCESS,
//         STATUS_CODE.OK
//     )
// }

const check_attributes = async (attributes, category_id) => {
    console.log("attributes", attributes)
    console.log("category_id", category_id)
    const attributes_in_category = await prisma.attribute_category.findMany({
        where: { category_id: category_id },
        include: { attribute: true },
    })

    console.log("attributein category", attributes_in_category)
    for (const item of attributes) {
        const attribute = attributes_in_category.find(
            (attr) => attr.attribute_id == item.id
        )
        console.log("attribute", attribute)

        if (!attribute) {
            return get_error_response(
                ERROR_CODES.ATTRIBUTE_NOT_FOUND,
                STATUS_CODE.BAD_REQUEST
            )
        }
    }

    return null; // Return null if no errors found
}

const checkNameExcludingCurrent = async (name, excludeId = null) => {
    const whereClause = {
        name: name
    };

    // Nếu có excludeId (trong trường hợp cập nhật), loại trừ bản ghi hiện tại
    if (excludeId) {
        whereClause.id = { not: excludeId };
    }

    const check_name = await prisma.product.findFirst({
        where: whereClause
    });

    return check_name;
};

module.exports = {
    getProductService,
    getProductDetailService,
    createProductService,
    updateProductService,
    deleteProductService,
};