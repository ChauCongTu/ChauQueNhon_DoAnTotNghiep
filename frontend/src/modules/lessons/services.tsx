import api from '@/utils/axios';
import { AxiosRequestConfig } from 'axios';

export const getLessons = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/lessons', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getLesson = async (slug: string): Promise<any> => {
    try {
        const response = await api.get(`/lessons/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postLikeLesson = async (id: number): Promise<any> => {
    try {
        const response = await api.post(`/lessons/${id}/like`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};