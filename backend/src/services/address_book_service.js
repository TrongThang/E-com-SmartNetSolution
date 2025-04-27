const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAddressBookService = async (id) => {
    try {
        const addressBooks = await prisma.address_book.findMany({
            where: {
                customer_id: id,
                deleted_at: null
            }
        });

        return get_error_response(
            errors=ERROR_CODES.SUCCESS, 
            status_code=STATUS_CODE.OK, 
            data=addressBooks
        );
    } catch (error) {
        console.error('Error in getAddressBookService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR, 
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const createAddressBookService = async (customer_id, district, city, ward, street, detail, is_default) => {
    try {
        // Convert is_default to boolean
        const isDefaultBoolean = is_default === "true" || is_default === true;
        
        // If this is a default address, update other addresses to non-default
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
            errors=ERROR_CODES.SUCCESS, 
            status_code=STATUS_CODE.OK, 
            data=addressBook
        );
    }
    catch (error) {
        console.error('Error in createAddressBookService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR, 
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const updateAddressBookService = async (customer_id, id, district, city, ward, street, detail, is_default) => {
    try {
        // Convert id from string to integer
        const addressId = parseInt(id);
        
        if (isNaN(addressId)) {
            return get_error_response(
                errors=ERROR_CODES.BAD_REQUEST,
                status_code=STATUS_CODE.BAD_REQUEST,
                data="Invalid address ID format"
            );
        }

        // Convert is_default to boolean
        const isDefaultBoolean = is_default === "true" || is_default === true;

        // If this is being set as default address, update other addresses to non-default
        if (isDefaultBoolean) {
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
        }

        const addressBook = await prisma.address_book.update({
            where: { 
                id: addressId, 
                customer_id: customer_id 
            },
            data: { 
                district, 
                city, 
                ward, 
                street, 
                detail, 
                is_default: isDefaultBoolean,
                updated_at: new Date()
            }
        });

        return get_error_response(
            errors=ERROR_CODES.SUCCESS, 
            status_code=STATUS_CODE.OK, 
            data=addressBook
        );
    }
    catch (error) {
        console.error('Error in updateAddressBookService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR, 
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}
const deleteAddressBookService = async (customer_id, id) => {
    try {
        // Convert id from string to integer
        const addressId = parseInt(id);
        
        if (isNaN(addressId)) {
            return get_error_response(
                errors=ERROR_CODES.BAD_REQUEST,
                status_code=STATUS_CODE.BAD_REQUEST,
                data="Invalid address ID format"
            );
        }

        // Check if the address to be deleted is default
        const addressToDelete = await prisma.address_book.findUnique({
            where: { id: addressId }
        });

        if (addressToDelete?.is_default) {
            // Find the newest address (excluding the one being deleted)
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

            // If there's another address, set it as default
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

        // Delete the address
        await prisma.address_book.delete({
            where: { id: addressId, customer_id: customer_id }
        });

        return get_error_response(
            errors=ERROR_CODES.SUCCESS, 
            status_code=STATUS_CODE.OK, 
            data="Address book deleted successfully"
        );
    }
    catch (error) {
        console.error('Error in deleteAddressBookService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR, 
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    getAddressBookService,
    createAddressBookService,
    updateAddressBookService,
    deleteAddressBookService
};
