import api from '@/utils/axios';
import { AxiosRequestConfig } from 'axios';
import { ExamDid } from './types';

export const getExams = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/exams', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getExam = async (slug: string): Promise<any> => {
    try {
        const response = await api.get(`/exams/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postExamSubmit = async (id: number, request: ExamDid) => {
    try {
        const response = await api.post(`/exams/${id}`, request);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}