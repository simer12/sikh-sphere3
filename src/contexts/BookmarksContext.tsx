import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';

export interface Bookmark {
  id: string;
  bani_name: string;
  bani_type: string;
  notes?: string;
  created_at: string;
}

interface PendingBookmarkOp {
  type: 'add' | 'remove';
  baniName: string;
  baniType: string;
  notes?: string;
  timestamp: number;
}

interface BookmarksContextType {
  bookmarks: Bookmark[];
  loading: boolean;
  isBookmarked: (baniName: string) => boolean;
  addBookmark: (baniName: string, baniType: string, notes?: string) => Promise<void>;
  removeBookmark: (baniName: string) => Promise<void>;
  toggleBookmark: (baniName: string, baniType: string) => Promise<void>;
  refreshBookmarks: () => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextType>({} as BookmarksContextType);

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, [user]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      if (!user) {
        // Guest user mode: Load bookmarks from guest storage
        const stored = await AsyncStorage.getItem('guest_bookmarks');
        if (stored) {
          setBookmarks(JSON.parse(stored));
        } else {
          setBookmarks([]);
        }
      } else {
        // Logged-in user mode:
        // 1. Try loading cached bookmarks for instant (0ms) startup display
        const cached = await AsyncStorage.getItem(`cached_bookmarks_${user.uid}`);
        if (cached) {
          setBookmarks(JSON.parse(cached));
        }

        // 2. Fetch fresh bookmarks from Supabase in the background
        const { data, error } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setBookmarks(data);
          await AsyncStorage.setItem(`cached_bookmarks_${user.uid}`, JSON.stringify(data));
        }

        // 3. Process any pending offline operations
        await processSyncQueue();
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const isBookmarked = (baniName: string): boolean => {
    return bookmarks.some((b) => b.bani_name === baniName);
  };

  const queueOperation = async (op: PendingBookmarkOp) => {
    if (!user) return;
    try {
      const queueKey = `bookmark_sync_queue_${user.uid}`;
      const storedQueue = await AsyncStorage.getItem(queueKey);
      const queue: PendingBookmarkOp[] = storedQueue ? JSON.parse(storedQueue) : [];
      queue.push(op);
      await AsyncStorage.setItem(queueKey, JSON.stringify(queue));
      
      // Try to flush the queue immediately in the background
      processSyncQueue();
    } catch (err) {
      console.error('Error queueing bookmark operation:', err);
    }
  };

  const processSyncQueue = async () => {
    if (!user) return;
    const queueKey = `bookmark_sync_queue_${user.uid}`;
    
    try {
      const storedQueue = await AsyncStorage.getItem(queueKey);
      if (!storedQueue) return;
      const queue: PendingBookmarkOp[] = JSON.parse(storedQueue);
      if (queue.length === 0) return;

      console.log(`Processing ${queue.length} pending offline bookmark syncs...`);
      
      while (queue.length > 0) {
        const op = queue[0];
        
        try {
          if (op.type === 'add') {
            const { error } = await supabase
              .from('bookmarks')
              .insert({
                user_id: user.uid,
                bani_name: op.baniName,
                bani_type: op.baniType,
                notes: op.notes || null,
              });
            // Ignore unique constraint violations if the bookmark already exists
            if (error && error.code !== '23505') {
              throw error;
            }
          } else if (op.type === 'remove') {
            const { error } = await supabase
              .from('bookmarks')
              .delete()
              .eq('user_id', user.uid)
              .eq('bani_name', op.baniName);
            if (error) throw error;
          }
          
          // Successfully synced, remove from queue
          queue.shift();
          await AsyncStorage.setItem(queueKey, JSON.stringify(queue));
        } catch (dbErr) {
          // Offline or database error, halt processing and retry next launch
          console.log('Database sync failed, preserving sync queue for later:', dbErr);
          break;
        }
      }
    } catch (err) {
      console.error('Error processing sync queue:', err);
    }
  };

  const addBookmark = async (baniName: string, baniType: string, notes?: string) => {
    const tempId = `temp_${Date.now()}`;
    const newBookmark: Bookmark = {
      id: tempId,
      bani_name: baniName,
      bani_type: baniType,
      notes: notes || undefined,
      created_at: new Date().toISOString(),
    };

    // Optimistically update state instantly (0ms)
    const updatedBookmarks = [newBookmark, ...bookmarks];
    setBookmarks(updatedBookmarks);

    // Save locally
    if (!user) {
      await AsyncStorage.setItem('guest_bookmarks', JSON.stringify(updatedBookmarks));
    } else {
      await AsyncStorage.setItem(`cached_bookmarks_${user.uid}`, JSON.stringify(updatedBookmarks));
      // Queue Supabase push in background
      await queueOperation({
        type: 'add',
        baniName,
        baniType,
        notes,
        timestamp: Date.now(),
      });
    }
  };

  const removeBookmark = async (baniName: string) => {
    // Optimistically update state instantly (0ms)
    const updatedBookmarks = bookmarks.filter((b) => b.bani_name !== baniName);
    setBookmarks(updatedBookmarks);

    // Save locally
    if (!user) {
      await AsyncStorage.setItem('guest_bookmarks', JSON.stringify(updatedBookmarks));
    } else {
      await AsyncStorage.setItem(`cached_bookmarks_${user.uid}`, JSON.stringify(updatedBookmarks));
      
      const baniType = bookmarks.find((b) => b.bani_name === baniName)?.bani_type || 'Bani';
      // Queue Supabase delete in background
      await queueOperation({
        type: 'remove',
        baniName,
        baniType,
        timestamp: Date.now(),
      });
    }
  };

  const toggleBookmark = async (baniName: string, baniType: string) => {
    if (isBookmarked(baniName)) {
      await removeBookmark(baniName);
    } else {
      await addBookmark(baniName, baniType);
    }
  };

  const refreshBookmarks = async () => {
    await loadBookmarks();
  };

  const value = {
    bookmarks,
    loading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    refreshBookmarks,
  };

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
};
