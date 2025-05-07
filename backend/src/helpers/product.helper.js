const { ERROR_CODES, STATUS_CODE, ERROR_MESSAGES } = require("../contants/errors");
const { PRODUCT } = require("../contants/info");
const queryHelper = require("./query.helper");
const { prisma } = require("./query.helper");
const { get_error_response } = require("./response.helper");

function diffAttributeSets(request, in_db) {
    const requestMap = new Map();
    const dbMap = new Map();

    request.forEach(item => requestMap.set(item.id, item));
    // in_db.forEach(item => dbMap.set(item.id, item));

    const toAdd = [];
    const toUpdate = [];
    const toDelete = [];

    // Kiểm tra cần thêm mới hoặc cập nhật
    requestMap.forEach((reqItem, id) => {
        const dbItem = dbMap.get(id);
        if (!dbItem) {
            toAdd.push(reqItem);
        } else if (dbItem.value !== reqItem.value) {
            toUpdate.push(reqItem);
        }
    });

    // Kiểm tra cần xóa
    // db = [2, 4, 5], req = [1, 2, 3]

    // => add: 1, 3 -  update: 2 - delete: 4, 5 (db - req)
    dbMap.forEach((dbItem, id) => {
        if (!requestMap.has(id)) {
            toDelete.push(dbItem);
        }
    });

    return { toAdd, toUpdate, toDelete };
}

function groupAttributesByGroup(attributeRows) {
    const result = {};

    attributeRows.forEach((item) => {
        if (item.attribute_group_id) {
            const groupId = item.attribute_group_id;
            const groupName = item.attribute_group || 'Unknown Group';
            if (!result[groupId]) {
                result[groupId] = {
                    id: groupId,
                    name: groupName,
                    attributes: [],
                };
            }
            result[groupId].attributes.push({
                id: item.attribute_id,
                name: item.attribute || 'Unknown Attribute',
                value: item.attribute_value || null,
            });
        }
    });

    // Trả về danh sách các nhóm thuộc tính
    return Object.values(result);
}

function configDataProductDetail(productRows) {
    const productsById = {};
    productRows.forEach((row) => {
        const productId = row.ID;
        if (!productsById[productId]) {
            productsById[productId] = {
                id: row.id,
                name: row.name,
                slug: row.slug,
                description: row.description,
                description_normal: row.description_normal,
                image: row.image,
                selling_price: row.selling_price,
                views: row.views,
                status: row.status,
                is_hide: row.is_hide,
                category_id: row.category_id,
                categories: row.categories,
                unit_id: row.unit_id,
                unit_name: row.unit_name,
                average_rating: row.average_rating,
                total_liked: row.total_liked,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at,
                attributes: [],
            };
        }
        if (row.attribute_id || row.attribute_group_id) {
            productsById[productId].attributes.push({
                attribute_id: row.attribute_id,
                attribute: row.attribute,
                attribute_group_id: row.attribute_group_id,
                attribute_group: row.attribute_group,
                attribute_value: row.attribute_value,
            });
        }
    });
    return Object.values(productsById).map((product) => {
        const attributeGroups = groupAttributesByGroup(product.attributes);
        const { attributes, ...productData } = product;
        return {
            ...productData,
            attribute_groups: attributeGroups,
        };
    });
}

async function check_info_product(product_id, quantity_sold) {
    const product = await queryHelper.queryRaw(`
        SELECT 
            p.name, p.selling_price, p.status, COALESCE(SUM(w.stock), 0) AS total_quantity
        FROM product p
        LEFT JOIN warehouse_inventory w ON p.id = w.product_id
        WHERE p.id = ${product_id}
        GROUP BY p.id, p.selling_price, p.status
    `);
    let errors = [];
    let fieldErrors = [];
    // Không tồn tại sản phẩm
    if (!product) {
        errors.push(ERROR_CODES.PRODUCT_NOT_FOUND)
        fieldErrors.push('id')
    }

    if (product.name !== product_check.name) {
        errors.push(ERROR_CODES.PRODUCT_CHANGED_NAME)
        fieldErrors.push('name')
    }
    
    // Sản phẩm bị ẩn
    if (product.is_hide) {
        errors.push(ERROR_CODES.PRODUCT_IS_HIDE)
        fieldErrors.push('is_hide')
    }

    // Sản phẩm ngừng bán hoặc hết hàng
    if (product.status < PRODUCT.ACTIVE) {
        errors.push(ERROR_CODES.PRODUCT_NON_ACTIVE)
        fieldErrors.push('status')
    }

    // Sản phẩm có giá khác so với giá thực tế
    if (product.selling_price !== product_check.selling_price) {
        errors.push(ERROR_CODES.PRODUCT_SELLING_PRICE_NOT_MATCH)
        fieldErrors.push('selling_price')
    }

    // Sản phẩm được mua với số lượng lớn hơn số lượng tồn kho
    if (quantity_sold > product.total_quantity) {
        errors.push(ERROR_CODES.PRODUCT_NOT_ENOUGH_STOCK)
        fieldErrors.push('quantity_sold')
    }

    if (errors) {
        
        return get_error_response(errors, STATUS_CODE.NOT_ACCEPTABLE, fieldErrors)
    }
    
    return null;
}

async function check_list_info_product(list_product) {
    let errors = [];
    list_product.map((product) => {
        const result_check = check_info_product(product.id, product.quantity_sold);

        if (result_check) {
            return errors.push(result_check);
        }
    })

    if (errors.length > 0) {
        return get_error_response(errors, STATUS_CODE.NOT_ACCEPTABLE, errors.map((error) => error.fieldErrors).flat())
    }
    return null;
}

module.exports = {
    diffAttributeSets, configDataProductDetail, check_info_product, check_list_info_product
}