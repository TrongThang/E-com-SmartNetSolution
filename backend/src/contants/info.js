ROLE = {
    ADMIN: 1,
    EMPLOYEE_WAREHOUSE: 3,
    MANAGER_WAREHOUSE: 2,
    SHIPPER: 4,
}

PRODUCT = {
    STOP_SELLING: -1,
    SOLD_OUT: 0, 
    ACTIVE: 1,
    DISCOUNT: 2,
    FETURED: 3,
    NEW: 4,
}

ORDER = {
    CANCELLED: -1, // Đã huỷ
    PENDING  : 0, // Chờ xác nhận
    PREPARING: 1,  // Đã xác nhận và đang chuẩn bị hàng
    PENDING_SHIPPING: 2, // Chờ giao hàng
    SHIPPING : 3,  // Đang giao hàng
    DELIVERED: 4,  // Đã giao hàng
    COMPLETED: 5,  // Hoàn thành
    RETURNED : 6,  // Trả hàng
    EXCHANGED: 7,  // Đổi hàng
    REFUNDED : 8   // Hoàn tiền
}

IMPORT_WAREHOUSE = {
    PENDING: 0, // Chờ thực hiện
    IMPORTING: 1,
    COMPLETED: 2,
    CANCELLED: 3
}

EXPORT_WAREHOUSE = {
    PENDING: 0, // Chờ thực hiện
    PROCESSING: 1,
    COMPLETED: 2,
    CANCELLED: 3
}

module.exports = {
    ROLE, PRODUCT, ORDER, IMPORT_WAREHOUSE, EXPORT_WAREHOUSE
}