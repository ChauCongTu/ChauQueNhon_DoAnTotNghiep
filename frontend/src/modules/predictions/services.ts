import predict_api from '@/utils/predict';
import api from '@/utils/axios';

import { PredictRequest } from './type';
import { AxiosRequestConfig } from 'axios';
export const postPrediction = async (data: PredictRequest): Promise<any> => {
    try {
        const response = await predict_api.post('', data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}

export const getSubjectUser = async (user_id: number): Promise<any> => {
    try {
        const response = await api.get(`/statistics/subject/${user_id}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}

export const getPredictionRequest = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get(`/statistics/predict-data`, { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}