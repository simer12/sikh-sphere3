import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Share, RefreshControl } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { fetchHukamnama as fetchHukamnamaFromSGPC } from '../services/hukamnama';
import { useApp } from '../hooks/useApp';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';

export default function HukamnamaScreen() {
  const { colors } = useApp();
  const [hukamnama, setHukamnama] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHukamnama();
  }, []);

  const fetchHukamnama = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching Hukamnama from SGPC...');
      
      // Fetch directly from SGPC website
      const data = await fetchHukamnamaFromSGPC();
      
      // Format the data
      const transformed = {
        date: data.date,
        gurmukhi: data.gurmukhi,
        transliteration: '', // SGPC doesn't provide transliteration
        english: data.english,
        punjabi: data.punjabi,
        hindi: '', // Not available from SGPC
        reference: data.reference,
        raag: data.raag,
        teeka: 'Hukamnama is the daily message taken from a random opening of Sri Guru Granth Sahib Ji at Sri Harmandir Sahib (Golden Temple), Amritsar, Punjab.',
      };
      
      setHukamnama(transformed);
      console.log('Hukamnama loaded successfully from SGPC');
    } catch (err: any) {
      console.error('Failed to fetch Hukamnama:', err);
      console.error('Error details:', err.message);
      
      // Show user-friendly error
      setError(`Unable to load Hukamnama: ${err.message}. Pull down to retry.`);
      
      // Set a basic message so screen isn't empty
      setHukamnama({
        date: new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        gurmukhi: 'ਹੁਕਮਨਾਮਾ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕਿਆ',
        transliteration: 'Unable to load Hukamnama',
        english: 'Please check your internet connection and pull down to refresh. The Hukamnama is the daily sacred message taken from Sri Guru Granth Sahib Ji at Sri Harmandir Sahib (Golden Temple), Amritsar.',
        punjabi: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਚੈੱਕ ਕਰੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰਨ ਲਈ ਹੇਠਾਂ ਖਿੱਚੋ।',
        hindi: '',
        reference: 'Connection Failed',
        teeka: 'Please ensure you have an active internet connection. The Hukamnama is updated daily from Sri Harmandir Sahib.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHukamnama();
  };

  const shareHukamnama = async () => {
    if (!hukamnama) return;
    
    try {
      await Share.share({
        message: `Today's Hukamnama from Sri Harmandir Sahib\n\n${hukamnama.gurmukhi}\n\n${hukamnama.english}\n\n${hukamnama.reference}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading && !hukamnama) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Ionicons name="newspaper" size={40} color={colors.primary} />
          <Text style={[styles.headerText, { color: colors.text }]}>Daily Hukamnama</Text>
          <Text style={[styles.subheaderText, { color: colors.textSecondary }]}>Sri Harmandir Sahib, Amritsar</Text>
        </View>
        <CardSkeleton />
        <CardSkeleton />
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Ionicons name="newspaper" size={40} color={colors.primary} />
        <Text style={[styles.headerText, { color: colors.text }]}>Daily Hukamnama</Text>
        <Text style={[styles.subheaderText, { color: colors.textSecondary }]}>Sri Harmandir Sahib, Amritsar</Text>
        <Text style={[styles.dateText, { color: colors.primary }]}>{hukamnama?.date}</Text>
        {error && (
          <View style={[styles.errorBanner, { backgroundColor: colors.error }]}>
            <Ionicons name="alert-circle" size={16} color="#fff" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          {hukamnama?.raag && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.primary }]}>ਰਾਗ (Raag)</Text>
              <Text style={[styles.raagText, { color: colors.text }]}>{hukamnama.raag}</Text>
            </>
          )}
          
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>ਗੁਰਮੁਖੀ (Gurmukhi)</Text>
          <Text style={[styles.gurmukhiText, { color: colors.text }]}>{hukamnama?.gurmukhi}</Text>
          
          {hukamnama?.transliteration && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.primary }]}>Transliteration</Text>
              <Text style={[styles.transliterationText, { color: colors.textSecondary }]}>{hukamnama?.transliteration}</Text>
            </>
          )}
          
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>English Translation</Text>
          <Text style={[styles.translationText, { color: colors.text }]}>{hukamnama?.english}</Text>
          
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>ਪੰਜਾਬੀ (Punjabi)</Text>
          <Text style={[styles.translationText, { color: colors.text }]}>{hukamnama?.punjabi}</Text>
          
          {hukamnama?.hindi && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.primary }]}>हिन्दी (Hindi)</Text>
              <Text style={[styles.translationText, { color: colors.text }]}>{hukamnama?.hindi}</Text>
            </>
          )}
          
          <Text style={[styles.reference, { color: colors.primary }]}>{hukamnama?.reference}</Text>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Text style={[styles.teekaTitle, { color: colors.text }]}>📖 Teeka (Explanation)</Text>
          <Text style={[styles.teekaText, { color: colors.textSecondary }]}>{hukamnama?.teeka}</Text>
        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        <Button
          mode="contained"
          icon="share-variant"
          onPress={shareHukamnama}
          style={styles.shareButton}
          buttonColor={colors.primary}
        >
          Share Hukamnama
        </Button>
        <Button
          mode="outlined"
          icon="refresh"
          onPress={fetchHukamnama}
          style={[styles.refreshButton, { borderColor: colors.primary }]}
          textColor={colors.primary}
        >
          Refresh
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subheaderText: {
    fontSize: 14,
    marginTop: 5,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    marginTop: 12,
  },
  errorText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  raagText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  gurmukhiText: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  transliterationText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
  },
  reference: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 16,
    textAlign: 'right',
  },
  teekaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  teekaText: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionsContainer: {
    padding: 16,
  },
  shareButton: {
    marginBottom: 12,
  },
  refreshButton: {
  },
});
