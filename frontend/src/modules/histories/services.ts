import api from '@/utils/axios';
import { AxiosRequestConfig } from 'axios';

export const getHistories = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/histories', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getHistory = async (id: number): Promise<any> => {
    try {
        const response = await api.get(`/histories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};