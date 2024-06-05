import api from '../../utils/axios';
import { AxiosRequestConfig } from 'axios';

export const getSubjects = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/subjects', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getSubject = async (slug: string): Promise<any> => {
    try {
        const response = await api.get('/subjects/' + slug);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postSubject = async (data: { name: string, grade: number, icon: string }): Promise<any> => {
    try {
        const response = await api.post('/subjects', data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const putSubject = async (id: number, data: { name: string, grade: number, icon: string }): Promise<any> => {
    try {
        const response = await api.put(`/subjects/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const deleteSubject = async (id: number): Promise<any> => {
    try {
        const response = await api.delete(`/subjects/${id}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getChapters = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/chapters', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postChapter = async (data: { name: string, subject_id: number }): Promise<any> => {
    try {
        const response = await api.post('/chapters', data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const putChapter = async (id: number, data: { name: string, subject_id: number }): Promise<any> => {
    try {
        const response = await api.put(`/chapters/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const deleteChapter = async (id: number): Promise<any> => {
    try {
        const response = await api.delete(`/chapters/${id}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};