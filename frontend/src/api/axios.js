import axios from 'axios';
//1. Create a base URL instance
const api = axios.create({
    // It looks for a VITE_API_URL variable. If not found, it uses localhost.
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
})
//2. Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Do NOT add config.headers['Content-Type'] here.
        return config;
    },
    (error) => Promise.reject(error)
);

//3. Add a response interceptor to handle responses globally
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Handle 401 errors (Unauthorized)
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token'); // Adjust the key name as needed
            if (refreshToken) {
                try {
                    //Try to get a new access token using the refresh token
                    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                        refresh: refreshToken,
                    });

                    localStorage.setItem('access_token', response.data.access);
                    api.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // If refresh token is invalid, redirect to login or handle accordingly
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';    
                    console.error('Refresh token is invalid', refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);
export default api;