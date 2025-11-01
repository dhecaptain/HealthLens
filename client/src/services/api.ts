import axios from 'axios';
import type { AnalysisRequest, AnalysisResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout for AI processing
  maxContentLength: 50 * 1024 * 1024, // 50MB
  maxBodyLength: 50 * 1024 * 1024, // 50MB
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - the server took too long to respond');
    }
    if (error.response) {
      throw new Error(error.response.data?.error || 'Server error occurred');
    }
    if (error.request) {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 3001');
    }
    throw error;
  }
);

export const healthService = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  checkStatus: async () => {
    const response = await api.get('/health/status');
    return response.data;
  },
};

export const analysisService = {
  analyzeImage: async (request: AnalysisRequest): Promise<AnalysisResponse> => {
    try {
      console.log('Sending analysis request to:', `${API_BASE_URL}/analysis/analyze`);
      const response = await api.post('/analysis/analyze', request);
      return response.data;
    } catch (error: any) {
      console.error('Analysis error:', error);
      throw error;
    }
  },

  analyzeMedication: async (imageBase64: string, userProfile?: any): Promise<AnalysisResponse> => {
    try {
      const response = await api.post('/analysis/medication', { imageBase64, userProfile });
      return response.data;
    } catch (error: any) {
      console.error('Medication analysis error:', error);
      throw error;
    }
  },

  analyzeFood: async (imageBase64: string, userProfile?: any): Promise<AnalysisResponse> => {
    try {
      const response = await api.post('/analysis/food', { imageBase64, userProfile });
      return response.data;
    } catch (error: any) {
      console.error('Food analysis error:', error);
      throw error;
    }
  },

  checkDrugInteractions: async (imageBase64: string, userProfile?: any): Promise<AnalysisResponse> => {
    try {
      const response = await api.post('/analysis/interactions', { imageBase64, userProfile });
      return response.data;
    } catch (error: any) {
      console.error('Interaction check error:', error);
      throw error;
    }
  },

  detectAllergens: async (imageBase64: string, userProfile?: any): Promise<AnalysisResponse> => {
    try {
      const response = await api.post('/analysis/allergens', { imageBase64, userProfile });
      return response.data;
    } catch (error: any) {
      console.error('Allergen detection error:', error);
      throw error;
    }
  },
};

export default api;
