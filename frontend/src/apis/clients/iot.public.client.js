import axios from 'axios'

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

const axiosIOTPublic = axios.create({
    baseURL: process.env.REACT_APP_SMART_NET_IOT_API_URL, // Địa chỉ API public
    headers: {
        // 'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        // Loại bỏ header Authorization cố định
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

        // Thêm logic để cập nhật token mỗi lần request
        const authToken = localStorage.getItem('authToken');
        const employeeToken = localStorage.getItem('employeeToken');
        
        // Ưu tiên sử dụng token phù hợp
        const token = employeeToken || authToken;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor với refresh token logic
axiosIOTPublic.interceptors.response.use(
    (response) => response.data, // Xử lý khi thành công
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
                    return axiosIOTPublic(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Xác định loại token cần refresh
                const employeeToken = localStorage.getItem('employeeToken');
                const authToken = localStorage.getItem('authToken');
                
                let refreshToken;
                let refreshEndpoint;
                let tokenKey;
                
                if (employeeToken) {
                    // Refresh employee token
                    refreshToken = localStorage.getItem('employeeRefreshToken');
                    refreshEndpoint = '/auth/employee/refresh';
                    tokenKey = 'employeeToken';
                } else if (authToken) {
                    // Refresh user token
                    refreshToken = localStorage.getItem('refreshToken');
                    refreshEndpoint = '/auth/refresh';
                    tokenKey = 'authToken';
                } else {
                    throw new Error('No token found');
                }

                if (!refreshToken) {
                    throw new Error('No refresh token found');
                }

                // Gọi API refresh token
                const refreshResponse = await axios.post(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}${refreshEndpoint}`, {
                    refreshToken: refreshToken
                });

                if (refreshResponse.data && refreshResponse.data.accessToken) {
                    const newToken = refreshResponse.data.accessToken;
                    
                    // Cập nhật token mới
                    localStorage.setItem(tokenKey, newToken);
                    
                    // Xử lý queue
                    processQueue(null, newToken);
                    
                    // Retry request ban đầu với token mới
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosIOTPublic(originalRequest);
                } else {
                    throw new Error('Failed to refresh token');
                }
            } catch (refreshError) {
                // Refresh token failed, logout user
                processQueue(refreshError, null);
                
                // Xóa tokens và redirect to login
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('employeeToken');
                localStorage.removeItem('employeeRefreshToken');
                
                // Có thể dispatch logout event hoặc redirect
                window.location.href = '/login';
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Xử lý các lỗi khác
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
            return Promise.reject(error);
        }
    }
);

export default axiosIOTPublic;