import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF9933', // Saffron
    secondary: '#000080', // Navy Blue
    accent: '#FFFFFF',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#333333',
    disabled: '#CCCCCC',
    placeholder: '#999999',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  dark: false,
};

export const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF9933',
    secondary: '#4169E1',
    accent: '#FFFFFF',
    background: '#1A1A1A',
    surface: '#2C2C2C',
    text: '#FFFFFF',
    disabled: '#666666',
    placeholder: '#888888',
    backdrop: 'rgba(0, 0, 0, 0.7)',
  },
  dark: true,
};
