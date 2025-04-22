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

module.exports = {
    diffAttributeSets, configDataProductDetail
}