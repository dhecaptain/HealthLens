import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiModel = (modelName: string = 'gemini-2.0-flash-exp') => {
  return genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      temperature: 0.3, // Lower temperature for consistent medical analysis
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    }
  });
};

export default genAI;
