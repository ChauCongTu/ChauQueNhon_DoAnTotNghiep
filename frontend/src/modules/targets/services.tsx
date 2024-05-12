import api from '@/utils/axios';
import { AxiosRequestConfig } from 'axios';
import { UserTarget } from './types';

export const getTargetCheck = async (): Promise<any> => {
    try {
        const response = await api.get('/targets/check');
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getTarget = async (date: string | Date): Promise<any> => {
    try {
        const response = await api.get('/targets/' + date);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}

export const getTargetReality = async (date: string | Date): Promise<any> => {
    try {
        const response = await api.get('/targets/reality/' + date);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}

export const postSetTarget = async (data: UserTarget): Promise<any> => {
    try {
        const response = await api.post('/targets/', data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}

