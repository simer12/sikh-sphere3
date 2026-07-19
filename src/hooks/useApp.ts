import { usePreferences } from '../contexts/PreferencesContext';
import { translations, Translations } from '../i18n/translations';
import { lightColors, darkColors, ThemeColors } from '../theme/colors';

interface UseAppReturn {
  t: Translations;
  fontSize: number;
  language: 'en' | 'pa';
  darkMode: boolean;
  colors: ThemeColors;
}

export const useApp = (): UseAppReturn => {
  const { preferences } = usePreferences();
  
  return {
    t: translations[preferences.language],
    fontSize: preferences.fontSize,
    language: preferences.language,
    darkMode: preferences.darkMode,
    colors: preferences.darkMode ? darkColors : lightColors,
  };
};
