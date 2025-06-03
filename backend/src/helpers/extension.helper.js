const removeTagHtml = (str) => {    
    return str.replace(/(<([^>]+)>)/gi, '');
}

const convertToSlug = (str) => {
    // Chuyển chuỗi về dạng không dấu
    str = str
        .normalize("NFD") // Chuẩn hóa Unicode, tách ký tự thành ký tự cơ bản và dấu
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các ký hiệu dấu
        .replace(/[đĐ]/g, "d"); // Thay thế "đ" và "Đ" thành "d"

    // Chuyển thành slug
    return str
        .toLowerCase() // Chuyển thành chữ thường
        .replace(/[^a-z0-9]+/g, '-') // Thay thế tất cả ký tự không phải chữ cái hoặc số bằng dấu gạch ngang
        .replace(/-+/g, '-') // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu
        .replace(/^-+|-+$/g, ''); // Loại bỏ dấu gạch ngang ở đầu và cuối
};

module.exports = {
    removeTagHtml,
    convertToSlug
}