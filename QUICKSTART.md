# HealthLens MVP - Quick Start Guide 🚀

## ✅ Installation Complete!

All dependencies have been installed successfully. Follow these steps to start the application:

## 🔑 Step 1: Configure Your Gemini API Key

1. Get your API key from: https://makersuite.google.com/app/apikey
2. Open the `.env` file in the root directory
3. Replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

## 🚀 Step 2: Start the Application

You have two options:

### Option A: Run Both Services Together
```bash
npm run dev
```

### Option B: Run Services Separately (Recommended for Development)

**Terminal 1 - Backend API:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

## 🌐 Access the Application

- **Frontend UI:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **API Health Check:** http://localhost:3001/api/health

## 📱 How to Use HealthLens

1. **Select Analysis Type:**
   - Medication Analysis
   - Food & Nutrition
   - Drug Interactions
   - Allergen Detection

2. **Upload or Capture Image:**
   - Click "Upload Image" to select from your device
   - Click "Take Photo" to use your camera
   - Ensure the label/packaging is clear and readable

3. **Optional - Add Health Profile:**
   - Click "Health Profile" to expand
   - Add your age, conditions, medications, allergies, etc.
   - This enables personalized health recommendations

4. **Analyze:**
   - Click the "Analyze Image" button
   - Wait for AI analysis (usually 5-10 seconds)
   - Review detailed results and recommendations

## 🎯 Test Images

Try these common items for testing:
- ✅ Over-the-counter medication bottles (Ibuprofen, Tylenol, etc.)
- ✅ Prescription medication labels
- ✅ Food nutrition labels
- ✅ Packaged food ingredients lists
- ✅ Restaurant menu items
- ✅ Supplement bottles

## 🐛 Troubleshooting

### Backend won't start
- Make sure you've added a valid Gemini API key to `.env`
- Check that port 3001 is not already in use

### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check that `VITE_API_URL` in `client/.env` is correct

### Camera not working
- Grant camera permissions in your browser
- Use HTTPS or localhost for camera access

### Dependencies issues
```bash
# Clean install
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

## 📚 Project Structure

```
NutritionScanner/
├── src/                      # Backend source
│   ├── server/              # Express server & routes
│   ├── services/            # Analysis logic
│   ├── config/              # Gemini configuration
│   ├── prompts/             # AI system prompts
│   └── types/               # TypeScript types
├── client/                   # Frontend source
│   └── src/
│       ├── components/      # React components
│       ├── services/        # API services
│       └── types/           # TypeScript types
└── README.md                # Full documentation
```

## 🔧 Development Commands

```bash
# Start development servers
npm run dev                   # Both backend & frontend
npm run server:dev           # Backend only
cd client && npm run dev     # Frontend only

# Build for production
npm run build                # Both
npm run build:server         # Backend only
npm run build:client         # Frontend only

# Start production server
npm start
```

## 📖 API Endpoints

- `GET /api/health` - Health check
- `POST /api/analysis/analyze` - General analysis
- `POST /api/analysis/medication` - Medication analysis
- `POST /api/analysis/food` - Food analysis
- `POST /api/analysis/interactions` - Drug interactions
- `POST /api/analysis/allergens` - Allergen detection

See `README.md` for detailed API documentation.

## 🎉 Next Steps

1. **Test the basic functionality** with sample images
2. **Fill in your health profile** for personalized results
3. **Try different analysis types** to see various features
4. **Review the code** in `src/` and `client/src/` to understand the architecture
5. **Customize the prompts** in `src/prompts/systemPrompt.ts` for different use cases

## 🆘 Need Help?

- Check the full `README.md` for detailed documentation
- Review example code in the components
- Check console logs for debugging information
- Ensure your Gemini API key has sufficient quota

## ⚠️ Important Notes

- This is a **MVP/prototype** for educational purposes
- Always verify medical information with healthcare professionals
- Do not use for actual medical decisions without professional consultation
- API calls to Gemini count against your quota

## 🎊 Ready to Start!

Run this command to start developing:

```bash
npm run dev
```

Then open http://localhost:5173 in your browser!

---

**Built for MLH Hackathon • Powered by Google Gemini AI**
