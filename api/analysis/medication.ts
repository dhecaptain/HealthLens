import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, userProfile } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Check for API key
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    let prompt = `You are a medication analysis expert. Analyze this medication label/prescription and provide detailed information in JSON format.`;
    
    if (userProfile) {
      prompt += `\n\nUser Profile:\n`;
      if (userProfile.age) prompt += `Age: ${userProfile.age}\n`;
      if (userProfile.conditions?.length) prompt += `Conditions: ${userProfile.conditions.join(', ')}\n`;
      if (userProfile.currentMedications?.length) prompt += `Current Medications: ${userProfile.currentMedications.join(', ')}\n`;
      if (userProfile.allergies?.length) prompt += `Allergies: ${userProfile.allergies.join(', ')}\n`;
    }

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const text = response.text();

    return res.status(200).json({
      success: true,
      data: { analysis: text },
    });
  } catch (error: any) {
    console.error('Medication analysis error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze medication',
    });
  }
}
