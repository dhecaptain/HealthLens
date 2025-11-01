import { Router, Request, Response } from 'express';

const router = Router();

// Health check endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'HealthLens API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Detailed health check
router.get('/status', (req: Request, res: Response) => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  
  res.json({
    success: true,
    status: 'healthy',
    services: {
      api: 'operational',
      gemini: hasGeminiKey ? 'configured' : 'not configured',
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

export default router;
