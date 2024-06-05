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

export const postExam = async (data: { name: string, time: number, questions: [], question_count: number, subject_id: number, chapter: number } | any): Promise<any> => {
    try {
        const response = await api.post(`/exams`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const putExam = async (id: number, data: { name: string, time: number, questions: [], question_count: number, subject_id: number, chapter: number }): Promise<any> => {
    try {
        const response = await api.put(`/exams/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const deleteExam = async (id: number): Promise<any> => {
    try {
        const response = await api.delete(`/exams/${id}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};