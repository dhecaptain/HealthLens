import React from 'react';
import type { HealthProfile } from '../types';
import { User, Plus, X } from 'lucide-react';

interface HealthProfileFormProps {
  profile: HealthProfile;
  onChange: (profile: HealthProfile) => void;
}

export const HealthProfileForm: React.FC<HealthProfileFormProps> = ({
  profile,
  onChange,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [newItem, setNewItem] = React.useState('');
  const [addingTo, setAddingTo] = React.useState<string | null>(null);

  const addArrayItem = (field: keyof HealthProfile, value: string) => {
    if (!value.trim()) return;
    const currentArray = (profile[field] as string[]) || [];
    onChange({
      ...profile,
      [field]: [...currentArray, value.trim()],
    });
    setNewItem('');
    setAddingTo(null);
  };

  const removeArrayItem = (field: keyof HealthProfile, index: number) => {
    const currentArray = (profile[field] as string[]) || [];
    onChange({
      ...profile,
      [field]: currentArray.filter((_, i) => i !== index),
    });
  };

  const arrayFields = [
    { key: 'conditions', label: 'Medical Conditions' },
    { key: 'currentMedications', label: 'Current Medications' },
    { key: 'allergies', label: 'Allergies' },
    { key: 'dietaryRestrictions', label: 'Dietary Restrictions' },
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <User size={20} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Health Profile</h2>
        </div>
        <span className="text-sm text-gray-500">
          {isExpanded ? 'Hide' : 'Show'} Profile
        </span>
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="text"
              value={profile.age || ''}
              onChange={(e) => onChange({ ...profile, age: e.target.value })}
              placeholder="e.g., 35 or 30-40"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {arrayFields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <div className="space-y-2">
                {((profile[key] as string[]) || []).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-4 py-2 bg-gray-100 rounded-lg">
                      {item}
                    </span>
                    <button
                      onClick={() => removeArrayItem(key, index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {addingTo === key ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem(key, newItem);
                        }
                      }}
                      placeholder={`Add ${label.toLowerCase()}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={() => addArrayItem(key, newItem)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setAddingTo(null);
                        setNewItem('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTo(key)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600"
                  >
                    <Plus size={16} />
                    Add {label}
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.isPregnant || false}
                onChange={(e) =>
                  onChange({ ...profile, isPregnant: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Pregnant</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.isBreastfeeding || false}
                onChange={(e) =>
                  onChange({ ...profile, isBreastfeeding: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Breastfeeding</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={profile.additionalNotes || ''}
              onChange={(e) =>
                onChange({ ...profile, additionalNotes: e.target.value })
              }
              placeholder="Any other relevant health information..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};
