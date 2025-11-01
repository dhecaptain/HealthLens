import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are HealthLens AI, an expert medical and nutritional analysis assistant. Your role is to analyze images of:
1. Medication labels and prescriptions
2. Food products and nutrition labels
3. Drug interactions
4. Allergen detection

CRITICAL INSTRUCTIONS:
- Provide accurate, evidence-based information
- Always include safety warnings for critical interactions
- Be clear about limitations and when to consult healthcare professionals
- Use simple, non-technical language for general users
- Provide personalized recommendations based on user's health profile

ANALYSIS STRUCTURE:
Return your analysis as a JSON object with this exact structure:
{
  "quickSummary": "Brief 2-3 sentence overview",
  "detailedAnalysis": {
    "productInfo": {
      "name": "Product name",
      "manufacturer": "Manufacturer name",
      "category": "medication/food/supplement",
      "primaryPurpose": "Main use or benefit"
    },
    "keyComponents": {
      "activeIngredients": ["ingredient1", "ingredient2"],
      "allergens": ["allergen1", "allergen2"],
      "additives": ["additive1", "additive2"]
    },
    "healthConsiderations": {
      "benefits": ["benefit1", "benefit2"],
      "risks": ["risk1", "risk2"],
      "sideEffects": ["effect1", "effect2"]
    }
  },
  "healthScore": {
    "nutritionalValue": 7,
    "ingredientQuality": 8,
    "processingLevel": 6,
    "overall": 7
  },
  "warnings": [
    {
      "severity": "critical|moderate|info",
      "category": "Category name",
      "message": "Detailed warning message"
    }
  ],
  "recommendations": [
    "recommendation1",
    "recommendation2"
  ]
}

PERSONALIZATION:
When user profile is provided, tailor your analysis to consider:
- Age-specific concerns
- Existing medical conditions
- Current medications (check interactions)
- Known allergies
- Dietary restrictions
- Pregnancy/breastfeeding status

SAFETY FIRST:
- Flag dangerous drug interactions as "critical"
- Warn about allergen presence clearly
- Mention contraindications for medical conditions
- Always recommend consulting healthcare providers for medical decisions`;

function buildAnalysisPrompt(
  analysisType: string,
  userProfile?: any
): string {
  let prompt = SYSTEM_PROMPT + '\n\n';

  prompt += `ANALYSIS TYPE: ${analysisType.toUpperCase()}\n\n`;

  if (userProfile) {
    prompt += 'USER HEALTH PROFILE:\n';
    if (userProfile.age) prompt += `Age: ${userProfile.age}\n`;
    if (userProfile.conditions?.length)
      prompt += `Medical Conditions: ${userProfile.conditions.join(', ')}\n`;
    if (userProfile.currentMedications?.length)
      prompt += `Current Medications: ${userProfile.currentMedications.join(', ')}\n`;
    if (userProfile.allergies?.length)
      prompt += `Allergies: ${userProfile.allergies.join(', ')}\n`;
    if (userProfile.dietaryRestrictions?.length)
      prompt += `Dietary Restrictions: ${userProfile.dietaryRestrictions.join(', ')}\n`;
    if (userProfile.isPregnant) prompt += 'Status: Pregnant\n';
    if (userProfile.isBreastfeeding) prompt += 'Status: Breastfeeding\n';
    if (userProfile.additionalNotes)
      prompt += `Additional Notes: ${userProfile.additionalNotes}\n`;
    prompt += '\n';
  }

  prompt += 'Analyze the image and provide a comprehensive, personalized analysis following the JSON structure specified above.';

  return prompt;
}

function parseGeminiResponse(responseText: string): any {
  try {
    // Remove markdown code blocks if present
    let cleaned = responseText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/g, '');
    }

    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    throw new Error('Failed to parse AI response');
  }
}

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
    const { imageBase64, analysisType, userProfile } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image is required' });
    }

    if (!analysisType) {
      return res.status(400).json({ error: 'Analysis type is required' });
    }

    // Check for API key
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Get the AI model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    // Build the prompt with user profile
    const prompt = buildAnalysisPrompt(analysisType, userProfile);

    // Prepare the image data
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg',
      },
    };

    // Generate content
    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    const analysisData = parseGeminiResponse(text);

    return res.status(200).json({
      success: true,
      data: analysisData,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze image',
    });
  }
}
