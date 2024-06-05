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

export const postLesson = async (data: { name: string, chap_id: number, content: string, type: string }): Promise<any> => {
    try {
        const response = await api.post(`/lessons`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const putLesson = async (id: number, data: { name: string, chap_id: number, content: string, type: string }): Promise<any> => {
    try {
        const response = await api.put(`/lessons/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const deleteLesson = async (id: number): Promise<any> => {
    try {
        const response = await api.delete(`/lessons/${id}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};