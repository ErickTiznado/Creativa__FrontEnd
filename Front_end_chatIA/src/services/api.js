import axios from "axios";
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      Swal.fire({
                    title: "Acceso denegado",
                    text: "Contraseña y/o usuario incorrectos",
                    icon: "error",
                    iconColor: "#b91c1c",
                    // border: "1px solid #1f3a60",
                    background: "#112240",
                    color: "#f8f8f8",
                    confirmButtonColor: "#b91c1c",
                    confirmButtonText: "Aceptar"
                });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      //window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Alias for campaign-related API calls (same as api, but more semantic)
export const campaignAPI = api;
