import axios from "axios";
import Cookies from "js-cookie";

// Tạo instance axios
const axiosPrivate = axios.create({
    baseURL: process.env.SMART_NET_API_URL || "http://localhost:8081/api/",
    timeout: 1000000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // "ngrok-skip-browser-warning": "true",
    },
});

// Thêm token vào header cho mỗi request
axiosPrivate.interceptors.request.use(
    (config) => {
         // Log thông tin request
        console.log('🚀 Sending Request:', {
        method: config.method.toUpperCase(),
        url: config.url,
        headers: config.headers,
        data: config.data,
        params: config.params,
        });
    
        // Lấy token từ cookie
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
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