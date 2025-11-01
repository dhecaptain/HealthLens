import type { AnalysisResponse } from '../types';

export interface HistoryItem {
  id: string;
  timestamp: number;
  analysisType: string;
  result: AnalysisResponse;
  imageThumbnail?: string;
  productName?: string;
}

const STORAGE_KEY = 'healthlens_history';
const MAX_HISTORY_ITEMS = 50;

export const historyService = {
  // Save analysis to history
  saveToHistory: (
    analysisType: string,
    result: AnalysisResponse,
    imageThumbnail?: string
  ): void => {
    try {
      const history = historyService.getHistory();
      const productName = result.data?.detailedAnalysis?.productInfo?.name || 'Unknown Product';
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        analysisType,
        result,
        imageThumbnail,
        productName,
      };

      // Add to beginning and limit to MAX_HISTORY_ITEMS
      const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  },

  // Get all history
  getHistory: (): HistoryItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  },

  // Get single item by ID
  getHistoryItem: (id: string): HistoryItem | null => {
    const history = historyService.getHistory();
    return history.find(item => item.id === id) || null;
  },

  // Delete item from history
  deleteHistoryItem: (id: string): void => {
    try {
      const history = historyService.getHistory();
      const filtered = history.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  },

  // Clear all history
  clearHistory: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },

  // Export history as JSON
  exportHistory: (): void => {
    try {
      const history = historyService.getHistory();
      const dataStr = JSON.stringify(history, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `healthlens-history-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting history:', error);
    }
  },
};
