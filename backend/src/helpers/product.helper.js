const { ERROR_CODES, STATUS_CODE } = require("../contants/errors");
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

function configDataProduct(productRows) {
    const productsById = {};
    productRows.forEach((row) => {
        const productId = row.ID || row.id; // Đảm bảo lấy đúng productId
        if (!productsById[productId]) {
            productsById[productId] = {
                id: row.id,
                name: row.name,
                slug: row.slug,
                description: row.description,
                selling_price: row.selling_price,
                sold: row.sold,
                views: row.views,
                status: row.status,
                category_id: row.category_id,
                categories: row.categories,
                average_rating: row.average_rating,
                total_review: row.total_review,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at,
                attributes: row.attributes_json && typeof row.attributes_json === 'string' ? JSON.parse(row.attributes_json) : [],
                reviews: [],
                images: [],
                image: row.image,
            };
        }
    });

    return Object.values(productsById).map((product) => {
        console.log("product",product)
        const attributeGroups = groupAttributesByGroup(product.attributes);
        const { attributes, ...productData } = product;
        return {
            ...productData,
            specifications: attributeGroups,
        };
    });
}

// Hàm groupAttributesByGroup (giả định bạn có hàm này)
function groupAttributesByGroup(attributes) {
    const groups = {};
    attributes.forEach(attr => {
        const groupId = attr.attribute_group_id || 'default'; // Giả định, cần điều chỉnh dựa trên dữ liệu thực tế
        if (!groups[groupId]) {
            groups[groupId] = {
                attribute_group: attr.attribute_group || 'Default Group',
                attributes: []
            };
        }
        groups[groupId].attributes.push({
            id: attr.id,
            name: attr.name,
            value: attr.value
        });
    });
    return Object.values(groups);
}

function groupAttributesByGroupDetail(attributeRows) {
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

function groupAttributesByGroupDetail(attributeRows) {
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
        const productId = row.ID || row.id; // Đảm bảo lấy đúng productId
        if (!productsById[productId]) {
            productsById[productId] = {
                id: row.id,
                name: row.name,
                slug: row.slug,
                description: row.description,
                description_normal: row.description_normal,
                selling_price: row.selling_price,
                sold: row.sold,
                views: row.views,
                status: row.status,
                is_hide: row.is_hide,
                category_id: row.category_id,
                categories: row.categories,
                unit_id: row.unit_id,
                unit_name: row.unit_name,
                stock: row.stock,
                average_rating: row.average_rating,
                total_liked: row.total_liked,
                total_review: row.total_review,
                total_reviews_today: row.total_reviews_today,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at,
                attributes: row.attributes_json && typeof row.attributes_json === 'string' ? JSON.parse(row.attributes_json) : [],
                reviews: [],
                images: [],
                image: row.image,
            };
        }
        // Không cần push thêm vì attributes_json đã chứa toàn bộ
    });
    return Object.values(productsById).map((product) => {
        const attributeGroups = groupAttributesByGroupDetail(product.attributes);
        const { attributes, ...productData } = product;
        return {
            ...productData,
            specifications: attributeGroups,
        };
    });
}

async function check_info_product(product) {
    const result_query = await queryHelper.queryRaw(`
        SELECT 
            p.name, p.selling_price, p.status, COALESCE(SUM(w.stock), 0) AS total_quantity
        FROM product p
        LEFT JOIN warehouse_inventory w ON p.id = w.product_id
        WHERE p.id = ${product.id}
        GROUP BY p.id, p.selling_price, p.status
    `);
    const product_actual = result_query[0];
    let errors = [];
    let fieldErrors = [];
    // Không tồn tại sản phẩm
    if (!product) {
        errors.push(ERROR_CODES.PRODUCT_NOT_FOUND)
        fieldErrors.push('id')
    }

    if (product.name !== product_actual.name) {
        console.log(product.name, product_actual.name)
        errors.push(ERROR_CODES.PRODUCT_CHANGED_NAME)
        fieldErrors.push('name')
    }

    // Sản phẩm bị ẩn
    if (product_actual.is_hide) {
        errors.push(ERROR_CODES.PRODUCT_IS_HIDE)
        fieldErrors.push('is_hide')
    }

    // Sản phẩm ngừng bán hoặc hết hàng
    if (product_actual.status < PRODUCT.ACTIVE) {
        errors.push(ERROR_CODES.PRODUCT_NON_ACTIVE)
        fieldErrors.push('status')
    }

    // Sản phẩm có giá khác so với giá thực tế
    if (product.price !== product_actual.selling_price) {
        errors.push(ERROR_CODES.PRODUCT_SELLING_PRICE_NOT_MATCH)
        fieldErrors.push('selling_price')
    }

    // Sản phẩm được mua với số lượng lớn hơn số lượng tồn kho
    console.log("SS:", product.quantity > product_actual.total_quantity)
    if (product.quantity > product_actual.total_quantity) {
        errors.push(ERROR_CODES.PRODUCT_NOT_ENOUGH_STOCK)
        fieldErrors.push('quantity')
    }

    if (errors.length > 0) {
        return get_error_response(errors, STATUS_CODE.NOT_ACCEPTABLE, null, fieldErrors)
    }

    return null;
}

async function check_list_info_product(list_product) {
    `
    [
        {
            "product_id": 1,
            "errors": [{code: 1017, message: "Sản phẩm không tồn tại"}]    
        }
    ]
    `
    let errors = [];
    // Sử dụng Promise.all để đợi tất cả các check hoàn thành
    await Promise.all(list_product.map(async (product) => {
        const result_check = await check_info_product(product);
        if (result_check && result_check.status_code !== STATUS_CODE.OK) {
            errors.push({
                product_id: product.id,
                product_name: product.name,
                errors: result_check.errors
            });
        }
    }));

    if (errors.length > 0) {
        return {
            status_code: STATUS_CODE.BAD_REQUEST,
            data_errors: errors
        }
    }
    return null;
}

module.exports = {
    diffAttributeSets, configDataProductDetail, check_info_product, check_list_info_product, configDataProduct
}