import api from '@/utils/axios';
import { AxiosRequestConfig } from 'axios';

export const getPractices = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/practices', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getPractice = async (slug: string): Promise<any> => {
    try {
        const response = await api.get(`/practices/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};
