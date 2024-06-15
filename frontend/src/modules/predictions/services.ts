import api from '@/utils/predict';
import { PredictRequest } from './type';
export const postSetTarget = async (data: PredictRequest): Promise<any> => {
    try {
        const response = await api.post('/', data);
        return response.data;
    } catch (error) {
        console.error('Call API Error:', error);
        throw error;
    }
}