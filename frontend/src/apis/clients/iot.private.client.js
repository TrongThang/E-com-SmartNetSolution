import axios from 'axios'

console.log("process.env.REACT_APP_SMART_NET_IOT_API_URL:", process.env.REACT_APP_SMART_NET_IOT_API_URL);
const axiosIOTPublic = axios.create({
    baseURL: process.env.REACT_APP_SMART_NET_IOT_API_URL || "http://localhost:9999/api/admin/", // Địa chỉ API public
    headers: {
        // 'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${localStorage.getItem('employeeToken') || ''}`, // Lấy token từ localStorage
    },
    // Cho phép xử lý các status code từ 200-499
    validateStatus: function (status) {
        return status >= 200 && status < 500;
    }
})

axiosIOTPublic.interceptors.request.use(
    (config) => {
        // Log thông tin request
        console.log('🚀 Sending Request:', {
            method: config.method.toUpperCase(),
            url: config.url,
            params: config.params,
        });

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor nếu cần (tùy chọn)
axiosIOTPublic.interceptors.response.use(
    (response) => response.data, // Xử lý khi thành công
    (error) => {
        if (error.response) {
            // Lỗi từ server, có mã status
            console.error(`API error: ${error.response.status}`, error.response.data);
            return Promise.reject(error.response.data)

        } else if (error.request) {
            // Lỗi do không nhận được phản hồi
            console.error("No response received:", error.request);
            return Promise.reject(error.request)

        } else {
            // Lỗi trong quá trình cấu hình request
            console.error("Error in request setup:", error.message);
            return Promise.reject(error.message)
        }
    }
)



export default axiosIOTPublic