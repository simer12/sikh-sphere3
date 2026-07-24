import React, { createContext, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';

interface ReadingLog {
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

  useEffect(() => {
    if (user) {
      processPendingHistory();
    }
  }, [user]);

  const queueReadingLog = async (log: ReadingLog) => {
    if (!user) return;
    try {
      const queueKey = `reading_history_queue_${user.uid}`;
      const stored = await AsyncStorage.getItem(queueKey);
      const queue: ReadingLog[] = stored ? JSON.parse(stored) : [];
      queue.push(log);
      await AsyncStorage.setItem(queueKey, JSON.stringify(queue));
      
      // Attempt background push immediately
      processPendingHistory();
    } catch (err) {
      console.error('Error queueing reading log:', err);
    }
  };

  const processPendingHistory = async () => {
    if (!user) return;
    const queueKey = `reading_history_queue_${user.uid}`;
    
    try {
      const stored = await AsyncStorage.getItem(queueKey);
      if (!stored) return;
      const queue: ReadingLog[] = JSON.parse(stored);
      if (queue.length === 0) return;

      console.log(`Processing ${queue.length} pending offline reading history syncs...`);
      
      while (queue.length > 0) {
        const log = queue[0];
        
        try {
          const { error } = await supabase
            .from('reading_history')
            .insert({
              user_id: user.uid,
              bani_name: log.bani_name,
              bani_type: log.bani_type,
              duration_seconds: log.duration_seconds,
              read_at: log.read_at,
            });
            
          if (error) throw error;
          
          // Successfully synced, remove from queue
          queue.shift();
          await AsyncStorage.setItem(queueKey, JSON.stringify(queue));
        } catch (dbErr) {
          // Offline or database error, halt processing and retry later
          console.log('Database history sync failed, preserving queue for later:', dbErr);
          break;
        }
      }
    } catch (err) {
      console.error('Error processing history sync queue:', err);
    }
  };

  const trackReading = async (baniName: string, baniType: string, durationSeconds?: number) => {
    if (!user) {
      // Guest mode: Silently ignore database syncing
      return;
    }

    const logEntry: ReadingLog = {
      bani_name: baniName,
      bani_type: baniType,
      duration_seconds: durationSeconds || null,
      read_at: new Date().toISOString(),
    };

    // Queue locally first (0ms user delay, completely offline-first)
    await queueReadingLog(logEntry);
  };

  const value = {
    trackReading,
    processPendingHistory,
  };

  return <ReadingHistoryContext.Provider value={value}>{children}</ReadingHistoryContext.Provider>;
};
