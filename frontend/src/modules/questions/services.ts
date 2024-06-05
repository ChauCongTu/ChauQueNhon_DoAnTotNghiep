import { AxiosRequestConfig } from "axios";
import api from '@/utils/axios';
import { QuestionType } from "./types";

export const getQuestions = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/questions', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getFilterQuestions = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/questions/filter', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postQuestion = async (data: QuestionType): Promise<any> => {
    try {
        const response = await api.post('/questions', data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const putQuestion = async (id: number, data: QuestionType): Promise<any> => {
    try {
        const response = await api.put(`/questions/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const deleteQuestion = async (id: number): Promise<any> => {
    try {
        const response = await api.delete(`/questions/${id}`);
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