const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    BAD_GATEWAY: 502,
    NOT_ACCEPTABLE: 406,
    UNPROCESSABLE_ENTITY: 422,
    PRECONDITION_FAILED: 412,
    TOO_MANY_REQUESTS: 429,
}

const ERROR_CODES = {
    SUCCESS: 0,
    INTERNAL_SERVER_ERROR: 500,
    SHARED_NUMBER_RANGE_100_INVALID: 1,
    SHARED_PHONE_INVALID: 2,
    SHARED_EMAIL_INVALID: 3,
    SHARED_NOT_NUMBER: 4,
    SHARED_PREPAID_INVALID: 5,
    SHARED_REMAINING_INVALID: 6,
    SHARED_TOTAL_MONEY_INVALID: 7,
    EMAIL_SEND_FAILED: 8,

    // DEVICE - 1xxx
    DEVICE_DEVICE_NOT_FOUND: 1001,
    DEVICE_DEVICE_NON_ACTIVE: 1002,
    DEVICE_CREATE_FAILED: 1003,
    DEVICE_UPDATED_FAILED: 1004,
    DEVICE_DELETED_FAILED: 1005,
    DEVICE_NAME_EXISTED: 1006,
    DEVICE_NAME_REQUIRED: 1007,
    DEVICE_NAME_TOO_LONG: 1008,
    DEVICE_PRICE_INVALID: 1009,
    DEVICE_CATEGORY_REQUIRED: 1010,
    DEVICE_UNIT_REQUIRED: 1011,
    DEVICE_ATTRIBUTE_REQUIRED: 1012,
    DEVICE_ID_REQUIRED: 1013,
  
    // ATTRIBUTE - 2xxx
    ATTRIBUTE_SUCCESS: 1000,
    ATTRIBUTE_NOT_FOUND: 1001,
    ATTRIBUTE_NAME_EXISTED: 2,
  
    // CATEGORY - 3xxx
    CATEGORY_NOT_FOUND: 1,
  
    // UNIT - 4xxx
    UNIT_NOT_FOUND: 1,
  
    // WARRANTY_TIME - 5xxx
    WARRANTY_TIME_NOT_FOUND: 1,
  
    // ORDER - 6xxx
    ORDER_SUCCESS: 6000,
    ORDER_NOT_FOUND: 6001,
    ORDER_CREATE_FAILED: 6002,
    ORDER_UPDATED_FAILED: 6003,
    ORDER_DELETED_FAILED: 6004,
    ORDER_SALE_PRICE_NOT_SAME: 6005,
    ORDER_IMPORT_PRICE_NOT_SAME: 6006,
    ORDER_AMOUNT_IS_LIMIT: 6007,
    ORDER_QUANTITY_IS_LIMIT: 6008,
    ORDER_INFO_DEVICES_IS_CHANGED: 6009,
    ORDER_TOTAL_IMPORT_NOT_NUMBER: 6010,
    ORDER_TOTAL_MONEY_NOT_NUMBER: 6011,
    ORDER_AMOUNT_NOT_NUMBER: 6012,
    ORDER_PREPAID_NOT_NUMBER: 6013,
    ORDER_DISCOUNT_NOT_NUMBER: 6014,
    ORDER_VAT_NOT_NUMBER: 6015,
    ORDER_TOTAL_MONEY_NOT_SAME: 6016,
    ORDER_PROFIT_NOT_SAME: 6016,
  
    // PAYMENT - 7xxx
    PAYMENT_FAILED: 7001,
    PAYMENT_INVALID_METHOD: 7008,
    PAYMENT_INTERNAL_ERROR: 7009,
  
    // WAREHOUSE - 8xxx
    WAREHOUSE_SUCCESS: 8000,
    WAREHOUSE_NOT_FOUND: 8001,
    WAREHOUSE_NAME_EXISTED: 8002,
    WAREHOUSE_REFERENCE_IMPORT_INVOICE: 8003,
    WAREHOUSE_CREATE_FAILED: 8004,
    WAREHOUSE_UPDATED_FAILED: 8005,
    WAREHOUSE_DELETED_FAILED: 8006,
  
    // IMPORT_WAREHOUSE - 9xxx
    IMPORT_WAREHOUSE_SUCCESS: 8000,
    IMPORT_WAREHOUSE_NOT_FOUND: 8001,
    IMPORT_WAREHOUSE_CREATE_FAILED: 8002,
    IMPORT_WAREHOUSE_UPDATED_FAILED: 8003,
    IMPORT_WAREHOUSE_DELETED_FAILED: 8004,
    IMPORT_WAREHOUSE_IMPORT_DATE_INVALID: 8005,
    IMPORT_WAREHOUSE_HAVED_QUANTIY_IN_WAREHOUSE_INVENTORY: 8006,
    IMPORT_WAREHOUSE_SKU_NOT_EXISTED: 8006,
  
    // EMPLOYEE - 11xx
    EMPLOYEE_SUCCESS: 1100,
    EMPLOYEE_NOT_FOUND: 1101,
    EMPLOYEE_CREATE_FAILED: 1102,
    EMPLOYEE_UPDATED_FAILED: 1103,
    EMPLOYEE_DELETED_FAILED: 1104,
  
    // SUPPLIER - 12xx
    SUPPLIER_SUCCESS: 1200,
    SUPPLIER_NOT_FOUND: 1201,
    SUPPLIER_CREATE_FAILED: 1202,
    SUPPLIER_UPDATED_FAILED: 1203,
    SUPPLIER_DELETED_FAILED: 1204,

    // DETAIL_IMPORT - 13xx
    DETAIL_IMPORT_SUCCESS: 1300,
    DETAIL_IMPORT_NOT_FOUND: 1301,
    DETAIL_IMPORT_CREATE_FAILED: 1302,
    DETAIL_IMPORT_UPDATED_FAILED: 1303,
    DETAIL_IMPORT_DELETED_FAILED: 1304,
    DETAIL_IMPORT_IMPORT_DATE_INVALID: 1305,
    DETAIL_IMPORT_HAVED_QUANTIY_IN_WAREHOUSE_INVENTORY: 1306,
    DETAIL_IMPORT_NOT_GIFT: 1307,
    DETAIL_IMPORT_AMOUNT_INVALID: 1308,
  
    // CUSTOMER - 14xx
    CUSTOMER_SUCCESS: 1400,
    CUSTOMER_NOT_FOUND: 1401,
    CUSTOMER_CREATE_FAILED: 1402,
    CUSTOMER_UPDATED_FAILED: 1403,
    CUSTOMER_DELETED_FAILED: 1404,
    CUSTOMER_LASTNAME_INVALID: 1405,
    CUSTOMER_PHONE_INVALID: 1406,
    CUSTOMER_EMAIL_INVALID: 1407,
    CUSTOMER_GENDER_INVALID: 1408,
    CUSTOMER_EMAIL_EXISTED: 1409,

    // DETAIL_ORDER - 15xx
    DETAIL_ORDER_SUCCESS: 1500,
    DETAIL_ORDER_NOT_FOUND: 1501,
    DETAIL_ORDER_CREATE_FAILED: 1502,
    DETAIL_ORDER_UPDATED_FAILED: 1503,
    DETAIL_ORDER_DELETED_FAILED: 1504,
    DETAIL_ORDER_SALE_PRICE_NOT_SAME: 1505,
    DETAIL_ORDER_IMPORT_PRICE_NOT_SAME: 1506,
    DETAIL_ORDER_AMOUNT_NOT_SAME: 1507,
    DETAIL_ORDER_QUANTITY_IS_LIMIT: 1508,
    DETAIL_ORDER_IMPORT_PRICE_NOT_NUMBER: 1510,
    DETAIL_ORDER_SALE_PRICE_NOT_NUMBER: 1511,
    DETAIL_ORDER_AMOUNT_NOT_NUMBER: 1512,
    DETAIL_ORDER_DISCOUNT_NOT_NUMBER: 1514,
    DETAIL_ORDER_VAT_NOT_NUMBER: 1515,
    DETAIL_ORDER_IS_GIFT_SALE_DISCOUNT_ZERO: 1516,
    DETAIL_ORDER_QUANTITY_NOT_NUMBER: 1517,
  
    // ACCOUNT - 16xx
    ACCOUNT_NOT_FOUND: 1601,
    ACCOUNT_UNAUTHORIZED: 1602,
    ACCOUNT_INVALID: 1603,
    ACCOUNT_FORBIDDEN: 1604,
    ACCOUNT_NOT_ACTIVE: 1605,
    ACCOUNT_BLOCKED: 1606,
    ACCOUNT_USERNAME_REQUIRED: 1607,
    ACCOUNT_PASSWORD_REQUIRED: 1608,
    ACCOUNT_REMEMBER_ME_INVALID: 1609,
    ACCOUNT_TYPE_INVALID: 1610,
    ACCOUNT_CONFIRM_PASSWORD_REQUIRED: 1611,
    ACCOUNT_VERIFICATION_CODE_INVALID: 1612,
    ACCOUNT_EMAIL_NOT_MATCH: 1613,
    ACCOUNT_EMAIL_IS_VERIFIED: 1614,
    ACCOUNT_VERIFICATION_CODE_NOT_FOUND: 1615,
    ACCOUNT_VERIFICATION_CODE_NOT_MATCH: 1616,
    ACCOUNT_VERIFICATION_CODE_EXPIRED: 1617,
    ACCOUNT_VERIFICATION_FAILED: 1618,
    ACCOUNT_ID_INVALID: 1619,
};

const ERROR_MESSAGES = {
    [ERROR_CODES.SUCCESS]: "Thành công",
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: "Lỗi nội bộ của máy chủ",

    // SHARED
    [ERROR_CODES.SHARED_NUMBER_RANGE_100_INVALID]: "Số phải từ 0 đến 99",
    [ERROR_CODES.SHARED_PHONE_INVALID]: "Số điện thoại không hợp lệ",
    [ERROR_CODES.SHARED_EMAIL_INVALID]: "Email không hợp lệ",
    [ERROR_CODES.SHARED_NOT_NUMBER]: "Giá trị phải là số",
    [ERROR_CODES.SHARED_PREPAID_INVALID]: "Số tiền trả trước không hợp lệ",
    [ERROR_CODES.SHARED_REMAINING_INVALID]: "Số dư không hợp lệ",
    [ERROR_CODES.SHARED_TOTAL_MONEY_INVALID]: "Tổng tiền không hợp lệ",
    [ERROR_CODES.EMAIL_SEND_FAILED]: "Gửi email thất bại",

    // DEVICE
    [ERROR_CODES.DEVICE_DEVICE_NOT_FOUND]: "Không tìm thấy thiết bị",
    [ERROR_CODES.DEVICE_DEVICE_NON_ACTIVE]: "Thiết bị không hoạt động",
    [ERROR_CODES.DEVICE_CREATE_FAILED]: "Tạo thiết bị thất bại",
    [ERROR_CODES.DEVICE_UPDATED_FAILED]: "Cập nhật thiết bị thất bại",
    [ERROR_CODES.DEVICE_DELETED_FAILED]: "Xóa thiết bị thất bại",
    [ERROR_CODES.DEVICE_NAME_EXISTED]: "Tên thiết bị đã tồn tại",
    [ERROR_CODES.DEVICE_NAME_REQUIRED]: "Tên thiết bị là bắt buộc",
    [ERROR_CODES.DEVICE_NAME_TOO_LONG]: "Tên thiết bị quá dài",
    [ERROR_CODES.DEVICE_PRICE_INVALID]: "Giá thiết bị không hợp lệ",
    [ERROR_CODES.DEVICE_CATEGORY_REQUIRED]: "Danh mục thiết bị là bắt buộc",
    [ERROR_CODES.DEVICE_UNIT_REQUIRED]: "Đơn vị tính là bắt buộc",
    [ERROR_CODES.DEVICE_ATTRIBUTE_REQUIRED]: "Thuộc tính thiết bị là bắt buộc",
    [ERROR_CODES.DEVICE_ID_REQUIRED]: "ID thiết bị là bắt buộc",

    // ATTRIBUTE
    [ERROR_CODES.ATTRIBUTE_SUCCESS]: "Thao tác với thuộc tính thành công",
    [ERROR_CODES.ATTRIBUTE_NOT_FOUND]: "Không tìm thấy thuộc tính",
    [ERROR_CODES.ATTRIBUTE_NAME_EXISTED]: "Tên thuộc tính đã tồn tại",

    // CATEGORY
    [ERROR_CODES.CATEGORY_NOT_FOUND]: "Không tìm thấy danh mục",

    // UNIT
    [ERROR_CODES.UNIT_NOT_FOUND]: "Không tìm thấy đơn vị tính",

    // WARRANTY_TIME
    [ERROR_CODES.WARRANTY_TIME_NOT_FOUND]: "Không tìm thấy thời gian bảo hành",

    // ORDER
    [ERROR_CODES.ORDER_SUCCESS]: "Thao tác với đơn hàng thành công",
    [ERROR_CODES.ORDER_NOT_FOUND]: "Không tìm thấy đơn hàng",
    [ERROR_CODES.ORDER_CREATE_FAILED]: "Tạo đơn hàng thất bại",
    [ERROR_CODES.ORDER_UPDATED_FAILED]: "Cập nhật đơn hàng thất bại",
    [ERROR_CODES.ORDER_DELETED_FAILED]: "Xóa đơn hàng thất bại",
    [ERROR_CODES.ORDER_SALE_PRICE_NOT_SAME]: "Giá bán không khớp",
    [ERROR_CODES.ORDER_IMPORT_PRICE_NOT_SAME]: "Giá nhập không khớp",
    [ERROR_CODES.ORDER_AMOUNT_IS_LIMIT]: "Số tiền vượt giới hạn",
    [ERROR_CODES.ORDER_QUANTITY_IS_LIMIT]: "Số lượng vượt giới hạn",
    [ERROR_CODES.ORDER_INFO_DEVICES_IS_CHANGED]: "Thông tin thiết bị đã thay đổi",
    [ERROR_CODES.ORDER_TOTAL_IMPORT_NOT_NUMBER]: "Tổng tiền nhập không phải số",
    [ERROR_CODES.ORDER_TOTAL_MONEY_NOT_NUMBER]: "Tổng tiền không phải số",
    [ERROR_CODES.ORDER_AMOUNT_NOT_NUMBER]: "Số tiền không phải số",
    [ERROR_CODES.ORDER_PREPAID_NOT_NUMBER]: "Tiền trả trước không phải số",
    [ERROR_CODES.ORDER_DISCOUNT_NOT_NUMBER]: "Chiết khấu không phải số",
    [ERROR_CODES.ORDER_VAT_NOT_NUMBER]: "VAT không phải số",
    [ERROR_CODES.ORDER_TOTAL_MONEY_NOT_SAME]: "Tổng tiền không khớp",
    [ERROR_CODES.ORDER_PROFIT_NOT_SAME]: "Lợi nhuận không khớp",

    // PAYMENT
    [ERROR_CODES.PAYMENT_FAILED]: "Thanh toán thất bại",
    [ERROR_CODES.PAYMENT_INVALID_METHOD]: "Phương thức thanh toán không hợp lệ",
    [ERROR_CODES.PAYMENT_INTERNAL_ERROR]: "Lỗi nội bộ khi thanh toán",

    // WAREHOUSE
    [ERROR_CODES.WAREHOUSE_SUCCESS]: "Thao tác với kho hàng thành công",
    [ERROR_CODES.WAREHOUSE_NOT_FOUND]: "Không tìm thấy kho hàng",
    [ERROR_CODES.WAREHOUSE_NAME_EXISTED]: "Tên kho hàng đã tồn tại",
    [ERROR_CODES.WAREHOUSE_REFERENCE_IMPORT_INVOICE]: "Kho hàng đang liên kết với hóa đơn nhập",
    [ERROR_CODES.WAREHOUSE_CREATE_FAILED]: "Tạo kho hàng thất bại",
    [ERROR_CODES.WAREHOUSE_UPDATED_FAILED]: "Cập nhật kho hàng thất bại",
    [ERROR_CODES.WAREHOUSE_DELETED_FAILED]: "Xóa kho hàng thất bại",

    // IMPORT_WAREHOUSE
    [ERROR_CODES.IMPORT_WAREHOUSE_SUCCESS]: "Thao tác với nhập kho thành công",
    [ERROR_CODES.IMPORT_WAREHOUSE_NOT_FOUND]: "Không tìm thấy hóa đơn nhập kho",
    [ERROR_CODES.IMPORT_WAREHOUSE_CREATE_FAILED]: "Tạo hóa đơn nhập kho thất bại",
    [ERROR_CODES.IMPORT_WAREHOUSE_UPDATED_FAILED]: "Cập nhật hóa đơn nhập kho thất bại",
    [ERROR_CODES.IMPORT_WAREHOUSE_DELETED_FAILED]: "Xóa hóa đơn nhập kho thất bại",
    [ERROR_CODES.IMPORT_WAREHOUSE_IMPORT_DATE_INVALID]: "Ngày nhập kho không hợp lệ",
    [ERROR_CODES.IMPORT_WAREHOUSE_HAVED_QUANTIY_IN_WAREHOUSE_INVENTORY]: "Số lượng trong kho không hợp lệ",
    [ERROR_CODES.IMPORT_WAREHOUSE_SKU_NOT_EXISTED]: "SKU không tồn tại",

    // EMPLOYEE
    [ERROR_CODES.EMPLOYEE_SUCCESS]: "Thao tác với nhân viên thành công",
    [ERROR_CODES.EMPLOYEE_NOT_FOUND]: "Không tìm thấy nhân viên",
    [ERROR_CODES.EMPLOYEE_CREATE_FAILED]: "Tạo nhân viên thất bại",
    [ERROR_CODES.EMPLOYEE_UPDATED_FAILED]: "Cập nhật nhân viên thất bại",
    [ERROR_CODES.EMPLOYEE_DELETED_FAILED]: "Xóa nhân viên thất bại",

    // SUPPLIER
    [ERROR_CODES.SUPPLIER_SUCCESS]: "Thao tác với nhà cung cấp thành công",
    [ERROR_CODES.SUPPLIER_NOT_FOUND]: "Không tìm thấy nhà cung cấp",
    [ERROR_CODES.SUPPLIER_CREATE_FAILED]: "Tạo nhà cung cấp thất bại",
    [ERROR_CODES.SUPPLIER_UPDATED_FAILED]: "Cập nhật nhà cung cấp thất bại",
    [ERROR_CODES.SUPPLIER_DELETED_FAILED]: "Xóa nhà cung cấp thất bại",

    // DETAIL_IMPORT
    [ERROR_CODES.DETAIL_IMPORT_SUCCESS]: "Thao tác với chi tiết nhập kho thành công",
    [ERROR_CODES.DETAIL_IMPORT_NOT_FOUND]: "Không tìm thấy chi tiết nhập kho",
    [ERROR_CODES.DETAIL_IMPORT_CREATE_FAILED]: "Tạo chi tiết nhập kho thất bại",
    [ERROR_CODES.DETAIL_IMPORT_UPDATED_FAILED]: "Cập nhật chi tiết nhập kho thất bại",
    [ERROR_CODES.DETAIL_IMPORT_DELETED_FAILED]: "Xóa chi tiết nhập kho thất bại",
    [ERROR_CODES.DETAIL_IMPORT_IMPORT_DATE_INVALID]: "Ngày nhập kho không hợp lệ",
    [ERROR_CODES.DETAIL_IMPORT_HAVED_QUANTIY_IN_WAREHOUSE_INVENTORY]: "Số lượng trong kho không hợp lệ",
    [ERROR_CODES.DETAIL_IMPORT_NOT_GIFT]: "Không phải sản phẩm tặng",
    [ERROR_CODES.DETAIL_IMPORT_AMOUNT_INVALID]: "Số lượng không hợp lệ",

    // CUSTOMER
    [ERROR_CODES.CUSTOMER_SUCCESS]: "Thao tác với khách hàng thành công",
    [ERROR_CODES.CUSTOMER_NOT_FOUND]: "Không tìm thấy khách hàng",
    [ERROR_CODES.CUSTOMER_CREATE_FAILED]: "Tạo khách hàng thất bại",
    [ERROR_CODES.CUSTOMER_UPDATED_FAILED]: "Cập nhật khách hàng thất bại",
    [ERROR_CODES.CUSTOMER_DELETED_FAILED]: "Xóa khách hàng thất bại",
    [ERROR_CODES.CUSTOMER_LASTNAME_INVALID]: "Tên khách hàng là bắt buộc và tối đa 500 ký tự",
    [ERROR_CODES.CUSTOMER_PHONE_INVALID]: "Số điện thoại không hợp lệ",
    [ERROR_CODES.CUSTOMER_EMAIL_INVALID]: "Email không hợp lệ",
    [ERROR_CODES.CUSTOMER_GENDER_INVALID]: "Giới tính không hợp lệ",
    [ERROR_CODES.CUSTOMER_EMAIL_EXISTED]: "Email đã tồn tại",
    

    // DETAIL_ORDER
    [ERROR_CODES.DETAIL_ORDER_SUCCESS]: "Thao tác với chi tiết đơn hàng thành công",
    [ERROR_CODES.DETAIL_ORDER_NOT_FOUND]: "Không tìm thấy chi tiết đơn hàng",
    [ERROR_CODES.DETAIL_ORDER_CREATE_FAILED]: "Tạo chi tiết đơn hàng thất bại",
    [ERROR_CODES.DETAIL_ORDER_UPDATED_FAILED]: "Cập nhật chi tiết đơn hàng thất bại",
    [ERROR_CODES.DETAIL_ORDER_DELETED_FAILED]: "Xóa chi tiết đơn hàng thất bại",
    [ERROR_CODES.DETAIL_ORDER_SALE_PRICE_NOT_SAME]: "Giá bán không khớp",
    [ERROR_CODES.DETAIL_ORDER_IMPORT_PRICE_NOT_SAME]: "Giá nhập không khớp",
    [ERROR_CODES.DETAIL_ORDER_AMOUNT_NOT_SAME]: "Số tiền không khớp",
    [ERROR_CODES.DETAIL_ORDER_QUANTITY_IS_LIMIT]: "Số lượng vượt giới hạn",
    [ERROR_CODES.DETAIL_ORDER_IMPORT_PRICE_NOT_NUMBER]: "Giá nhập không phải số",
    [ERROR_CODES.DETAIL_ORDER_SALE_PRICE_NOT_NUMBER]: "Giá bán không phải số",
    [ERROR_CODES.DETAIL_ORDER_AMOUNT_NOT_NUMBER]: "Số tiền không phải số",
    [ERROR_CODES.DETAIL_ORDER_DISCOUNT_NOT_NUMBER]: "Chiết khấu không phải số",
    [ERROR_CODES.DETAIL_ORDER_VAT_NOT_NUMBER]: "VAT không phải số",
    [ERROR_CODES.DETAIL_ORDER_IS_GIFT_SALE_DISCOUNT_ZERO]: "Sản phẩm tặng phải có chiết khấu bằng 0",
    [ERROR_CODES.DETAIL_ORDER_QUANTITY_NOT_NUMBER]: "Số lượng không phải số",

    // ACCOUNT
    [ERROR_CODES.ACCOUNT_NOT_FOUND]: "Không tìm thấy tài khoản",
    [ERROR_CODES.ACCOUNT_UNAUTHORIZED]: "Không có quyền truy cập",
    [ERROR_CODES.ACCOUNT_INVALID]: "Tài khoản hoặc mật khẩu không đúng",
    [ERROR_CODES.ACCOUNT_FORBIDDEN]: "Truy cập bị cấm",
    [ERROR_CODES.ACCOUNT_NOT_ACTIVE]: "Tài khoản chưa kích hoạt",
    [ERROR_CODES.ACCOUNT_BLOCKED]: "Tài khoản bị khóa",
    [ERROR_CODES.ACCOUNT_USERNAME_REQUIRED]: "Tên đăng nhập là bắt buộc",
    [ERROR_CODES.ACCOUNT_PASSWORD_REQUIRED]: "Mật khẩu là bắt buộc",
    [ERROR_CODES.ACCOUNT_CONFIRM_PASSWORD_REQUIRED]: "Mật khẩu là bắt buộc",
    [ERROR_CODES.ACCOUNT_REMEMBER_ME_INVALID]: "Giá trị ghi nhớ mật khẩu không hợp lệ",
    [ERROR_CODES.ACCOUNT_TYPE_INVALID]: "Loại tài khoản không hợp lệ",
    [ERROR_CODES.ACCOUNT_VERIFICATION_CODE_INVALID]: "Mã xác thực không chính xác",
    [ERROR_CODES.ACCOUNT_EMAIL_NOT_MATCH]: "Email không khớp với tài khoản",
    [ERROR_CODES.ACCOUNT_EMAIL_IS_VERIFIED]: "Email đã được xác thực",
    [ERROR_CODES.ACCOUNT_VERIFICATION_CODE_NOT_FOUND]: "Không tìm thấy mã xác thực",
    [ERROR_CODES.ACCOUNT_VERIFICATION_CODE_NOT_MATCH]: "Mã xác thực không khớp",
    [ERROR_CODES.ACCOUNT_VERIFICATION_CODE_EXPIRED]: "Mã xác thực đã hết hạn",
    [ERROR_CODES.ACCOUNT_VERIFICATION_FAILED]: "Xác thực tài khoản thất bại",
    [ERROR_CODES.ACCOUNT_ID_INVALID]: "ID tài khoản không hợp lệ",
};

module.exports = {
    ERROR_CODES,
    ERROR_MESSAGES,
    STATUS_CODE,
};