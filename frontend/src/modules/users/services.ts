import api from '@/utils/axios';
import { LoginRequest, RegisterRequest, User } from './type';
import { AxiosRequestConfig } from 'axios';

export const postLogin = async (request: LoginRequest): Promise<any> => {
    try {
        const response = await api.post('/sign-in', request);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postRegister = async (request: RegisterRequest): Promise<any> => {
    try {
        const response = await api.post('/sign-up', request);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getGoogleUrl = async () => {
    try {
        const response = await api.get('/google-sign-in');
        return response.data;
    } catch (error) {
        console.error('Get Posts Error:', error);
        throw error;
    }
};

export const getGoogleCallback = async (params?: AxiosRequestConfig['params']) => {
    try {
        const response = await api.get('/google-callback', { params });
        return response.data;
    } catch (error) {
        console.error('Get Posts Error:', error);
        throw error;
    }
};

export const postForgot = async (request: { email: string }): Promise<any> => {
    try {
        const response = await api.post('/forgot', request);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postReset = async (request: { token: string, email: string, password: string }): Promise<any> => {
    try {
        const response = await api.post('/reset', request);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getProfile = async (username: string) => {
    try {
        const response = await api.get(`/profiles/${username}`);
        return response.data;
    } catch (error) {
        console.error('Get Posts Error:', error);
        throw error;
    }
};

export const getProfiles = async (params?: AxiosRequestConfig['params']) => {
    try {
        const response = await api.get(`/profiles/list`, { params });
        return response.data;
    } catch (error) {
        console.error('Get Posts Error:', error);
        throw error;
    }
};

export const postProfile = async (request: User | undefined): Promise<any> => {
    try {
        const response = await api.post('/profiles/update', request);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getMyProfile = async () => {
    try {
        const response = await api.get(`/my-profile`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postAvatar = async (form: FormData) => {
    try {
        const response = await api.post('/profiles/avatar', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}