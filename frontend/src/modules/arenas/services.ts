import api from '@/utils/axios';
import { AxiosRequestConfig } from 'axios';
import { ArenaType } from './types';

export const getArenas = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/arenas', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getArena = async (id: number): Promise<any> => {
    try {
        const response = await api.get('/arenas/' + id);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postArena = async (data: ArenaType | FormData): Promise<any> => {
    try {
        const response = await api.post('/arenas', data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postJoin = async (id: number, data: { password: string }): Promise<any> => {
    try {
        const response = await api.post(`/arenas/${id}/join`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};
export const postLeave = async (id: number): Promise<any> => {
    try {
        const response = await api.post(`/arenas/${id}/leave`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postStart = async (id: number): Promise<any> => {
    try {
        const response = await api.post(`/arenas/${id}/start`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postRemain = async (id: number): Promise<any> => {
    try {
        const response = await api.post(`/arenas/${id}/remain`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postSet = async (data: { userId?: number, arenaId?: number, progress: string }): Promise<any> => {
    try {
        const response = await api.post(`/arenas/progress/set`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};
export const postGet = async (data: { arenaId?: number }): Promise<any> => {
    try {
        const response = await api.post(`/arenas/progress/get`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};
export const postDel = async (data: { arenaId?: number }): Promise<any> => {
    try {
        const response = await api.post(`/arenas/progress/del`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};