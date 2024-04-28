import api from '@/utils/axios';
import { AxiosRequestConfig } from 'axios';

export const getArenas = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/arenas', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};