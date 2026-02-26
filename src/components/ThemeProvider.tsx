import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { usePreferences } from '../contexts/PreferencesContext';
import { lightTheme, darkTheme } from '../theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { preferences } = usePreferences();
  const currentTheme = preferences.darkMode ? darkTheme : lightTheme;

  return (
    <>
      <StatusBar
        barStyle={preferences.darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.colors.primary}
      />
      <PaperProvider theme={currentTheme}>
        {children}
      </PaperProvider>
    </>
  );
};
