const { ERROR_MESSAGES } = require("../contants/errors.js");

const { ERROR_CODES, MESSAGES } =  import("../contants/errors.js");

///
// Hàm này dùng để tạo ra một response lỗi cho API
// Dùng cho cả lỗi đơn lẻ và lỗi nhiều
// Nếu truyền vào là một mảng lỗi thì nó sẽ convert thành một mảng các lỗi
// Nếu truyền vào là một lỗi đơn lẻ thì nó sẽ convert thành một lỗi duy nhất
// Nếu không truyền vào lỗi nào thì nó sẽ trả về một lỗi mặc định
// Nếu không truyền vào status_code thì nó sẽ trả về 200
// Nếu không truyền vào data thì nó sẽ không trả về data
// Nếu không truyền vào fieldError thì nó sẽ không trả về fieldError
// Nếu không truyền vào message thì nó sẽ không trả về message
// Nếu không truyền vào errorCode thì nó sẽ không trả về errorCode
///
function get_error_response(errors = null, status_code = 200, data = null, fieldErrors = null) {
    let errorList = [];

    // Nếu truyền vào là một mảng lỗi
    if (Array.isArray(errors)) {
        errorList = errors.map(({ errorCode, fieldError }) => {
            const errorName = Object.keys(ERROR_CODES).find(key => ERROR_CODES[key] === errorCode);
            const message = (fieldError || '') + (errorName && MESSAGES[errorName] ? MESSAGES[errorName] : 'Lỗi không xác định');
            return { code: errorCode, message };
        });
    } 
    // Nếu truyền vào là một lỗi đơn lẻ
    else if (errors) {
        console.log('Chuẩn bị convert lỗi đơn lẻ:', ERROR_MESSAGES[errors]);
        
        const errorCode = errors;
        const message = (fieldError || '') + ERROR_MESSAGES[errorCode]
        errorList.push({ code: errors, message });
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