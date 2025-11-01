# HealthLens MVP 🏥

![HealthLens Logo](https://img.shields.io/badge/HealthLens-AI%20Powered-blue?style=for-the-badge)
![MLH Hackathon](https://img.shields.io/badge/MLH-Hackathon-red?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Powered%20By-Google%20Gemini-4285F4?style=for-the-badge)

**HealthLens** is an AI-powered medication and nutrition analysis assistant that helps users make informed health decisions by analyzing images of medication labels, food packaging, and restaurant menus. Built with Google Gemini AI, HealthLens provides personalized health insights based on user profiles.

## 🌟 Features

### Core Capabilities

- **🔬 Medication Analysis**
  - Identify medication names (brand and generic)
  - Extract active ingredients and dosages
  - List common uses and side effects
  - Flag important warnings and contraindications
  - Check drug interactions
  - Provide proper usage instructions

- **🍎 Food & Nutrition Analysis**
  - Extract complete nutritional information
  - Identify all ingredients in order
  - Flag common allergens
  - Highlight artificial additives and preservatives
  - Calculate health scores
  - Suggest healthier alternatives

- **💊 Drug Interaction Checker**
  - Identify potential interactions (major, moderate, minor)
  - Explain interaction mechanisms
  - Provide severity ratings
  - Suggest timing strategies

- **🛡️ Allergen Detection**
  - Scan for user-specified allergens
  - Check cross-contamination warnings
  - Identify hidden allergen sources
  - Flag "may contain" warnings

### Personalized Health Recommendations

- Adapt warnings for specific conditions (diabetes, hypertension, etc.)
- Account for pregnancy/breastfeeding status
- Consider age-specific concerns
- Respect dietary restrictions (vegan, kosher, halal, keto, etc.)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NutritionScanner
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env and add your Gemini API key
   nano .env
   ```

   Update the following in `.env`:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3001
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the development servers**
   ```bash
   # Start both backend and frontend
   npm run dev
   ```

   Or run them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server:dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
NutritionScanner/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── HealthProfileForm.tsx
│   │   │   └── AnalysisResults.tsx
│   │   ├── services/         # API services
│   │   │   └── api.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── src/                       # Backend server
│   ├── server/
│   │   ├── routes/           # API routes
│   │   │   ├── analysisRoutes.ts
│   │   │   └── healthRoutes.ts
│   │   └── index.ts          # Express server
│   ├── services/             # Business logic
│   │   └── analysisService.ts
│   ├── config/               # Configuration
│   │   └── gemini.ts
│   ├── prompts/              # AI prompts
│   │   └── systemPrompt.ts
│   └── types/                # TypeScript types
│       └── index.ts
│
├── package.json              # Root package.json
├── tsconfig.json             # TypeScript config
└── README.md                 # This file
```

## 🔧 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Health Check
```http
GET /health
```
Returns API health status

#### Image Analysis
```http
POST /analysis/analyze
Content-Type: application/json

{
  "imageBase64": "data:image/jpeg;base64,...",
  "analysisType": "medication|food|interaction|allergen",
  "userProfile": {
    "age": "35",
    "conditions": ["hypertension"],
    "currentMedications": ["Lisinopril"],
    "allergies": ["peanuts"],
    "dietaryRestrictions": ["vegetarian"],
    "isPregnant": false,
    "isBreastfeeding": false,
    "additionalNotes": "..."
  }
}
```

#### Medication Analysis
```http
POST /analysis/medication
Content-Type: application/json

{
  "imageBase64": "data:image/jpeg;base64,...",
  "userProfile": { ... }
}
```

#### Food Analysis
```http
POST /analysis/food
Content-Type: application/json

{
  "imageBase64": "data:image/jpeg;base64,...",
  "userProfile": { ... }
}
```

#### Drug Interactions
```http
POST /analysis/interactions
Content-Type: application/json

{
  "imageBase64": "data:image/jpeg;base64,...",
  "userProfile": { ... }
}
```

#### Allergen Detection
```http
POST /analysis/allergens
Content-Type: application/json

{
  "imageBase64": "data:image/jpeg;base64,...",
  "userProfile": { ... }
}
```

### Response Format

```json
{
  "success": true,
  "data": {
    "quickSummary": "Brief 2-3 sentence summary",
    "detailedAnalysis": {
      "productInfo": { ... },
      "keyComponents": { ... },
      "healthConsiderations": { ... }
    },
    "healthScore": {
      "nutritionalValue": 8,
      "ingredientQuality": 7,
      "processingLevel": 6,
      "overall": 7
    },
    "warnings": [
      {
        "severity": "critical|moderate|info",
        "message": "Warning message",
        "category": "Category name"
      }
    ],
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ]
  }
}
```

## 🎨 User Interface

### Main Features

1. **Analysis Type Selection**
   - Medication
   - Food & Nutrition
   - Drug Interactions
   - Allergen Detection

2. **Image Input**
   - Upload from device
   - Capture with camera
   - Clear and retake

3. **Health Profile Management**
   - Age
   - Medical conditions
   - Current medications
   - Allergies
   - Dietary restrictions
   - Pregnancy/breastfeeding status
   - Additional notes

4. **Results Display**
   - Quick summary
   - Health scores (for food items)
   - Color-coded warnings (critical, moderate, info)
   - Personalized recommendations
   - Detailed analysis
   - Medical disclaimers

## 🔐 Security & Privacy

- ⚠️ **Important**: This is a prototype/MVP. Do not store sensitive health data in production without proper encryption and compliance measures.
- API keys should never be committed to version control
- Always use HTTPS in production
- Consider implementing user authentication for production
- Comply with HIPAA/GDPR if handling real patient data

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables:
   ```bash
   GEMINI_API_KEY=your_key
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.com
   ```

2. Build and deploy:
   ```bash
   npm run build
   npm start
   ```

### Frontend Deployment (Vercel/Netlify)

1. Set environment variable:
   ```bash
   VITE_API_URL=https://your-backend-api.com/api
   ```

2. Build:
   ```bash
   cd client
   npm run build
   ```

3. Deploy the `client/dist` folder

## 🧪 Testing

### Manual Testing Scenarios

1. **Common OTC Medications** (ibuprofen, acetaminophen)
2. **Prescription Bottles** (various medication classes)
3. **Food Labels** with allergens
4. **Restaurant Menus**
5. **Supplement Bottles**
6. **Multi-medication Combinations**
7. **Edge Cases** (blurry images, foreign languages)
8. **Different User Profiles** (diabetic, pregnant, elderly)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run server:dev       # Start backend only
npm run client:dev       # Start frontend only (from client dir)

# Building
npm run build           # Build both frontend and backend
npm run build:server    # Build backend only
npm run build:client    # Build frontend only

# Production
npm start              # Start production server

# Installation
npm run install:all    # Install all dependencies
```

### Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite (with Rolldown)
- Axios
- Lucide React (icons)

**Backend:**
- Node.js + Express
- TypeScript
- Google Generative AI SDK (Gemini)
- Multer (file uploads)
- Helmet (security)
- CORS

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful multimodal analysis
- **MLH (Major League Hacking)** for the hackathon opportunity
- Open source community for amazing tools and libraries

## ⚠️ Disclaimer

**This application is for informational and educational purposes only.**

HealthLens is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or medication. Never disregard professional medical advice or delay in seeking it because of something you have read or seen through this application.

The analysis provided by HealthLens is based on image recognition and AI interpretation, which may not always be 100% accurate. Always verify information with healthcare professionals and official product documentation.

## 📧 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ for the MLH Hackathon**

*Powered by Google Gemini AI • Version 1.0 MVP*
