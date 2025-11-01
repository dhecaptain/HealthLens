import React from 'react';
import { Lightbulb, X } from 'lucide-react';

interface QuickTipsProps {
  analysisType: string;
}

const tips = {
  medication: [
    'Take a clear photo of the label with good lighting',
    'Include both the front and back of the medication bottle if possible',
    'Make sure the text is readable and not blurry',
    'Include dosage information for accurate analysis',
  ],
  food: [
    'Capture the nutrition facts label clearly',
    'Include the ingredients list',
    'Make sure allergen warnings are visible',
    'Check both front and back labels for complete info',
  ],
  interaction: [
    'Add all your current medications to your health profile',
    'Include any supplements or vitamins you take',
    'Mention any chronic health conditions',
    'Upload clear photos of all medication labels',
  ],
  allergen: [
    'List all your allergies in your health profile',
    'Capture the full ingredients list',
    'Look for "may contain" warnings on the label',
    'Check for cross-contamination information',
  ],
};

export const QuickTips: React.FC<QuickTipsProps> = ({ analysisType }) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [hasBeenDismissed, setHasBeenDismissed] = React.useState(false);

  React.useEffect(() => {
    if (!hasBeenDismissed) {
      setIsVisible(true);
    }
  }, [analysisType, hasBeenDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasBeenDismissed(true);
  };

  if (!isVisible) return null;

  const currentTips = tips[analysisType as keyof typeof tips] || tips.food;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 relative animate-fadeIn">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-amber-100 rounded transition-colors"
      >
        <X size={16} className="text-amber-700" />
      </button>
      <div className="flex items-start gap-3">
        <Lightbulb className="text-amber-600 flex-shrink-0 mt-1" size={24} />
        <div>
          <h3 className="font-semibold text-amber-900 mb-2">Quick Tips for Better Results</h3>
          <ul className="space-y-1">
            {currentTips.map((tip, index) => (
              <li key={index} className="text-sm text-amber-800 flex items-start gap-2">
                <span className="text-amber-600">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
