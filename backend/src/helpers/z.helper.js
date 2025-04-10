const { z } = require('zod');

/**
 * Trả về một z.string().min(1) kèm thông báo và mã lỗi tùy chỉnh
 */
function zRequiredString(message, code) {
    return z.string().min(1, {
        message,
        params: { code_error: code },
    });
}

/**
 * Trả về một z.number().optional(), nhưng nếu cần required thì dùng zRequiredNumber
 */
function zRequiredNumber(message, code) {
    return z.number({
        required_error: message,
        invalid_type_error: message,
    }).refine(val => typeof val === 'number', {
        message,
        params: { code },
    });
}

module.exports = {
    zRequiredString,
    zRequiredNumber,
};
