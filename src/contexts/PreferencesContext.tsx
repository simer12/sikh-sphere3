import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';

interface Preferences {
  fontSize: number;
  darkMode: boolean;
  language: 'en' | 'pa';
  notifications: boolean;
  autoPlay: boolean;
  downloadOnWifi: boolean;
}

interface PreferencesContextType {
  preferences: Preferences;
  loading: boolean;
  updatePreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => Promise<void>;
  resetPreferences: () => Promise<void>;
}

const defaultPreferences: Preferences = {
  fontSize: 16,
  darkMode: false,
  language: 'en',
  notifications: true,
  autoPlay: false,
  downloadOnWifi: true,
};

const PreferencesContext = createContext<PreferencesContextType>({} as PreferencesContextType);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      // Load from local storage for guest users
      loadLocalPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.uid)
        .single();

      if (data) {
        setPreferences({
          fontSize: data.font_size || 16,
          darkMode: data.dark_mode || false,
          language: data.language || 'en',
          notifications: data.notifications ?? true,
          autoPlay: data.auto_play || false,
          downloadOnWifi: data.download_on_wifi ?? true,
        });
      }
    } catch (error) {
      console.log('Using default preferences');
    } finally {
      setLoading(false);
    }
  };

  const loadLocalPreferences = () => {
    try {
      const stored = localStorage.getItem('app_preferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading local preferences');
    } finally {
      setLoading(false);
    }
  };

  const saveToLocal = (prefs: Preferences) => {
    try {
      localStorage.setItem('app_preferences', JSON.stringify(prefs));
    } catch (error) {
      console.log('Error saving to local storage');
    }
  };

  const updatePreference = async <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    // Save to local storage
    saveToLocal(newPreferences);

    // Save to database if user is logged in
    if (user) {
      try {
        await supabase
          .from('user_preferences')
          .upsert(
            {
              user_id: user.uid,
              font_size: newPreferences.fontSize,
              dark_mode: newPreferences.darkMode,
              language: newPreferences.language,
              notifications: newPreferences.notifications,
              auto_play: newPreferences.autoPlay,
              download_on_wifi: newPreferences.downloadOnWifi,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
      } catch (error) {
        console.error('Error saving preference:', error);
      }
    }
  };

  const resetPreferences = async () => {
    setPreferences(defaultPreferences);
    saveToLocal(defaultPreferences);

    if (user) {
      try {
        await supabase
          .from('user_preferences')
          .upsert(
            {
              user_id: user.uid,
              font_size: defaultPreferences.fontSize,
              dark_mode: defaultPreferences.darkMode,
              language: defaultPreferences.language,
              notifications: defaultPreferences.notifications,
              auto_play: defaultPreferences.autoPlay,
              download_on_wifi: defaultPreferences.downloadOnWifi,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
      } catch (error) {
        console.error('Error resetting preferences:', error);
      }
    }
  };

  const value = {
    preferences,
    loading,
    updatePreference,
    resetPreferences,
  };

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};
