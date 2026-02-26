import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { usePreferences } from '../contexts/PreferencesContext';

interface AppTextProps extends TextProps {
  variant?: 'default' | 'title' | 'subtitle' | 'caption' | 'body';
}

export const AppText: React.FC<AppTextProps> = ({ 
  children, 
  style, 
  variant = 'default',
  ...props 
}) => {
  const { preferences } = usePreferences();
  const baseFontSize = preferences.fontSize;

  const getVariantStyle = () => {
    switch (variant) {
      case 'title':
        return { fontSize: baseFontSize + 8, fontWeight: 'bold' as const };
      case 'subtitle':
        return { fontSize: baseFontSize + 4, fontWeight: '600' as const };
      case 'caption':
        return { fontSize: baseFontSize - 2, color: '#666' };
      case 'body':
        return { fontSize: baseFontSize, lineHeight: baseFontSize * 1.5 };
      default:
        return { fontSize: baseFontSize };
    }
  };

  return (
    <RNText style={[getVariantStyle(), style]} {...props}>
      {children}
    </RNText>
  );
};
