import axios from "axios";
import Cookies from "js-cookie";

// Biến để theo dõi trạng thái refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

// Tạo instance axios
const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_SMART_NET_ECOMERCE_API_URL,
    timeout: 1000000,
    headers: {
        // "ngrok-skip-browser-warning": "true",
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        // Loại bỏ header Authorization cố định để tránh conflict với interceptor
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

// Xử lý response với refresh token logic
axiosPrivate.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Nếu đang refresh token, đợi trong queue
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosPrivate(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token found');
                }

                // Gọi API refresh token
                const refreshResponse = await axios.post(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}/auth/refresh`, {
                    refreshToken: refreshToken
                });

                if (refreshResponse.data && refreshResponse.data.accessToken) {
                    const newToken = refreshResponse.data.accessToken;
                    
                    // Cập nhật token mới
                    localStorage.setItem('authToken', newToken);
                    
                    // Xử lý queue
                    processQueue(null, newToken);
                    
                    // Retry request ban đầu với token mới
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosPrivate(originalRequest);
                } else {
                    throw new Error('Failed to refresh token');
                }
            } catch (refreshError) {
                // Refresh token failed, logout user
                processQueue(refreshError, null);
                
                // Xóa tokens và redirect to login
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                
                // Có thể dispatch logout event hoặc redirect
                window.location.href = '/login';
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Xử lý các lỗi khác
        if (error.response?.status === 403) {
            console.error('❌ Response Error: Forbidden (403)', error.response);
            return Promise.reject(error);
        }
        
        console.error('❌ Response Error:', error.response || error);
        return Promise.reject(error);
    }
);

export default axiosPrivate;