import { Router, Request, Response } from 'express';
import analysisService from '../../services/analysisService';

const router = Router();

// Analyze image with base64 data
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { imageBase64, analysisType, userProfile, additionalContext } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Image data is required',
      });
    }

    if (!analysisType || !['medication', 'food', 'interaction', 'allergen'].includes(analysisType)) {
      return res.status(400).json({
        success: false,
        error: 'Valid analysis type is required (medication, food, interaction, allergen)',
      });
    }

    const result = await analysisService.analyzeImage({
      imageBase64,
      analysisType,
      userProfile,
      additionalContext,
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Analysis route error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process analysis',
    });
  }
});

// Medication-specific analysis
router.post('/medication', async (req: Request, res: Response) => {
  try {
    const { imageBase64, userProfile } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Image data is required',
      });
    }

    const result = await analysisService.analyzeMedication(imageBase64, userProfile);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze medication',
    });
  }
});

// Food-specific analysis
router.post('/food', async (req: Request, res: Response) => {
  try {
    const { imageBase64, userProfile } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Image data is required',
      });
    }

    const result = await analysisService.analyzeFood(imageBase64, userProfile);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze food',
    });
  }
});

// Drug interaction check
router.post('/interactions', async (req: Request, res: Response) => {
  try {
    const { imageBase64, userProfile } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Image data is required',
      });
    }

    const result = await analysisService.checkDrugInteractions(imageBase64, userProfile);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to check interactions',
    });
  }
});

// Allergen detection
router.post('/allergens', async (req: Request, res: Response) => {
  try {
    const { imageBase64, userProfile } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Image data is required',
      });
    }

    const result = await analysisService.detectAllergens(imageBase64, userProfile);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to detect allergens',
    });
  }
});

export default router;
