import React from 'react';
import { historyService, type HistoryItem } from '../services/historyService';
import { Clock, Trash2, X, Image as ImageIcon } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: HistoryItem) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onSelectItem }) => {
  const [history, setHistory] = React.useState<HistoryItem[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setHistory(historyService.getHistory());
    }
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    historyService.deleteHistoryItem(id);
    setHistory(historyService.getHistory());
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      historyService.clearHistory();
      setHistory([]);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getAnalysisTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'bg-blue-100 text-blue-700';
      case 'food': return 'bg-green-100 text-green-700';
      case 'interaction': return 'bg-red-100 text-red-700';
      case 'allergen': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold">Recent Scans</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No scan history yet</p>
              <p className="text-gray-400 text-sm mt-2">Your analyzed items will appear here</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      {item.imageThumbnail ? (
                        <img
                          src={item.imageThumbnail}
                          alt="Thumbnail"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="text-gray-400" size={32} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600">
                        {item.productName}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getAnalysisTypeColor(item.analysisType)}`}>
                        {item.analysisType.charAt(0).toUpperCase() + item.analysisType.slice(1)}
                      </span>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(item.timestamp)}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="border-t p-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">{history.length} scan{history.length !== 1 ? 's' : ''}</span>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
