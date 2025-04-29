import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000', 
    withCredentials: true, // Important to send cookies (refreshToken)
});

// Attach token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Refresh token if 401 Unauthorized
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await axiosInstance.post('/refresh-token');
                const newToken = res.data.token;
                localStorage.setItem('token', newToken);

                // Update Authorization header and retry original request
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                // If refresh fails, clear token and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
