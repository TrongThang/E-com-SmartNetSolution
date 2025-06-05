export const ORDER_STATUS = {
    CANCELLED: -1, // Đã huỷ
    PENDING  : 0, // Chờ xác nhận
    PREPARING: 1,  // Đã xác nhận và đang chuẩn bị hàng
    SHIPPING : 2,  // Đang giao hàng
    DELIVERED: 3,  // Đã giao hàng
    COMPLETED: 4,  // Hoàn thành
    RETURNED : 5,  // Trả hàng
    EXCHANGED: 6,  // Đổi hàng
    REFUNDED : 7   // Hoàn tiền
}