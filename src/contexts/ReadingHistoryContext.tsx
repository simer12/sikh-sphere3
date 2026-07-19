import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';

interface ReadingHistoryContextType {
  trackReading: (baniName: string, baniType: string, durationSeconds?: number) => Promise<void>;
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

  const trackReading = async (baniName: string, baniType: string, durationSeconds?: number) => {
    if (!user) {
      // Silently fail if user is not logged in (guest mode)
      return;
    }

    try {
      const { error } = await supabase
        .from('reading_history')
        .insert({
          user_id: user.uid,
          bani_name: baniName,
          bani_type: baniType,
          duration_seconds: durationSeconds || null,
          read_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error tracking reading:', error);
      } else {
        console.log(`Tracked reading: ${baniName}`);
      }
    } catch (error) {
      console.error('Error tracking reading:', error);
    }
  };

  const value = {
    trackReading,
  };

  return <ReadingHistoryContext.Provider value={value}>{children}</ReadingHistoryContext.Provider>;
};
