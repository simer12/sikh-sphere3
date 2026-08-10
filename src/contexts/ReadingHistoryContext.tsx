import React, { createContext, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export interface ReadingLog {
  bani_name: string;
  bani_type: string;
  duration_seconds: number | null;
  read_at: string;
}

interface ReadingHistoryContextType {
  trackReading: (baniName: string, baniType: string, durationSeconds?: number) => Promise<void>;
  processPendingHistory: () => Promise<void>;
}

const ReadingHistoryContext = createContext<ReadingHistoryContextType>({} as ReadingHistoryContextType);

export const useReadingHistory = () => {
  const context = useContext(ReadingHistoryContext);
  if (!context) {
    throw new Error('useReadingHistory must be used within a ReadingHistoryProvider');
  }
  return context;
};

export const ReadingHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const processPendingHistory = async () => {
    // Deprecated for standalone mode
  };

  const trackReading = async (baniName: string, baniType: string, durationSeconds?: number) => {
    const activeUid = user?.uid || 'guest_user';
    const cacheKey = `reading_history_cache_${activeUid}`;

    const logEntry: ReadingLog = {
      bani_name: baniName,
      bani_type: baniType,
      duration_seconds: durationSeconds || null,
      read_at: new Date().toISOString(),
    };

    try {
      const stored = await AsyncStorage.getItem(cacheKey);
      const history: ReadingLog[] = stored ? JSON.parse(stored) : [];
      
      // Add new log to the top
      history.unshift(logEntry);
      
      // Limit to last 100 logs
      const trimmed = history.slice(0, 100);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(trimmed));
      console.log('Saved reading log locally:', logEntry);
    } catch (err) {
      console.error('Error saving reading log to local cache:', err);
    }
  };

  const value = {
    trackReading,
    processPendingHistory,
  };

  return <ReadingHistoryContext.Provider value={value}>{children}</ReadingHistoryContext.Provider>;
};
