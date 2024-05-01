import { AxiosRequestConfig } from "axios";
import api from '@/utils/axios';

export const getQuestions = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/questions', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getGenerateQuestions = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/questions/filter', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};