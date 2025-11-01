export interface HealthProfile {
  age?: string;
  conditions?: string[];
  currentMedications?: string[];
  allergies?: string[];
  dietaryRestrictions?: string[];
  isPregnant?: boolean;
  isBreastfeeding?: boolean;
  additionalNotes?: string;
}

export interface AnalysisRequest {
  imageBase64: string;
  analysisType: 'medication' | 'food' | 'interaction' | 'allergen';
  userProfile?: HealthProfile;
  additionalContext?: string;
}

export interface Warning {
  severity: 'critical' | 'moderate' | 'info';
  message: string;
  category: string;
}

export interface HealthScore {
  nutritionalValue?: number;
  ingredientQuality?: number;
  processingLevel?: number;
  overall?: number;
}

export interface AnalysisResponse {
  success: boolean;
  data?: {
    quickSummary: string;
    detailedAnalysis: any;
    healthScore?: HealthScore;
    warnings: Warning[];
    recommendations: string[];
  };
  error?: string;
}
