const { ERROR_MESSAGES } = require("../contants/errors.js");

const { ERROR_CODES, MESSAGES } =  import("../contants/errors.js");

// export default function get_error_response (errorCode, status_code = 200, result = null, fieldError = null) {
//     // Xử lý thông điệp lỗi
//     const fieldErrorMessage = fieldError || '';
//     const errorName = Object.keys(ERROR_CODES).find(key => ERROR_CODES[key] === errorCode);
//     const message = fieldErrorMessage + (errorName && MESSAGES[errorName] ? MESSAGES[errorName] : 'Lỗi không xác định');

//     // Trả về object JSON
//     return res.status(status_code).json({
//         error: errorCode,
//         message: message,
//         data: result
//     });
// }

function get_error_response(errors = null, status_code = 200, data = null, fieldError = null) {
    let errorList = [];

    // Nếu truyền vào là một mảng lỗi
    if (Array.isArray(errors)) {
        errorList = errors.map(({ errorCode, fieldError }) => {
            const errorName = Object.keys(ERROR_CODES).find(key => ERROR_CODES[key] === errorCode);
            const message = (fieldError || '') + (errorName && MESSAGES[errorName] ? MESSAGES[errorName] : 'Lỗi không xác định');
            return { error: errorCode, message };
        });
    } 
    // Nếu truyền vào là một lỗi đơn lẻ
    else if (errors) {
        console.log('Chuẩn bị convert lỗi đơn lẻ:', ERROR_MESSAGES[errors]);
        
        const errorCode = errors;
        const message = (fieldError || '') + ERROR_MESSAGES[errorCode]
        errorList.push({ error: errors, message });
    }

    // Trả về object JSON (không dùng res ở đây, để controller xử lý)
    let result = {
        status_code: status_code,
        ...(data && { data }), // Chỉ thêm data nếu nó tồn tại
        ...(errorList.length > 0 && { errors: errorList }), // Chỉ thêm errors nếu có lỗi
    };
    console.log('Chuẩn bị trả về lỗi:', result);
    return result
}


module.exports = {
    get_error_response
}