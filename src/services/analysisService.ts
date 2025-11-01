import { getGeminiModel } from '../config/gemini';
import { buildAnalysisPrompt } from '../prompts/systemPrompt';
import { AnalysisRequest, AnalysisResponse, Warning } from '../types';

export class AnalysisService {
  async analyzeImage(request: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      const model = getGeminiModel();
      const prompt = buildAnalysisPrompt(
        request.analysisType,
        request.userProfile,
        request.additionalContext
      );

      // Convert base64 to proper format for Gemini
      const imageData = this.prepareImageData(request.imageBase64);

      // Generate content with image and prompt
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageData,
            mimeType: 'image/jpeg', // Default to JPEG, could be made dynamic
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      const analysisData = this.parseGeminiResponse(text);

      return {
        success: true,
        data: {
          quickSummary: analysisData.quickSummary || '',
          detailedAnalysis: analysisData,
          healthScore: analysisData.healthScore,
          warnings: this.extractWarnings(analysisData.personalizedAlerts || []),
          recommendations: analysisData.recommendations || [],
        },
      };
    } catch (error: any) {
      console.error('Analysis error:', error);
      return {
        success: false,
        error: error.message || 'Failed to analyze image',
      };
    }
  }

  private prepareImageData(base64String: string): string {
    // Remove data URL prefix if present
    if (base64String.includes('base64,')) {
      return base64String.split('base64,')[1];
    }
    return base64String;
  }

  private parseGeminiResponse(text: string): any {
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      // Try to parse as direct JSON
      return JSON.parse(text);
    } catch (error) {
      // If JSON parsing fails, return structured text response
      return {
        quickSummary: text.substring(0, 200),
        rawResponse: text,
      };
    }
  }

  private extractWarnings(alerts: any[]): Warning[] {
    return alerts.map((alert: any) => ({
      severity: alert.severity || 'info',
      message: alert.message || '',
      category: alert.category || 'General',
    }));
  }

  async analyzeMedication(imageBase64: string, userProfile?: any): Promise<AnalysisResponse> {
    return this.analyzeImage({
      imageBase64,
      analysisType: 'medication',
      userProfile,
    });
  }

  async analyzeFood(imageBase64: string, userProfile?: any): Promise<AnalysisResponse> {
    return this.analyzeImage({
      imageBase64,
      analysisType: 'food',
      userProfile,
    });
  }

  async checkDrugInteractions(imageBase64: string, userProfile?: any): Promise<AnalysisResponse> {
    return this.analyzeImage({
      imageBase64,
      analysisType: 'interaction',
      userProfile,
    });
  }

  async detectAllergens(imageBase64: string, userProfile?: any): Promise<AnalysisResponse> {
    return this.analyzeImage({
      imageBase64,
      analysisType: 'allergen',
      userProfile,
    });
  }
}

export default new AnalysisService();
