import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../hooks/useApp';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  autoFocus?: boolean;
  style?: any;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  onClear,
  autoFocus = false,
  style,
}) => {
  const { colors } = useApp();
  const [query, setQuery] = useState('');

  const handleChangeText = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    onClear?.();
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }, style]}>
      <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.icon} />
      
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={query}
        onChangeText={handleChangeText}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    height: 44,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
});
