import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export interface Preferences {
  fontSize: number;
  darkMode: boolean;
  language: 'en' | 'pa';
  notifications: boolean;
  autoPlay: boolean;
  downloadOnWifi: boolean;
}

const defaultPreferences: Preferences = {
  fontSize: 16,
  darkMode: false,
  language: 'en',
  notifications: true,
  autoPlay: false,
  downloadOnWifi: true,
};

interface PreferencesContextType {
  preferences: Preferences;
  loading: boolean;
  updatePreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => Promise<void>;
  resetPreferences: () => Promise<void>;
}

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
    loadLocalPreferences();
  }, [user]);

  const loadLocalPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem('app_preferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading local preferences', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocal = async (prefs: Preferences) => {
    try {
      await AsyncStorage.setItem('app_preferences', JSON.stringify(prefs));
    } catch (error) {
      console.log('Error saving to local storage', error);
    }
  };

  const updatePreference = async <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    await saveToLocal(newPreferences);
  };

  const resetPreferences = async () => {
    setPreferences(defaultPreferences);
    await saveToLocal(defaultPreferences);
  };

  const value = {
    preferences,
    loading,
    updatePreference,
    resetPreferences,
  };

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};
