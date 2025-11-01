import React, { useState } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { HealthProfileForm } from './components/HealthProfileForm';
import { AnalysisResults } from './components/AnalysisResults';
import { HistoryModal } from './components/HistoryModal';
import { ShareExport } from './components/ShareExport';
import { QuickTips } from './components/QuickTips';
import { analysisService } from './services/api';
import { historyService, type HistoryItem } from './services/historyService';
import type { HealthProfile, AnalysisResponse } from './types';
import { Pill, Apple, Shield, Loader2, Clock, Sparkles } from 'lucide-react';

function App() {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [analysisType, setAnalysisType] = useState<'medication' | 'food' | 'interaction' | 'allergen'>('medication');
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({});
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analysisService.analyzeImage({
        imageBase64: selectedImage,
        analysisType,
        userProfile: healthProfile,
      });
      setAnalysisResult(result);
      
      // Save to history if successful
      if (result.success) {
        historyService.saveToHistory(analysisType, result, selectedImage);
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      setAnalysisResult({
        success: false,
        error: error.message || 'Failed to analyze image. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearImage = () => {
    setSelectedImage('');
    setAnalysisResult(null);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setAnalysisResult(item.result);
    setAnalysisType(item.analysisType as any);
    if (item.imageThumbnail) {
      setSelectedImage(item.imageThumbnail);
    }
  };

  const analysisTypes = [
    { value: 'medication', label: 'Medication', icon: Pill, color: 'blue' },
    { value: 'food', label: 'Food & Nutrition', icon: Apple, color: 'green' },
    { value: 'interaction', label: 'Drug Interactions', icon: Shield, color: 'red' },
    { value: 'allergen', label: 'Allergen Detection', icon: Shield, color: 'yellow' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
                <Shield className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HealthLens
                </h1>
                <p className="text-gray-600 text-sm">AI-Powered Health Analysis Assistant</p>
              </div>
            </div>
            {/* History Button */}
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
            >
              <Clock size={20} />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>
      </header>

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectItem={handleSelectHistoryItem}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Analysis Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analysis Type Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Select Analysis Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {analysisTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = analysisType === type.value;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setAnalysisType(type.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? `border-${type.color}-600 bg-${type.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon
                        size={24}
                        className={isSelected ? `text-${type.color}-600` : 'text-gray-600'}
                      />
                      <span className={`text-sm font-medium text-center ${
                        isSelected ? `text-${type.color}-700` : 'text-gray-700'
                      }`}>
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Tips */}
            {!selectedImage && !analysisResult && (
              <QuickTips analysisType={analysisType} />
            )}

            {/* Image Upload */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Upload or Capture Image</h2>
              <ImageUpload
                onImageSelected={setSelectedImage}
                selectedImage={selectedImage}
                onClearImage={handleClearImage}
              />
            </div>

            {/* Analyze Button */}
            {selectedImage && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield size={24} />
                    Analyze Image
                  </>
                )}
              </button>
            )}

            {/* Loading Skeleton */}
            {isAnalyzing && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-20 bg-gray-100 rounded"></div>
                      <div className="h-20 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Sparkles className="mx-auto text-blue-600 mb-2" size={32} />
                  <p className="text-gray-600 font-medium">Analyzing with AI...</p>
                  <p className="text-sm text-gray-500 mt-1">This may take 10-30 seconds</p>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {!isAnalyzing && analysisResult && (
              <div className="mt-6 space-y-6">
                {/* Share/Export Options */}
                {analysisResult.success && <ShareExport result={analysisResult} />}
                
                {/* Results */}
                <AnalysisResults result={analysisResult} />
              </div>
            )}
          </div>

          {/* Right Column - Health Profile */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <HealthProfileForm profile={healthProfile} onChange={setHealthProfile} />
              
              {/* Info Card */}
              <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3">How it works</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>Select your analysis type</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>Upload or capture an image</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>Fill in your health profile (optional)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">4.</span>
                    <span>Click "Analyze" for personalized insights</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            HealthLens MVP - Built for MLH Hackathon • Powered by Google Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
