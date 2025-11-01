import React from 'react';
import type { AnalysisResponse, Warning } from '../types';
import { 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  Package, 
  Building2,
  Leaf,
  Scale,
  Heart,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResponse;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  if (!result.success || !result.data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle size={24} />
          <h3 className="text-lg font-semibold">Analysis Failed</h3>
        </div>
        <p className="mt-2 text-red-700">{result.error || 'Unknown error occurred'}</p>
      </div>
    );
  }

  const { data } = result;
  const analysis = data.detailedAnalysis;

  const getWarningIcon = (severity: Warning['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="text-red-600" size={20} />;
      case 'moderate':
        return <AlertCircle className="text-yellow-600" size={20} />;
      case 'info':
        return <Info className="text-blue-600" size={20} />;
    }
  };

  const getWarningColor = (severity: Warning['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Quick Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Summary</h3>
            <p className="text-gray-700 leading-relaxed">{data.quickSummary}</p>
          </div>
        </div>
      </div>

      {/* Product Information */}
      {analysis?.productInfo && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold">Product Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {analysis.productInfo.name && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Sparkles className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Product Name</div>
                  <div className="font-semibold text-gray-900">{analysis.productInfo.name}</div>
                </div>
              </div>
            )}
            {analysis.productInfo.manufacturer && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Building2 className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Manufacturer</div>
                  <div className="font-semibold text-gray-900">{analysis.productInfo.manufacturer}</div>
                </div>
              </div>
            )}
            {analysis.productInfo.category && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Info className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Category</div>
                  <div className="font-semibold text-gray-900 capitalize">{analysis.productInfo.category}</div>
                </div>
              </div>
            )}
            {analysis.productInfo.primaryPurpose && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Heart className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Primary Purpose</div>
                  <div className="font-semibold text-gray-900">{analysis.productInfo.primaryPurpose}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Health Score */}
      {data.healthScore && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold">Health Score</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.healthScore.nutritionalValue !== undefined && (
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className={`text-4xl font-bold ${getScoreColor(data.healthScore.nutritionalValue)}`}>
                  {data.healthScore.nutritionalValue}
                  <span className="text-xl text-gray-500">/10</span>
                </div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  {getScoreLabel(data.healthScore.nutritionalValue)}
                </div>
                <div className="text-sm text-gray-700 mt-2 font-semibold">Nutritional Value</div>
              </div>
            )}
            {data.healthScore.ingredientQuality !== undefined && (
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className={`text-4xl font-bold ${getScoreColor(data.healthScore.ingredientQuality)}`}>
                  {data.healthScore.ingredientQuality}
                  <span className="text-xl text-gray-500">/10</span>
                </div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  {getScoreLabel(data.healthScore.ingredientQuality)}
                </div>
                <div className="text-sm text-gray-700 mt-2 font-semibold">Ingredient Quality</div>
              </div>
            )}
            {data.healthScore.processingLevel !== undefined && (
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                <div className={`text-4xl font-bold ${getScoreColor(data.healthScore.processingLevel)}`}>
                  {data.healthScore.processingLevel}
                  <span className="text-xl text-gray-500">/10</span>
                </div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  {getScoreLabel(data.healthScore.processingLevel)}
                </div>
                <div className="text-sm text-gray-700 mt-2 font-semibold">Processing Level</div>
              </div>
            )}
            {data.healthScore.overall !== undefined && (
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className={`text-4xl font-bold ${getScoreColor(data.healthScore.overall)}`}>
                  {data.healthScore.overall}
                  <span className="text-xl text-gray-500">/10</span>
                </div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  {getScoreLabel(data.healthScore.overall)}
                </div>
                <div className="text-sm text-gray-700 mt-2 font-semibold">Overall Score</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Ingredients/Components */}
      {analysis?.keyComponents && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold">Key Ingredients</h3>
          </div>
          <div className="space-y-4">
            {analysis.keyComponents.activeIngredients && analysis.keyComponents.activeIngredients.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Main Ingredients:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keyComponents.activeIngredients.map((ingredient: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.keyComponents.allergens && analysis.keyComponents.allergens.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-2">⚠️ Allergens Detected:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keyComponents.allergens.map((allergen: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.keyComponents.additives && analysis.keyComponents.additives.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-orange-700 mb-2">Additives & Preservatives:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keyComponents.additives.map((additive: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      {additive}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Health Considerations */}
      {analysis?.healthConsiderations && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="text-red-600" size={24} />
            <h3 className="text-lg font-semibold">Health Considerations</h3>
          </div>
          <div className="space-y-4">
            {analysis.healthConsiderations.benefits && analysis.healthConsiderations.benefits.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Benefits
                </h4>
                <ul className="space-y-1 ml-7">
                  {analysis.healthConsiderations.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="text-green-700 text-sm">• {benefit}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.healthConsiderations.risks && analysis.healthConsiderations.risks.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <ShieldAlert size={20} />
                  Potential Risks
                </h4>
                <ul className="space-y-1 ml-7">
                  {analysis.healthConsiderations.risks.map((risk: string, index: number) => (
                    <li key={index} className="text-yellow-700 text-sm">• {risk}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.healthConsiderations.sideEffects && analysis.healthConsiderations.sideEffects.length > 0 && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <AlertCircle size={20} />
                  Possible Side Effects
                </h4>
                <ul className="space-y-1 ml-7">
                  {analysis.healthConsiderations.sideEffects.map((effect: string, index: number) => (
                    <li key={index} className="text-orange-700 text-sm">• {effect}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Personalized Alerts */}
      {data.warnings && data.warnings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="text-yellow-600" size={24} />
            Personalized Health Alerts
          </h3>
          {data.warnings.map((warning, index) => (
            <div
              key={index}
              className={`border-l-4 rounded-r-lg p-4 ${getWarningColor(warning.severity)}`}
            >
              <div className="flex items-start gap-3">
                {getWarningIcon(warning.severity)}
                <div className="flex-1">
                  <div className="font-bold mb-1 text-base">{warning.category}</div>
                  <p className="text-sm leading-relaxed">{warning.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border border-green-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Scale className="text-green-600" size={24} />
            Our Recommendations
          </h3>
          <ul className="space-y-3">
            {data.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <span className="text-green-600 font-bold flex-shrink-0 text-xl">✓</span>
                <span className="text-gray-700 leading-relaxed">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-blue-500 rounded-r-lg p-4 text-sm text-gray-700">
        <p className="font-bold mb-2 text-gray-900 flex items-center gap-2">
          <Info size={18} className="text-blue-500" />
          ⚕️ Important Medical Disclaimer
        </p>
        <p className="leading-relaxed">
          This analysis is for <strong>informational purposes only</strong> and should not replace professional
          medical advice. Always consult your doctor or pharmacist before starting, stopping, or
          changing any medication. Individual responses may vary. If you experience severe reactions,
          contact emergency services immediately.
        </p>
      </div>
    </div>
  );
};
