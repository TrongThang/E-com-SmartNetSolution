const { STATUS_CODE } = require("../contants/errors");
const { get_error_response } = require("./response.helper");

function validateNumber(
    number,
    start = 0,
    end = null,
    error_invalid = null,
    error_less = null,
    error_max = null,
) {
    let num = parseFloat(number);
    if (isNaN(num)) {
        return get_error_response(error_invalid, STATUS_CODE.BAD_REQUEST);
    }

    if (num < start) {
        return get_error_response(error_less || error_invalid, STATUS_CODE.BAD_REQUEST);
    }

    if (end !== null && num > end) {
        return get_error_response(error_max || error_invalid, STATUS_CODE.BAD_REQUEST);
    }

    return null;
}

module.exports = {
    validateNumber,
};