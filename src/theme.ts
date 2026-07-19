import { DefaultTheme } from 'react-native-paper';
import { lightColors, darkColors } from './theme/colors';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightColors.primary,
    accent: lightColors.accent,
    background: lightColors.background,
    surface: lightColors.surface,
    text: lightColors.text,
    disabled: lightColors.disabled,
    placeholder: lightColors.placeholder,
    backdrop: lightColors.backdrop,
    notification: lightColors.notification,
  },
  dark: false,
};

export const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: darkColors.primary,
    accent: darkColors.accent,
    background: darkColors.background,
    surface: darkColors.surface,
    text: darkColors.text,
    disabled: darkColors.disabled,
    placeholder: darkColors.placeholder,
    backdrop: darkColors.backdrop,
    notification: darkColors.notification,
  },
  dark: true,
};

// Legacy export for backward compatibility
export const theme = lightTheme;
