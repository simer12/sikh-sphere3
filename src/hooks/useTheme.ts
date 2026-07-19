import { usePreferences } from '../contexts/PreferencesContext';
import { lightColors, darkColors, ThemeColors } from '../theme/colors';

interface Theme {
  colors: ThemeColors;
  isDark: boolean;
}

export const useTheme = (): Theme => {
  const { preferences } = usePreferences();
  
  return {
    colors: preferences.darkMode ? darkColors : lightColors,
    isDark: preferences.darkMode,
  };
};
