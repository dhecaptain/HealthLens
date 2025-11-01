# 🏥 HealthLens - AI-Powered Health Analysis Assistant

HealthLens is an AI-powered application that analyzes medication labels, food packaging, and nutrition information to provide personalized health insights using Google Gemini AI.

## ✨ Features

- 📋 **Medication Analysis** - Analyze prescription and OTC medication labels
- 🍎 **Food & Nutrition** - Scan food products and nutrition labels
- ⚠️ **Drug Interactions** - Check for dangerous medication interactions
- 🛡️ **Allergen Detection** - Identify potential allergens in products
- 📜 **Scan History** - Save and review past analyses
- 📤 **Export & Share** - Download results as JSON/TXT or share via native API
- 💡 **Smart Tips** - Context-aware tips for better results
- 👤 **Health Profile** - Personalized recommendations based on your health data

## 🚀 Deployment to Vercel

### Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. A [Google Gemini API key](https://makersuite.google.com/app/apikey)
3. Git installed on your machine

### Step 1: Prepare Your Repository

```bash
# Navigate to your project
cd /home/david/Documents/NutritionScanner/client

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit - HealthLens MVP"

# Create a GitHub repository and push
# (Follow GitHub's instructions to create a new repository)
git remote add origin https://github.com/YOUR_USERNAME/healthlens.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: Leave as `./` (or select `client` if needed)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variable**:
   - Click "Environment Variables"
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key from https://makersuite.google.com/app/apikey
   - Click "Add"

6. Click "Deploy"
7. Wait for deployment to complete (2-3 minutes)
8. Your app will be live at `https://your-project-name.vercel.app`

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? healthlens (or your choice)
# - Directory? ./ (press Enter)

# Add environment variable
vercel env add GEMINI_API_KEY

# When prompted, paste your Gemini API key
# Select: Production, Preview, Development (all)

# Deploy to production
vercel --prod
```

### Step 3: Verify Deployment

1. Visit your deployed URL
2. Try uploading an image or taking a photo
3. Click "Analyze" and verify the AI analysis works
4. Check the browser console for any errors

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ and npm
- A Google Gemini API key

### Setup

```bash
# Install dependencies
npm install

# Create .env.local file with your API key
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
client/
├── api/                    # Vercel Serverless Functions
│   └── analyze.ts         # Main analysis API endpoint
├── src/
│   ├── components/        # React components
│   │   ├── ImageUpload.tsx
│   │   ├── HealthProfileForm.tsx
│   │   ├── AnalysisResults.tsx
│   │   ├── HistoryModal.tsx
│   │   ├── ShareExport.tsx
│   │   └── QuickTips.tsx
│   ├── services/          # API and storage services
│   │   ├── api.ts
│   │   └── historyService.ts
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── vercel.json            # Vercel configuration
├── package.json
└── vite.config.ts
```

## 🔧 Troubleshooting

### Issue: "Cannot connect to server" error

**Solution**: Make sure your `GEMINI_API_KEY` environment variable is set in Vercel:
1. Go to your project settings on Vercel
2. Click "Environment Variables"
3. Add `GEMINI_API_KEY` with your actual API key
4. Redeploy the project

### Issue: "Failed to analyze image" error

**Possible causes**:
- Invalid API key
- Image too large (>50MB)
- Network timeout

**Solution**:
- Verify your API key is correct
- Try a smaller image
- Check Vercel function logs for details

### Issue: App loads but analysis doesn't work

**Solution**:
- Open browser DevTools (F12)
- Check the Console tab for errors
- Check the Network tab to see if API requests are failing
- Verify the `/api/analyze` endpoint is being called

## 📝 Environment Variables

### Production (Vercel)

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |

### Development (Local)

Create `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

## 🎯 Features Roadmap

- [ ] Barcode scanning for packaged foods
- [ ] Voice assistant integration
- [ ] Multi-language support
- [ ] Offline mode with cached results
- [ ] Doctor/pharmacist consultation booking
- [ ] Medication reminders

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## ⚕️ Medical Disclaimer

This application is for **informational purposes only** and should not replace professional medical advice. Always consult your healthcare provider before making medical decisions.

---

Built with ❤️ using React, TypeScript, Vite, and Google Gemini AI
