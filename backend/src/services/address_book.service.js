const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { executeSelectData } = require('../helpers/sql_query')
const { get_error_response } = require('../helpers/response.helper');
const { PrismaClient } = require('@prisma/client');
const { number } = require('zod');

const prisma = new PrismaClient();

function configDataAddressBook(dbResults) {
    if (!dbResults || dbResults.length === 0) {
        return {
            customer: null,
            address_books: []
        }
    }

    // Lấy thông tin customer từ bản ghi đầu tiên
    const firstRecord = dbResults[0]
    const surname = firstRecord.customer_surname + ' ' || ''
    const customer = {
        id: firstRecord.customer_id,
        name: surname + firstRecord.customer_name,
        phone: firstRecord.customer_phone,
        email: firstRecord.customer_email
    }

    // Chuyển đổi danh sách địa chỉ
    const address_books = dbResults.map(record => ({
        id: record.id,
        receiver_name: record.receiver_name,
        phone: record.phone,
        district: record.district,
        city: record.city,
        ward: record.ward,
        street: record.street,
        detail: record.detail,
        is_default: record.is_default,
        created_at: record.created_at,
        updated_at: record.updated_at,
        deleted_at: record.deleted_at
    }))

    return {
        customer,
        address_books
    }
}

const getAddressBookService = async (id) => {
    // Các cột cần lấy từ address_book và customer
    let get_attr = `address_book.customer_id, address_book.receiver_name, address_book.phone, city, district, ward, street, detail, is_default, customer.id as customer_id, customer.lastname as customer_name, customer.surname as customer_surname, customer.phone as customer_phone, customer.email as customer_email`

    let get_table = `address_book`

    let query_join = `LEFT JOIN customer ON address_book.customer_id = customer.id`

    // Điều kiện lọc theo customer_id và deleted_at is null
    let filter = `[{"field":"address_book.customer_id","condition":"=","value":"${id}"}]`

    try {
        const addressBooks = await executeSelectData({
            table: get_table,
            strGetColumn: get_attr,
            filter: filter,
            queryJoin: query_join,
            configData: configDataAddressBook,
        })

        return get_error_response(
            errors = ERROR_CODES.SUCCESS,
            status_code = STATUS_CODE.OK,
            data = addressBooks
        );
    } catch (error) {
        console.error('Error in getAddressBookService:', error);
        return get_error_response(
            errors = ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code = STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const getDetailAddressBookService = async (id) => {
    try {
        // Chuyển đổi id từ chuỗi sang số nguyên
        const addressId = Number(id);
        
        if (isNaN(addressId)) {
            return get_error_response(
                errors=ERROR_CODES.ADDRESS_BOOK_ID_REQUIRED,
                status_code=STATUS_CODE.BAD_REQUEST,
                data="Invalid address ID format"
            );
        }

        const addressBook = await prisma.address_book.findUnique({
            where: { id: addressId }
        });

        if (!addressBook) {
            return get_error_response(
                errors=ERROR_CODES.ADDRESS_BOOK_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        return get_error_response(
            ERROR_CODES.SUCCESS,
            STATUS_CODE.OK,
            addressBook
        );
    } catch (error) {
        console.error('Error in getAddressBookDetailService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const createAddressBookService = async (customer_id, receiver_name, phone, district, city, ward, street, detail, is_default) => {
    try {
        // Chuyển đổi is_default sang kiểu boolean
        const isDefaultBoolean = is_default === "true" || is_default === true;

        // Nếu đang tạo địa chỉ mặc định, cập nhật các địa chỉ khác thành không mặc định
        if (isDefaultBoolean) {
            await prisma.address_book.updateMany({
                where: {
                    customer_id: customer_id,
                    deleted_at: null
                },
                data: {
                    is_default: false,
                    updated_at: new Date()
                }
            });
        }

        const addressBook = await prisma.address_book.create({
            data: {
                customer_id,
                receiver_name,
                phone,
                district,
                city,
                ward,
                street,
                detail,
                is_default: isDefaultBoolean,
                created_at: new Date(),
                updated_at: new Date()
            }
        });

        return get_error_response(
            errors = ERROR_CODES.SUCCESS,
            status_code = STATUS_CODE.CREATED,
            data = addressBook
        );
    }
    catch (error) {
        console.error('Error in createAddressBookService:', error);
        return get_error_response(
            errors = ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code = STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const updateAddressBookService = async (customer_id, id, receiver_name, phone, district, city, ward, street, detail, is_default) => {
    try {
        const addressId = parseInt(id);

        if (isNaN(addressId)) {
            return get_error_response(
                errors = ERROR_CODES.BAD_REQUEST,
                status_code = STATUS_CODE.BAD_REQUEST,
                data = "Invalid address ID format"
            );
        }

        // Kiểm tra địa chỉ tồn tại
        const existingAddress = await prisma.address_book.findFirst({
            where: {
                id: addressId,
                customer_id: customer_id,
                deleted_at: null
            }
        });

        if (!existingAddress) {
            return get_error_response(
                errors=ERROR_CODES.NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND,
                data="Address not found or was deleted"
            );
        }

        const isDefaultBoolean = is_default === "true" || is_default === true;

        if (isDefaultBoolean) {
            try {
                await prisma.address_book.updateMany({
                    where: {
                        customer_id: customer_id,
                        id: { not: addressId },
                        deleted_at: null
                    },
                    data: {
                        is_default: false,
                        updated_at: new Date()
                    }
                });
            } catch (error) {
                console.error('Error updating other addresses:', error);
                return get_error_response(
                    errors=ERROR_CODES.INTERNAL_SERVER_ERROR,
                    status_code=STATUS_CODE.INTERNAL_SERVER_ERROR,
                    data="Failed to update other addresses"
                );
            }
        }

        try {
            const addressBook = await prisma.address_book.update({
                where: { 
                    id: addressId,
                    customer_id: customer_id,
                    deleted_at: null
                },
                data: { 
                    district, 
                    city, 
                    ward, 
                    street, 
                    detail, 
                    receiver_name,
                    phone,
                    is_default: isDefaultBoolean,
                    updated_at: new Date()
                }
            });

            return get_error_response(
                errors=ERROR_CODES.SUCCESS,
                status_code=STATUS_CODE.OK,
                data=addressBook
            );
        } catch (error) {
            console.error('Error updating address:', error);
            if (error.code === 'P2025') {
                return get_error_response(
                    errors=ERROR_CODES.NOT_FOUND,
                    status_code=STATUS_CODE.NOT_FOUND,
                    data="Address not found"
                );
            }
            return get_error_response(
                errors=ERROR_CODES.INTERNAL_SERVER_ERROR,
                status_code=STATUS_CODE.INTERNAL_SERVER_ERROR,
                data="Failed to update address"
            );
        }
    } catch (error) {
        console.error('Error in updateAddressBookService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const deleteAddressBookService = async (customer_id, id) => {
    try {
        // Chuyển đổi id từ chuỗi sang số nguyên
        const addressId = parseInt(id);

        if (isNaN(addressId)) {
            return get_error_response(
                errors = ERROR_CODES.BAD_REQUEST,
                status_code = STATUS_CODE.BAD_REQUEST,
                data = "Invalid address ID format"
            );
        }

        // Kiểm tra xem địa chỉ cần xóa có phải là địa chỉ mặc định không
        const addressToDelete = await prisma.address_book.findUnique({
            where: { id: addressId }
        });

        if (addressToDelete?.is_default) {
            // Tìm địa chỉ mới nhất (không bao gồm địa chỉ đang xóa)
            const newestAddress = await prisma.address_book.findFirst({
                where: {
                    customer_id: customer_id,
                    id: { not: addressId },
                    deleted_at: null
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            // Nếu còn địa chỉ khác, đặt địa chỉ đó làm mặc định
            if (newestAddress) {
                await prisma.address_book.update({
                    where: { id: newestAddress.id },
                    data: {
                        is_default: true,
                        updated_at: new Date()
                    }
                });
            }
        }

        // Xóa địa chỉ
        await prisma.address_book.delete({
            where: { id: addressId, customer_id: customer_id }
        });

        return get_error_response(
            errors = ERROR_CODES.SUCCESS,
            status_code = STATUS_CODE.OK,
            data = "Address book deleted successfully"
        );
    }
    catch (error) {
        console.error('Error in deleteAddressBookService:', error);
        return get_error_response(
            errors = ERROR_CODES.INTERNAL_SERVER_ERROR,
            status_code = STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    getAddressBookService,
    getDetailAddressBookService,
    createAddressBookService,
    updateAddressBookService,
    deleteAddressBookService
};
