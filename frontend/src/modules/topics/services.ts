import api from '@/utils/axios';
import { AxiosRequestConfig } from 'axios';

export const getTopics = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/topics', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};