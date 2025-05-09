const { PrismaClient } = require('@prisma/client');
const { get_error_response } = require('../helpers/response.helper');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { executeSelectData } = require('../helpers/sql_query');
const { convertToSlug } = require('../helpers/extension.helper');
const { getVietnamTimeNow } = require('../helpers/time.helper');
const { isDescendant } = require('../helpers/categories.helper');
const prisma = new PrismaClient();


//Lấy danh sách danh mục và danh mục con và thuộc tính của danh mục [được lọc theo deleted_at = null]
const getCategoriesService = async (filter, limit, sort, order) => {
    try {
        // Build SQL query to get categories with attributes
        let get_attr = `categories.category_id, categories.name, categories.slug, categories.description, 
        categories.parent_id, categories.image, categories.is_hide, 
        categories.created_at, categories.updated_at, categories.deleted_at,
        attribute_group.id as group_id, attribute_group.name as group_name, 
        attribute.id as attribute_id, attribute.name as attribute_name`;

        let get_table = `categories`;
        let query_join = `LEFT JOIN attribute_category ON categories.category_id = attribute_category.category_id
        LEFT JOIN attribute ON attribute_category.attribute_id = attribute.id
        LEFT JOIN attribute_group ON attribute.group_attribute_id = attribute_group.id`;

        const filter = JSON.stringify([
            {
                field: "categories.deleted_at",
                condition: "is",
                value: null
            }
        ]);
        // Execute query
        const result = await executeSelectData({
            strGetColumn: get_attr,
            table: get_table,
            queryJoin: query_join,
            filter: filter,
            limit: limit,
            sort: sort,
            order: order
        });

        if (!result || !result.data || !Array.isArray(result.data)) {
            return get_error_response(
                ERROR_CODES.INTERNAL_SERVER_ERROR,
                STATUS_CODE.INTERNAL_SERVER_ERROR
            );
        }

        // Group results by category and attribute group
        const categoriesMap = new Map();
        result.data.forEach(item => {
            if (!categoriesMap.has(item.category_id)) {
                categoriesMap.set(item.category_id, {
                    category_id: item.category_id,
                    name: item.name,
                    slug: item.slug,
                    description: item.description,
                    parent_id: item.parent_id,
                    image: item.image,
                    is_hide: item.is_hide,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                    deleted_at: item.deleted_at,
                    attribute_groups: new Map(),
                    children: []
                });
            }

            const category = categoriesMap.get(item.category_id);

            // Add attribute to its group if it exists
            if (item.attribute_id && item.group_id) {
                if (!category.attribute_groups.has(item.group_id)) {
                    category.attribute_groups.set(item.group_id, {
                        group_id: item.group_id,
                        group_name: item.group_name,
                        attributes: []
                    });
                }
                category.attribute_groups.get(item.group_id).attributes.push({
                    attribute_id: item.attribute_id,
                    attribute_name: item.attribute_name
                });
            }
        });

        // Convert maps to arrays and build category tree
        const buildCategoryTree = (parentId = null) => {
            const categories = Array.from(categoriesMap.values())
                .filter(category => category.parent_id === parentId)
                .map(category => {
                    const children = buildCategoryTree(category.category_id);
                    return {
                        category_id: category.category_id,
                        name: category.name,
                        slug: category.slug,
                        description: category.description,
                        parent_id: category.parent_id,
                        image: category.image,
                        is_hide: category.is_hide,
                        created_at: category.created_at,
                        updated_at: category.updated_at,
                        deleted_at: category.deleted_at,
                        attribute_groups: Array.from(category.attribute_groups.values()),
                        children: children.length > 0 ? children : []
                    };
                });
            return categories;
        };

        const categories = buildCategoryTree();

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            {
                categories,
            }
        );
    } catch (error) {
        console.error('Error in getCategoriesService:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
};

//Lấy chi tiết danh mục và danh mục con và thuộc tính của danh mục
const getCategoriesDetailService = async (id) => {
    try {
        // First check if category exists
        const category = await prisma.categories.findUnique({
            where: { category_id: parseInt(id) }
        });

        if (!category) {
            return get_error_response(
                ERROR_CODES.CATEGORY_NOT_FOUND,
                STATUS_CODE.NOT_FOUND
            );
        }

        // Build SQL query to get category with attributes
        let get_attr = `categories.category_id, categories.name, categories.slug, categories.description, 
        categories.parent_id, categories.image, categories.is_hide, 
        categories.created_at, categories.updated_at, categories.deleted_at,
        attribute_group.id as group_id, attribute_group.name as group_name, 
        attribute.id as attribute_id, attribute.name as attribute_name`;

        let get_table = `categories`;
        let query_join = `LEFT JOIN attribute_category ON categories.category_id = attribute_category.category_id
        LEFT JOIN attribute ON attribute_category.attribute_id = attribute.id
        LEFT JOIN attribute_group ON attribute.group_attribute_id = attribute_group.id`;

        const filter = JSON.stringify([
            {
                field: "categories.category_id",
                condition: "=",
                value: parseInt(id)
            }
        ]);

        // Execute query
        const result = await executeSelectData({
            strGetColumn: get_attr,
            table: get_table,
            queryJoin: query_join,
            filter: filter
        });

        if (!result || !result.data || !Array.isArray(result.data) || result.data.length === 0) {
            return get_error_response(
                ERROR_CODES.CATEGORY_NOT_FOUND,
                STATUS_CODE.NOT_FOUND
            );
        }

        // Get the first item for category details
        const firstItem = result.data[0];

        // Group attributes by attribute group
        const attributeGroups = new Map();
        result.data.forEach(item => {
            if (item.attribute_id && item.group_id) {
                if (!attributeGroups.has(item.group_id)) {
                    attributeGroups.set(item.group_id, {
                        group_id: item.group_id,
                        group_name: item.group_name,
                        attributes: []
                    });
                }
                attributeGroups.get(item.group_id).attributes.push({
                    attribute_id: item.attribute_id,
                    attribute_name: item.attribute_name
                });
            }
        });

        // Get children categories
        const childrenFilter = JSON.stringify([
            {
                field: "categories.parent_id",
                condition: "=",
                value: parseInt(id)
            }
        ]);

        const childrenResult = await executeSelectData({
            strGetColumn: get_attr,
            table: get_table,
            queryJoin: query_join,
            filter: childrenFilter
        });

        // Group children categories
        const childrenMap = new Map();
        if (childrenResult && childrenResult.data && Array.isArray(childrenResult.data)) {
            childrenResult.data.forEach(item => {
                if (!childrenMap.has(item.category_id)) {
                    childrenMap.set(item.category_id, {
                        category_id: item.category_id,
                        name: item.name,
                        slug: item.slug,
                        description: item.description,
                        parent_id: item.parent_id,
                        image: item.image,
                        is_hide: item.is_hide,
                        created_at: item.created_at,
                        updated_at: item.updated_at,
                        deleted_at: item.deleted_at,
                        attribute_groups: new Map(),
                        children: []
                    });
                }

                const childCategory = childrenMap.get(item.category_id);

                if (item.attribute_id && item.group_id) {
                    if (!childCategory.attribute_groups.has(item.group_id)) {
                        childCategory.attribute_groups.set(item.group_id, {
                            group_id: item.group_id,
                            group_name: item.group_name,
                            attributes: []
                        });
                    }
                    childCategory.attribute_groups.get(item.group_id).attributes.push({
                        attribute_id: item.attribute_id,
                        attribute_name: item.attribute_name
                    });
                }
            });
        }

        // Format the response
        const formattedCategory = {
            category_id: firstItem.category_id,
            name: firstItem.name,
            slug: firstItem.slug,
            description: firstItem.description,
            parent_id: firstItem.parent_id,
            image: firstItem.image,
            is_hide: firstItem.is_hide,
            created_at: firstItem.created_at,
            updated_at: firstItem.updated_at,
            deleted_at: firstItem.deleted_at,
            attribute_groups: Array.from(attributeGroups.values()),
            children: Array.from(childrenMap.values()).map(child => ({
                ...child,
                attribute_groups: Array.from(child.attribute_groups.values())
            }))
        };

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            formattedCategory
        );
    } catch (error) {
        console.error('Error in getCategoriesDetailService:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
};

//Tạo danh mục mới và danh mục con và thuộc tính của danh mục => nếu chưa tạo thì thuộc tính để rỗng [], 
// nếu tạo danh mục con thì parent_id = id_category cha
//khi tạo mới danh mục thì created_at = now() còn update_at = null
const createCategoriesService = async ({ name, description, image, parent_id, attribute_id }) => {
    try {

        // Kiểm tra tên danh mục đã tồn tại chưa
        const existed = await prisma.categories.findFirst({
            where: { name }
        });
        if (existed) {
            return get_error_response(
                ERROR_CODES.CATEGORY_NAME_EXISTED,
                STATUS_CODE.BAD_REQUEST,
            );
        }
        const existedAttr = await prisma.attribute.findMany({
            where: {
                id: {
                    in: attribute_id.map(id => parseInt(id))
                }
            }
        });
        if (existedAttr.length !== attribute_id.length) {
            return get_error_response(
                ERROR_CODES.ATTRIBUTE_INVALID_INPUT,
                STATUS_CODE.BAD_REQUEST,
            );
        }
        // 1. Tạo category mới
        const category = await prisma.categories.create({
            data: {
                name,
                slug: convertToSlug(name),
                description: description || "",
                image: image || "",
                is_hide: true,
                parent_id: parent_id,
                created_at: getVietnamTimeNow(),
            }
        });

        let attributes = []
        // 2. Nếu có attribute_id, kiểm tra và thêm vào bảng attribute_category
        if (attribute_id && Array.isArray(attribute_id) && attribute_id.length > 0) {
            // Thêm vào bảng attribute_category
            const attributeCategoryData = attribute_id.map(id => ({
                category_id: category.category_id,
                attribute_id: parseInt(id)
            }));

            await prisma.attribute_category.createMany({
                data: attributeCategoryData
            });
            attributes = existedAttr
        }

        // 3. Trả về thông tin category vừa tạo
        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            {
                ...category,
                attributes: attributes
            }
        );
    } catch (error) {
        console.error('Error creating category:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
        );
    }
};

//Cập nhật danh mục và danh mục con và thuộc tính của danh mục, nếu cập nhật is_hide = true thì cập nhật is_hide = true cho các bảng liên quan như product và blog và ngược lại
//khi update thì mới cập nhật update_at = now()
const updateCategoriesService = async ({ id, name, description, image, is_hide, parent_id, attribute_id }) => {
    try {
        // 1. Kiểm tra xem category có tồn tại không và tên danh mục có tồn tại không
        const category = await prisma.categories.findUnique({
            where: { category_id: parseInt(id) }
        });

        if (!category) {
            return get_error_response(
                ERROR_CODES.CATEGORY_NOT_FOUND,
                STATUS_CODE.NOT_FOUND
            );
        }

        const existed = await prisma.categories.findFirst({
            where: {
                name,
                NOT: { category_id: parseInt(id) }
            }
        });

        if (existed) {
            return get_error_response(
                ERROR_CODES.CATEGORY_NAME_EXISTED,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        // 2. Cập nhật thông tin category
        const updatedCategory = await prisma.categories.update({
            where: { category_id: parseInt(id) },
            data: {
                name,
                slug: convertToSlug(name),
                description: description || "",
                image: image || "",
                is_hide: is_hide || false,
                parent_id: parent_id || null,
                updated_at: getVietnamTimeNow()
            }
        });

        await prisma.blog.updateMany({
            where: { category_id: parseInt(id) },
            data: { is_hide: is_hide }
        });
        await prisma.product.updateMany({
            where: { category_id: parseInt(id) },
            data: { is_hide: is_hide }
        });

        if (parent_id) {
            if (parseInt(parent_id) === parseInt(id)) {
                return get_error_response(
                    ERROR_CODES.CATEGORY_PARENT_SELF,
                    STATUS_CODE.BAD_REQUEST,
                );
            }
            const loop = await isDescendant(parseInt(id), parseInt(parent_id));
            if (loop) {
                return get_error_response(
                    ERROR_CODES.CATEGORY_PARENT_LOOP,
                    STATUS_CODE.BAD_REQUEST,
                );
            }
        }
        let attributes = []
        // 3. Nếu có attribute_id, kiểm tra và cập nhật vào bảng attribute_category
        if (attribute_id && Array.isArray(attribute_id) && attribute_id.length > 0) {
            // Kiểm tra các attribute_id có tồn tại không
            const existingAttributes = await prisma.attribute.findMany({
                where: {
                    id: {
                        in: attribute_id.map(id => parseInt(id))
                    }
                }
            });
            if (existingAttributes.length !== attribute_id.length) {
                return get_error_response(
                    ERROR_CODES.INVALID_INPUT,
                    STATUS_CODE.BAD_REQUEST,
                );
            }

            // Xóa hết các attribute_category cũ của category này
            await prisma.attribute_category.deleteMany({
                where: { category_id: parseInt(id) }
            });

            // Tạo lại các attribute_category mới
            const attributeCategoryData = attribute_id.map(attrId => ({
                category_id: parseInt(id),
                attribute_id: parseInt(attrId)
            }));

            await prisma.attribute_category.createMany({
                data: attributeCategoryData
            });
            attributes = existingAttributes
        }

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            {
                ...updatedCategory,
                attributes: attributes
            }
        );
    } catch (error) {
        console.error('Error updating category:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
        );
    }
}
//Xóa mềm danh mục và các danh mục con, 
//nếu các bảng liên quan như product và blog đang có category_id sẽ được "hiển thị thông báo với quản trị viên 
//id_category đang dùng cho bảng product và blog "nếu quản trị viên xác nhận" thì cập nhật category_id = null 
// => là sản phẩm hoặc bài viết sẽ ko còn liên quan gì tới category nữa
const deletedSoftCategoriesService = async (id, forceDelete = false) => {
    try {
        const categoryId = parseInt(id);

        // 1. Kiểm tra danh mục có tồn tại không
        const category = await prisma.categories.findUnique({
            where: { category_id: categoryId }
        });

        if (!category) {
            return get_error_response(
                ERROR_CODES.CATEGORY_NOT_FOUND,
                STATUS_CODE.NOT_FOUND
            );
        }

        // 2. Lấy tất cả danh mục con đệ quy
        const getAllChildCategories = async (parentId) => {
            const children = await prisma.categories.findMany({
                where: { parent_id: parentId }
            });

            let allChildren = [...children];
            for (const child of children) {
                const grandChildren = await getAllChildCategories(child.category_id);
                allChildren = [...allChildren, ...grandChildren];
            }
            return allChildren;
        };

        const allChildren = await getAllChildCategories(categoryId);
        const allIdsToDelete = [categoryId, ...allChildren.map(c => c.category_id)];

        // 3. Kiểm tra xem có product hoặc blog nào đang dùng các category này không
        const productsUsingCategory = await prisma.product.findMany({
            where: {
                category_id: { in: allIdsToDelete }
            },
            select: { id: true, name: true }
        });

        const blogsUsingCategory = await prisma.blog.findMany({
            where: {
                category_id: { in: allIdsToDelete }
            },
            select: { id: true, title: true }
        });

        // Nếu đang có liên kết và không được xác nhận force delete
        if (!forceDelete && (productsUsingCategory.length > 0 || blogsUsingCategory.length > 0)) {
            return get_error_response(
                ERROR_CODES.CATEGORY_IN_PRODUCT_OR_BLOG,
                STATUS_CODE.CONFLICT,
                {
                    products: productsUsingCategory,
                    blogs: blogsUsingCategory
                }
            );
        }

        // 4. Nếu xác nhận xóa thì cập nhật id_category của product và blog về null
        if (forceDelete) {
            await prisma.product.updateMany({
                where: {
                    category_id: { in: allIdsToDelete }
                },
                data: { category_id: null }
            });

            await prisma.blog.updateMany({
                where: {
                    category_id: { in: allIdsToDelete }
                },
                data: { category_id: null }
            });
        }

        // 5. Xóa mềm các danh mục (cập nhật deleted_at)
        await prisma.categories.updateMany({
            where: {
                category_id: { in: allIdsToDelete }
            },
            data: {
                deleted_at: getVietnamTimeNow()
            }
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            { message: "Xóa danh mục (và các danh mục con, các bảng liên quan) thành công!" }
        );
    } catch (error) {
        console.error('Error deleting category:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
};

//Xóa cứng luôn danh mục và các danh mục con, nếu các bảng liên quan đang dùng category_id 
// thì hiển thị thông báo danh mục này đang được dùng và không thể xóa
const deletedCategoriesService = async (id) => {
    try {
        // 1. Kiểm tra xem category có tồn tại không
        const category = await prisma.categories.findUnique({
            where: { category_id: parseInt(id) }
        });

        if (!category) {
            return get_error_response(
                ERROR_CODES.CATEGORY_NOT_FOUND,
                STATUS_CODE.NOT_FOUND
            );
        }

        // 2. Kiểm tra xem category có danh mục con không
        const childCategories = await prisma.categories.findMany({
            where: {
                parent_id: parseInt(id),
                deleted_at: null
            }
        });

        if (childCategories.length > 0) {
            return get_error_response(
                ERROR_CODES.CATEGORY_HAS_CHILDREN,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        // 3. Kiểm tra xem category có được sử dụng trong bảng product không
        const productCount = await prisma.product.count({
            where: { category_id: parseInt(id) }
        });

        if (productCount > 0) {
            return get_error_response(
                ERROR_CODES.CATEGORY_IN_PRODUCT,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        // 4. Kiểm tra xem category có được sử dụng trong bảng blog không
        const blogCount = await prisma.blog.count({
            where: { category_id: parseInt(id) }
        });

        if (blogCount > 0) {
            return get_error_response(
                ERROR_CODES.CATEGORY_IN_BLOG,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        // 5. Xóa tất cả các bản ghi trong attribute_category liên quan đến category này
        await prisma.attribute_category.deleteMany({
            where: { category_id: parseInt(id) }
        });

        // 6. Xóa category
        await prisma.categories.delete({
            where: { category_id: parseInt(id) }
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            { message: "Xóa danh mục thành công!" }
        );
    } catch (error) {
        console.error('Error deleting category:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
        );
    }
}

//Khôi phục danh mục và các danh mục con, nếu khôi phục danh mục con thì cập nhật deleted_at = null cho các danh mục con
//Còn product và blog vẫn category_id vẫn là = null, phải tự động cập nhật lại.
const restoreCategoriesService = async (id) => {
    try {
        // 1. Kiểm tra xem category có tồn tại không
        const category = await prisma.categories.findUnique({
            where: { category_id: parseInt(id) }
        });

        if (!category) {
            return get_error_response(
                ERROR_CODES.CATEGORY_NOT_FOUND,
                STATUS_CODE.NOT_FOUND
            );
        }

        // 2. Tìm tất cả các danh mục con
        const getAllChildCategories = async (parentId) => {
            const children = await prisma.categories.findMany({
                where: { parent_id: parentId }
            });

            let allChildren = [...children];
            for (const child of children) {
                const grandChildren = await getAllChildCategories(child.category_id);
                allChildren = [...allChildren, ...grandChildren];
            }
            return allChildren;
        };
        // Lấy tất cả các danh mục con
        const allChildren = await getAllChildCategories(parseInt(id));

        // Tạo mảng chứa tất cả các ID cần khôi phục (bao gồm cả danh mục cha và các con)
        const allIdsToRestore = [parseInt(id), ...allChildren.map(child => child.category_id)];

        // 3. Cập nhật deleted_at = null cho tất cả các danh mục
        await prisma.categories.updateMany({
            where: {
                category_id: {
                    in: allIdsToRestore
                }
            },
            data: {
                deleted_at: null
            }
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            { message: "Khôi phục danh mục và các danh mục con thành công!" }
        );
    } catch (error) {
        console.error('Error restoring category:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
        );
    }
}

module.exports = {
    getCategoriesService,
    getCategoriesDetailService,
    createCategoriesService,
    updateCategoriesService,
    deletedSoftCategoriesService,
    deletedCategoriesService,
    restoreCategoriesService
};

