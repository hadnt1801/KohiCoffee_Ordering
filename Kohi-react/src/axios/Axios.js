import axios from 'axios';

// Tạo một instance axios với base URL API
export const axiosInstance = axios.create({
    baseURL: 'https://9cfb-1-55-81-229.ngrok-free.app/api',
    headers: {
        'Content-Type': 'application/json',
        accept: '*/*'
    },
});

// Thêm interceptors để tự động thêm token vào headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
