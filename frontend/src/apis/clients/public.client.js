import axios from 'axios'

const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_SMART_NET_API_URL || "http://localhost:8081/api/", // Địa chỉ API public
    headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        charset: 'UTF-8',
    }
})

// Thêm interceptor nếu cần (tùy chọn)
axiosPublic.interceptors.response.use(
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



export default axiosPublic