import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((config) => {
    if (config.status >= 200 && config.status <= 299) {
        return config;
    }

    if (config.error) {
        const status = config.status
        if (config.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
    }
    else {
        return Promise.reject(error);
    }

})