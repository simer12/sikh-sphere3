import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function BaniDetailScreen({ route }: any) {
  const { bani } = route.params;

  // Split content into verses (by double newline) and filter empty ones
  const allVerses = bani.gurmukhi.split('\n\n').filter((v: string) => v.trim().length > 0);

  return (
    <View style={styles.container}>
      {/* Header with Bani info */}
      <View style={styles.header}>
        <Text style={styles.baniName}>{bani.nameGurmukhi}</Text>
        <Text style={styles.verseCount}>{allVerses.length} verses</Text>
      </View>

      {/* Continuous scrolling content - Traditional Gutka style */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {allVerses.map((verse: string, index: number) => (
          <View key={`verse-${index}`} style={styles.verseBlock}>
            <Text style={styles.gurmukhiText}>{verse}</Text>
          </View>
        ))}
        
        {/* End marker */}
        <View style={styles.endMarker}>
          <Text style={styles.endText}>॥ ਸਮਾਪਤ ॥</Text>
          <Text style={styles.endTextEnglish}>End of {bani.name}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8f5', // Clean cream background like traditional Gutka
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    alignItems: 'center',
  },
  baniName: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  verseCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 60,
  },
  verseBlock: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e4dd',
  },
  gurmukhiText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#1a1a1a',
    lineHeight: 40,
    textAlign: 'left',
    letterSpacing: 0.3,
  },
  endMarker: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: theme.colors.primary,
  },
  endText: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  endTextEnglish: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});
