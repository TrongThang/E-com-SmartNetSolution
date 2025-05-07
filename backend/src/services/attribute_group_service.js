const { get_error_response } = require('../helpers/response.helper');
const { executeSelectData } = require('../helpers/sql_query');
const { ERROR_CODES, STATUS_CODE } = require('../contants/errors');
const { getVietnamTimeNow } = require('../helpers/time.helper');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//Lấy danh sách nhóm thuộc tính và thuộc tính thuộc nhóm thuộc tính và lọc theo deleted_at = null
const getAttributeGroupService = async (filter, limit, sort, order) => {
    try {
        const get_attr = "attribute_group.id, attribute_group.name, attribute_group.created_at, attribute_group.updated_at, attribute.id as attribute_id, attribute.name as attribute_name, attribute.datatype, attribute.required, attribute.is_hide";

        const get_table = 'attribute_group';
        const query_join = "LEFT JOIN attribute ON attribute.group_attribute_id = attribute_group.id AND attribute.deleted_at IS NULL";
        const filter = JSON.stringify([
            {
                field: "attribute_group.deleted_at",
                condition: "IS",
                value: "NULL"
            }
        ]);

        const result = await executeSelectData({
            strGetColumn: get_attr,
            table: get_table,
            queryJoin: query_join,
            filter: filter,
            limit: limit,
            sort: sort,
            order: order
        });

        // Group attributes by attribute group
        const attributeGroups = {};
        result.data.forEach(item => {
            if (!attributeGroups[item.id]) {
                attributeGroups[item.id] = {
                    id: item.id,
                    name: item.name,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                    attributes: []
                };
            }

            if (item.attribute_id) {
                attributeGroups[item.id].attributes.push({
                    id: item.attribute_id,
                    name: item.attribute_name,
                    datatype: item.datatype,
                    required: item.required,
                    is_hide: item.is_hide
                });
            }
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            Object.values(attributeGroups)
        );
    } catch (error) {
        console.error('Error in getAttributeGroups:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            null,
            error.message
        );
    }
};

//Lấy thông tin chi tiết nhóm thuộc tính bao gồm cả thuộc tính thuộc nhóm thuộc tính
const getAttributeGroupDetailsService = async (id) => {
    try {
        const get_attr = "attribute_group.id, attribute_group.name, attribute_group.created_at, attribute_group.updated_at, attribute.id as attribute_id, attribute.name as attribute_name, attribute.datatype, attribute.required, attribute.is_hide";

        const get_table = 'attribute_group';
        const query_join = "LEFT JOIN attribute ON attribute.group_attribute_id = attribute_group.id AND attribute.deleted_at IS NULL";
        const filter = JSON.stringify([
            {
                field: "attribute_group.deleted_at",
                condition: "IS",
                value: "NULL"
            },
            {
                field: "attribute_group.id",
                condition: "=",
                value: id
            }
        ]);

        const result = await executeSelectData({
            strGetColumn: get_attr,
            table: get_table,
            queryJoin: query_join,
            filter: filter
        });

        if (!result.data || result.data.length === 0) {
            return get_error_response(
                ERROR_CODES.NOT_FOUND,
                STATUS_CODE.NOT_FOUND,
                null,
                "Attribute group not found"
            );
        }

        // Group attributes by attribute group
        const attributeGroup = {
            id: result.data[0].id,
            name: result.data[0].name,
            created_at: result.data[0].created_at,
            updated_at: result.data[0].updated_at,
            attributes: []
        };

        result.data.forEach(item => {
            if (item.attribute_id) {
                attributeGroup.attributes.push({
                    id: item.attribute_id,
                    name: item.attribute_name,
                    datatype: item.datatype,
                    required: item.required,
                    is_hide: item.is_hide
                });
            }
        });

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            attributeGroup
        );
    } catch (error) {
        console.error('Error in getAttributeGroupDetails:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            null,
            error.message
        );
    }
};

//Tạo nhóm thuộc tính và thuộc tính
const createAttributeGroupService = async (name, attributes) => {
    try {

        const existed = await prisma.attribute_group.findFirst({
            where: {
                name
            }
        });
        if (existed) {
            return get_error_response(
                ERROR_CODES.ATTRIBUTE_GROUP_NAME_EXISTED,
                STATUS_CODE.BAD_REQUEST
            )
        }
        // Kiểm tra trùng tên thuộc tính trong cùng nhóm
        if (attributes && attributes.length > 0) {
            const attributeNames = attributes.map(attr => attr.name);
            const uniqueNames = new Set(attributeNames);
            if (attributeNames.length !== uniqueNames.size) {
                return get_error_response(
                    ERROR_CODES.ATTRIBUTE_NAME_DUPLICATE,
                    STATUS_CODE.BAD_REQUEST
                );
            }

            // Kiểm tra trùng tên thuộc tính với các nhóm khác
            for (const attr of attributes) {
                const existedAttribute = await prisma.attribute.findFirst({
                    where: {
                        name: attr.name,
                        deleted_at: null
                    }
                });

                if (existedAttribute) {
                    return get_error_response(
                        ERROR_CODES.ATTRIBUTE_NAME_EXISTED,
                        STATUS_CODE.BAD_REQUEST
                    );
                }
            }
        }

        // Tạo nhóm thuộc tính
        const attributeGroup = await prisma.attribute_group.create({
            data: {
                name: name,
                created_at: getVietnamTimeNow()
            }
        });

        // Nếu có dữ liệu thuộc tính thì thêm vào
        if (attributes && attributes.length > 0) {
            // Tạo mảng dữ liệu thuộc tính với group_attribute_id
            const attributesData = attributes.map(attr => ({
                name: attr.name,
                datatype: attr.datatype,
                required: attr.required || false,
                is_hide: attr.is_hide || false,
                group_attribute_id: attributeGroup.id,
                created_at: getVietnamTimeNow()
            }));

            // Thêm các thuộc tính
            await prisma.attribute.createMany({
                data: attributesData
            });

            // Lấy lại thông tin đầy đủ của nhóm thuộc tính và các thuộc tính
            const groupWithAttributes = await prisma.attribute_group.findUnique({
                where: { id: attributeGroup.id },
                include: {
                    attribute: {
                        where: { deleted_at: null }
                    }
                }
            });

            return get_error_response(
                ERROR_CODES.SUCCESS,
                STATUS_CODE.OK,
                groupWithAttributes
            );
        }

        // Nếu không có thuộc tính, trả về chỉ nhóm thuộc tính
        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            attributeGroup
        );

    } catch (error) {
        console.error('Error in createAttributeGroup:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            null,
            error.message
        );
    }
};
//Cập nhật nhóm thuộc tính và thuộc tính
const updateAttributeGroupService = async (id, name, attributes) => {
    try {
        const attributeGroup = await prisma.attribute_group.findFirst({
            where: { id: parseInt(id) }
        });

        if (!attributeGroup) {
            return get_error_response(
                ERROR_CODES.ATTRIBUTE_GROUP_NOT_FOUND,
                STATUS_CODE.NOT_FOUND
            );
        }

        const existed = await prisma.attribute_group.findFirst({
            where: {
                name,
                NOT: { id: parseInt(id) }
            }
        });
        if (existed) {
            return get_error_response(
                ERROR_CODES.ATTRIBUTE_GROUP_NAME_EXISTED,
                STATUS_CODE.BAD_REQUEST
            );
        }

        // Kiểm tra trùng tên thuộc tính trong cùng nhóm
        if (attributes && attributes.length > 0) {
            const attributeNames = attributes.map(attr => attr.name);
            const uniqueNames = new Set(attributeNames);
            if (attributeNames.length !== uniqueNames.size) {
                return get_error_response(
                    ERROR_CODES.ATTRIBUTE_NAME_DUPLICATE,
                    STATUS_CODE.BAD_REQUEST
                );
            }

            // Kiểm tra trùng tên thuộc tính với các nhóm khác
            for (const attr of attributes) {
                const existedAttribute = await prisma.attribute.findFirst({
                    where: {
                        name: attr.name,
                        group_attribute_id: {
                            not: parseInt(id)
                        }
                    }
                });

                if (existedAttribute) {
                    return get_error_response(
                        ERROR_CODES.ATTRIBUTE_NAME_EXISTED,
                        STATUS_CODE.BAD_REQUEST
                    );
                }
            }
        }

        if (attributes && attributes.length > 0) {
            // Lấy danh sách thuộc tính hiện có
            const existingAttributes = await prisma.attribute.findMany({
                where: { group_attribute_id: parseInt(id) }
            });

            // Tạo map để theo dõi thuộc tính cần cập nhật
            const existingAttributeMap = new Map(existingAttributes.map(attr => [attr.name, attr]));

            // Tạo mảng để lưu các thuộc tính cần xóa
            const attributesToDelete = [];
            // Tạo mảng để lưu các thuộc tính cần cập nhật
            const attributesToUpdate = [];
            // Tạo mảng để lưu các thuộc tính cần tạo mới
            const attributesToCreate = [];

            // Phân loại các thuộc tính
            for (const attr of attributes) {
                const existingAttr = existingAttributeMap.get(attr.name);
                if (existingAttr) {
                    // Thuộc tính đã tồn tại, cần cập nhật
                    attributesToUpdate.push({
                        where: { id: existingAttr.id },
                        data: {
                            name: attr.name,
                            datatype: attr.datatype,
                            required: attr.required || false,
                            is_hide: attr.is_hide || false,
                            updated_at: getVietnamTimeNow()
                        }
                    });
                } else {
                    // Thuộc tính mới, cần tạo
                    attributesToCreate.push({
                        name: attr.name,
                        datatype: attr.datatype,
                        required: attr.required || false,
                        is_hide: attr.is_hide || false,
                        group_attribute_id: parseInt(id),
                        created_at: getVietnamTimeNow()
                    });
                }
            }

            // Xác định các thuộc tính cần xóa (có trong DB nhưng không có trong input)
            for (const existingAttr of existingAttributes) {
                if (!attributes.some(attr => attr.name === existingAttr.name)) {
                    attributesToDelete.push(existingAttr.id);
                }
            }

            // Thực hiện các thao tác trong transaction
            await prisma.$transaction(async (tx) => {
                // Xóa các thuộc tính không còn sử dụng
                if (attributesToDelete.length > 0) {
                    await tx.attribute.deleteMany({
                        where: { id: { in: attributesToDelete } }
                    });
                }

                // Cập nhật các thuộc tính hiện có
                for (const update of attributesToUpdate) {
                    await tx.attribute.update(update);
                }

                // Tạo các thuộc tính mới
                if (attributesToCreate.length > 0) {
                    await tx.attribute.createMany({
                        data: attributesToCreate
                    });
                }
            });

            const groupWithAttributes = await prisma.attribute_group.findUnique({
                where: { id: parseInt(id) },
                include: {
                    attribute: {
                        where: { deleted_at: null }
                    }
                }
            });

            return get_error_response(
                ERROR_CODES.SUCCESS,
                STATUS_CODE.OK,
                groupWithAttributes
            );
        }
        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            attributeGroup
        );
    } catch (error) {
        console.error('Error in updateAttributeGroup:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        )
    }
}
//hàm khôi phục và xóa mềm nhóm thuộc tính và thuộc tính - nếu cha bị deleted thì các con cũng bị deleted
//ngược lại nếu cha bị khôi phục thì các con cũng được khôi phục
//isRestore là true thì khôi phục, false thì xóa mềm

const toggleDeleteRestoreAttributeGroupService = async (id, isRestore = false) => {
    try {
        const attributeGroup = await prisma.attribute_group.findFirst({
            where: { id: parseInt(id) }
        });
        if (!attributeGroup) {
            return get_error_response(
                ERROR_CODES.ATTRIBUTE_GROUP_NOT_FOUND,
                STATUS_CODE.NOT_FOUND
            );
        }

        const deletedAtValue = isRestore ? null : getVietnamTimeNow();

        // Cập nhật nhóm thuộc tính
        await prisma.attribute_group.update({
            where: { id: parseInt(id) },
            data: { deleted_at: deletedAtValue }
        });

        // Cập nhật các thuộc tính con
        await prisma.attribute.updateMany({
            where: { group_attribute_id: parseInt(id) },
            data: { deleted_at: deletedAtValue }
        });

        const message = isRestore ? "Khôi phục nhóm thuộc tính thành công" : "Xóa nhóm thuộc tính thành công";
        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            message
        );

    } catch (error) {
        console.error('Error in toggleDeleteAttributeGroup:', error);
        return get_error_response(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    getAttributeGroupService,
    getAttributeGroupDetailsService,
    createAttributeGroupService,
    updateAttributeGroupService,
    toggleDeleteRestoreAttributeGroupService,
};

