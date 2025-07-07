export const ORDER_STATUS = {
    PENDING_PAYMENT: -2, // Chờ thanh toán
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


export const PRODUCT_STATUS = {
    STOP_SELLING: -1,
    SOLD_OUT: 0, 
    ACTIVE: 1,
    DISCOUNT: 2,
    FETURED: 3,
    NEW: 4,
    PRE_ORDER: 5
}

export const DEVICE_STATUS = {
    IN_PROGRESS: 0,
    TESTING: 1,
    QC: 2,
    PRODUCTION: 3,
    COMPLETED: 4,
    CANCELLED: 5
}