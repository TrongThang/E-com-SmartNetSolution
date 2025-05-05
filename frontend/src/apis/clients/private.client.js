import axios from "axios";
import Cookies from "js-cookie";

// Tạo instance axios
const axiosPrivate = axios.create({
    baseURL: import.meta.env.SMART_NET_API_URL,
    timeout: 1000000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});

// Request Interceptor: Thêm Access Token vào header
axiosPrivate.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            // config.headers.Authorization = `Bearer ${token}`;
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// Response Interceptor: Xử lý authentication và authorization
axiosPrivate.interceptors.response.use(
    (response) => response.data, // Thành công
    async (error) => {
        // const originalRequest = error.config;

        // Xử lý lỗi Authentication (401 Unauthorized)
        // if (error.response?.status === 401 && !originalRequest._retry) {
        //   originalRequest._retry = true

        //   try {
        //     const refreshToken = Cookies.get('refreshToken')
        //     if (!refreshToken) {
        //       throw new Error('No refresh token available')
        //     }

        //     // Yêu cầu refresh token
        //     const { jwt }: { jwt: IJwt } = await axiosPrivate.post(`Auth/RefreshToken`, {
        //       refreshToken: refreshToken
        //     })
        //     const expireRefreshToken = Cookies.get('expireRefreshToken')
        //     if (expireRefreshToken) {
        //       // Cập nhật token mới
        //       Cookies.set('accessToken', jwt.accessToken, { expires: new Date(jwt.expireAccessToken) })
        //       Cookies.set('expireAccessToken', jwt.expireAccessToken)
        //       Cookies.set('refreshToken', jwt.refreshToken, { expires: new Date(expireRefreshToken) })
        //       originalRequest.headers.Authorization = `Bearer ${jwt.accessToken}`
        //     } else {
        //       window.location.href = '/dang-nhap'
        //     }
        //     return axiosPrivate(originalRequest) // Retry request
        //   } catch (refreshError) {
        //     console.error('Refresh token failed:', refreshError)
        //     Cookies.remove('accessToken')
        //     Cookies.remove('refreshToken')
        //     Cookies.remove('expireAccessToken')
        //     Cookies.remove('expireRefreshToken')
        //     window.location.href = '/dang-nhap'
        //     return Promise.reject(refreshError)
        //   }
        // }
        // if (error.response.status === 401) {
        //   console.log("Loi 401");
        //   Cookies.remove("token");
        //   window.location.href = "/dang-nhap";
        // }

        // Xử lý lỗi Authorization (403 Forbidden)
        if (error.response?.status === 403) {
            // console.error(
            //   "Access denied. You do not have permission to perform this action."
            // );
            // // Redirect đến trang thông báo hoặc trang lỗi
            // window.location.href = "/403"; // Trang tùy chỉnh cho lỗi 403
            return Promise.reject(error);
        }

        // Các lỗi khác
        console.error("Response error:", error);
        return Promise.reject(error);
    }
);

export default axiosPrivate;