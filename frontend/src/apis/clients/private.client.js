import axios from "axios";
import Cookies from "js-cookie";

// Tạo instance axios
const axiosPrivate = axios.create({
    baseURL: "http://localhost:8081/api/",
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
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default axiosPrivate;