import api from '@/utils/axios';
import { AxiosRequestConfig } from 'axios';
import { CommentType } from './types';

export const getTopics = async (params: AxiosRequestConfig['params']): Promise<any> => {
    try {
        const response = await api.get('/topics', { params });
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const getTopic = async (slug: string): Promise<any> => {
    try {
        const response = await api.get(`/topics/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const postTopic = async (data: { title: string, content: string }): Promise<any> => {
    try {
        const response = await api.post(`/topics`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
};

export const putTopic = async (id: number, data: { title: string, content: string, attachment?: string }): Promise<any> => {
    try {
        const response = await api.put(`/topics/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}

export const deleteTopic = async (id: number): Promise<any> => {
    try {
        const response = await api.delete(`/topics/${id}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}

export const postCommnet = async (data: { topic_id: string, content: string }): Promise<any> => {
    try {
        const response = await api.post(`/topics/0/comments`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}

export const putComment = async (id: number, data: { content: string, attachment?: string }): Promise<any> => {
    try {
        const response = await api.put(`/topics/0/comments/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}

export const deleteComment = async (id: number): Promise<any> => {
    try {
        const response = await api.delete(`/topics/0/comments/${id}`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}

export const postLikeCommnet = async (commentId: number): Promise<any> => {
    try {
        const response = await api.post(`/topics/1/comments/${commentId}/like`);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}

