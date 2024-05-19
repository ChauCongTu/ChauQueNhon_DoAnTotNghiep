import api from '@/utils/axios';
import { AxiosRequestConfig } from 'axios';
import { ExamDid } from '../exams/types';

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
export const postSubmitPractice = async (id: number, data: ExamDid): Promise<any> => {
    try {
        const response = await api.post(`/practices/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};