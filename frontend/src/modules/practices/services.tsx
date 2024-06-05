import api from '@/utils/axios';
import { AxiosRequestConfig } from 'axios';
import { ExamDid } from '../exams/types';
import toast from 'react-hot-toast';

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

export const postPractice = async (data: { name: string, questions: [], question_count: number, subject_id: number, chapter: number } | any): Promise<any> => {
    try {
        const response = await api.post(`/practices`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const putPractice = async (id: number, data: { name: string, questions: [], question_count: number, subject_id: number, chapter: number }): Promise<any> => {
    try {
        const response = await api.put(`/practices/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const deletePractice = async (id: number): Promise<any> => {
    try {
        const response = await api.delete(`/practices/${id}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};