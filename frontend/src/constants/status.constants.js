export const ORDER_STATUS = {
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