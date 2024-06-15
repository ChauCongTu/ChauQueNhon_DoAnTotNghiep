import axios from "axios";
import toast from "react-hot-toast";

const baseURL = process.env.NEXT_PUBLIC_PREDICT_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;  // Giả sử bạn lưu API key trong biến môi trường

const instance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey  // Thêm API key vào headers
    }
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
