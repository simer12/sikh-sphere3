import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';

interface Bookmark {
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

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadBookmarks();
    } else {
      setBookmarks([]);
    }
  }, [user]);

  const loadBookmarks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setBookmarks(data);
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

  const addBookmark = async (baniName: string, baniType: string, notes?: string) => {
    if (!user) {
      throw new Error('You must be signed in to bookmark content');
    }

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.uid,
          bani_name: baniName,
          bani_type: baniType,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setBookmarks([data, ...bookmarks]);
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  };

  const removeBookmark = async (baniName: string) => {
    if (!user) return;

    try {
      const bookmark = bookmarks.find((b) => b.bani_name === baniName);
      if (!bookmark) return;

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmark.id);

      if (error) throw error;

      setBookmarks(bookmarks.filter((b) => b.bani_name !== baniName));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
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
