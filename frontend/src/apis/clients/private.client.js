import axios from "axios";
import Cookies from "js-cookie";

// Tạo instance axios
const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_SMART_NET_ECOMERCE_API_URL,
    timeout: 1000000,
    headers: {
        // "ngrok-skip-browser-warning": "true",
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
    },
    validateStatus: function (status) {
        return status >= 200 && status < 500;
    }
});

// Thêm token vào header cho mỗi request
axiosPrivate.interceptors.request.use(
    (config) => {
        console.log('🚀 Sending Request:', {
            method: config.method.toUpperCase(),
            url: config.url,
            headers: config.headers,
            data: config.data,
            params: config.params,
        });

        // Ưu tiên lấy token từ localStorage
        const token = localStorage.getItem("authToken") || Cookies.get("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý response
axiosPrivate.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        if (error.response?.status === 403) {
            console.error('❌ Response Error: Forbidden (403)', error.response);
            return Promise.reject(error);
        }
        console.error('❌ Response Error:', error.response || error);
        return Promise.reject(error);
    }
);

export default axiosPrivate;