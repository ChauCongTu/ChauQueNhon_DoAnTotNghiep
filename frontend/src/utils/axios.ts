import axios from "axios";
import { getCookie } from "./cookie";
import toast from "react-hot-toast";

// const baseURL = process.env.VITE_API_URL ? process.env.VITE_API_URL : 'https://api-gouni-develop.nhoncq.online/api/v1';

const baseURL = process.env.VITE_API_URL ? process.env.VITE_API_URL : 'http://127.0.0.1:8000/api/v1';

const instance = axios.create({ baseURL: baseURL, headers: { 'Content-Type': 'application/json' } });

instance.interceptors.request.use((config) => {
    const token = getCookie("ACCESS_TOKEN");
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.request.use(
    (res) => res,
    (e) => {
        const message = e.response.data.message || "Contains a few errors";
        toast.error(message);
        return Promise.reject(message);
    }
);

export default instance;