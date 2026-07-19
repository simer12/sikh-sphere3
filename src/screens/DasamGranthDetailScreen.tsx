import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import { useApp } from '../hooks/useApp';
import { fetchDasamGranthBani, DasamGranthBaniDetail } from '../services/dasamGranthService';

interface Props {
  route: {
    params: {
      bani: {
        nameGurmukhi: string;
        name: string;
      };
    };
  };
}

const DasamGranthDetailScreen: React.FC<Props> = ({ route }) => {
  const { bani: baniInfo } = route.params;
  const { colors } = useApp();
  const [bani, setBani] = useState<DasamGranthBaniDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBani();
  }, [baniInfo.nameGurmukhi]);

  const loadBani = async () => {
    try {
      setLoading(true);
      const baniData = await fetchDasamGranthBani(baniInfo.nameGurmukhi);
      
      if (baniData) {
        // Transform to match Nitnem bani structure - combine all verses into continuous text
        // Only Gurmukhi, no English translation
        const combinedGurmukhi = baniData.verses
          .map(verse => verse.gurmukhi)
          .filter(g => g && g.trim().length > 0) // Filter out empty lines
          .join('\n\n');
        
        const transformedBani: DasamGranthBaniDetail = {
          ...baniData,
          gurmukhi: combinedGurmukhi,
        };
        
        setBani(transformedBani);
      } else {
        Alert.alert(
          'Content Not Available',
          'This Bani content is not yet available. Please check back later.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error loading Dasam Granth Bani:', error);
      Alert.alert(
        'Error',
        'Failed to load Bani content. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.primary }]}>
          Loading {baniInfo.nameGurmukhi}...
        </Text>
      </View>
    );
  }

  if (!bani || !bani.gurmukhi) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>ਸਮੱਗਰੀ ਉਪਲਬਧ ਨਹੀਂ ਹੈ</Text>
        <Text style={[styles.errorSubtext, { color: colors.textTertiary }]}>Content not available yet</Text>
      </View>
    );
  }

  // Split content into verses (by double newline) and filter empty ones
  const allVerses = bani.gurmukhi.split('\n\n').filter((v: string) => v.trim().length > 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Bani info */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.primary }]}>
        <Text style={[styles.baniName, { color: colors.primary }]}>{bani.nameGurmukhi}</Text>
        <Text style={[styles.verseCount, { color: colors.textSecondary }]}>{allVerses.length} verses</Text>
      </View>

      {/* Continuous scrolling content - Traditional Gutka style */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {allVerses.map((verse: string, index: number) => (
          <View key={`verse-${index}`} style={[styles.verseBlock, { borderBottomColor: colors.border }]}>
            <Text style={[styles.gurmukhiText, { color: colors.text }]}>{verse}</Text>
          </View>
        ))}

        {/* End marker */}
        <View style={[styles.endMarker, { borderTopColor: colors.primary }]}>
          <Text style={[styles.endText, { color: colors.primary }]}>॥ ਸਮਾਪਤ ॥</Text>
          <Text style={[styles.endTextEnglish, { color: colors.textSecondary }]}>End of {bani.name}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  baniName: {
    fontSize: 24,
    fontWeight: '600',
  },
  verseCount: {
    fontSize: 14,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  verseBlock: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  gurmukhiText: {
    fontSize: 22,
    lineHeight: 36,
    textAlign: 'left',
  },
  endMarker: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    paddingTop: 20,
    borderTopWidth: 3,
  },
  endText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  endTextEnglish: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default DasamGranthDetailScreen;
