/**
 * Format a number as Vietnamese currency (VND)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date))
}

export function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
};

export function removeVietnameseTones(str) {
    return str
        .normalize("NFD")                    // chuyển thành tổ hợp ký tự (dấu tách riêng)
        .replace(/[\u0300-\u036f]/g, "")     // xoá các dấu
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
};
