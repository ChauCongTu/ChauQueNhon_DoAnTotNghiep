import api from '@/utils/axios';
import { AxiosRequestConfig } from 'axios';

export const getOverview = async (): Promise<any> => {
    try {
        const response = await api.get('/dashboard/overview');
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getVibrantStudents = async (): Promise<any> => {
    try {
        const response = await api.get('/dashboard/vibrant');
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};


export const getRegistration = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/dashboard/user-registration-stats', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getRoleStatis = async (): Promise<any> => {
    try {
        const response = await api.get('/dashboard/user-role');
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getTrendsStatis = async (): Promise<any> => {
    try {
        const response = await api.get('/dashboard/trend');
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getMostViewed = async (): Promise<any> => {
    try {
        const response = await api.get('/dashboard/lessons/most-viewed');
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getStatistics = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/dashboard/statistics', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getUserFiltered = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/dashboard/users/filtered', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};