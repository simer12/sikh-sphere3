import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { Logger } from '../services/logger';

export interface Bookmark {
  id: string;
  bani_name: string;
  bani_type: string;
  notes?: string;
  created_at: string;
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

const STORAGE_KEY = 'guest_bookmarks_v2';

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
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      } else {
        setBookmarks([]);
      }
    } catch (error) {
      Logger.warn('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const isBookmarked = (baniName: string): boolean => {
    return bookmarks.some((b) => b.bani_name === baniName);
  };

  const addBookmark = async (baniName: string, baniType: string, notes?: string) => {
    const tempId = `bookmark_${Date.now()}`;
    const newBookmark: Bookmark = {
      id: tempId,
      bani_name: baniName,
      bani_type: baniType,
      notes: notes || undefined,
      created_at: new Date().toISOString(),
    };

    const updatedBookmarks = [newBookmark, ...bookmarks];
    setBookmarks(updatedBookmarks);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookmarks));
    } catch (err) {
      Logger.warn('Error saving bookmark locally:', err);
    }
  };

  const removeBookmark = async (baniName: string) => {
    const updatedBookmarks = bookmarks.filter((b) => b.bani_name !== baniName);
    setBookmarks(updatedBookmarks);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookmarks));
    } catch (err) {
      Logger.warn('Error removing bookmark locally:', err);
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
