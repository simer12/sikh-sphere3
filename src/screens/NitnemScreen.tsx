import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { nitnemBanisMetadata, Bani } from '../data/banis';
import { fetchBaniFromAPI, convertBaniDBToBani } from '../services/banidb';
import { useApp } from '../hooks/useApp';
import { AppText } from '../components/AppText';
import { SearchBar } from '../components/SearchBar';
import { ErrorMessage } from '../components/ErrorMessage';
import { CardSkeleton } from '../components/LoadingSkeleton';

export default function NitnemScreen({ navigation }: any) {
  const { t, fontSize, colors } = useApp();
  const [banis, setBanis] = useState<Bani[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBanisFromAPI();
  }, []);

  const loadBanisFromAPI = async () => {
    try {
      setLoading(!refreshing);
      setRefreshing(true);
      setError(null);
      const loadedBanis: Bani[] = [];

      // Fetch all Nitnem Banis from API using metadata
      for (const baniMeta of nitnemBanisMetadata) {
        try {
          console.log(`Fetching ${baniMeta.name} (ID: ${baniMeta.id})...`);
          const apiData = await fetchBaniFromAPI(baniMeta.id);
          const convertedBani = convertBaniDBToBani(apiData, baniMeta);
          loadedBanis.push(convertedBani);
        } catch (err) {
          console.error(`Error loading Bani ${baniMeta.id} (${baniMeta.name}):`, err);
          throw err; // Stop and show error to user
        }
      }

      setBanis(loadedBanis);
      console.log(`Successfully loaded ${loadedBanis.length} Banis from BaniDB API`);
    } catch (err) {
      console.error('Error loading Banis from API:', err);
      setError('Failed to load Banis from BaniDB API. Please check your internet connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Ionicons name="book" size={40} color={colors.primary} />
          <AppText variant="title" style={[styles.headerText, { color: colors.text }]}>{t.dailyPrayers}</AppText>
          <AppText variant="subtitle" style={[styles.subheaderText, { color: colors.textSecondary }]}>{t.nitnemBanis}</AppText>
        </View>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Ionicons name="book" size={40} color={colors.primary} />
          <AppText variant="title" style={[styles.headerText, { color: colors.text }]}>{t.dailyPrayers}</AppText>
          <AppText variant="subtitle" style={[styles.subheaderText, { color: colors.textSecondary }]}>{t.nitnemBanis}</AppText>
        </View>
        <ErrorMessage
          title={t.connectionError}
          message={error}
          onRetry={loadBanisFromAPI}
          retryLabel={t.retry}
        />
      </View>
    );
  }

  const filteredBanis = banis.filter(bani =>
    bani.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bani.nameGurmukhi.includes(searchQuery) ||
    bani.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={loadBanisFromAPI}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Ionicons name="book" size={40} color={colors.primary} />
        <AppText variant="title" style={[styles.headerText, { color: colors.text }]}>{t.dailyPrayers}</AppText>
        <AppText variant="subtitle" style={[styles.subheaderText, { color: colors.textSecondary }]}>{t.nitnemBanis}</AppText>
        <AppText variant="caption" style={[styles.successText, { color: colors.success }]}>✓ {t.loadedFromAPI}</AppText>
      </View>

      <SearchBar
        placeholder="Search Banis..."
        onSearch={setSearchQuery}
      />

      {filteredBanis.map((bani) => (
        <Card key={bani.id} style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={() => navigation.navigate('BaniDetail', { bani })}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <Title style={[styles.baniName, { color: colors.primary }]}>{bani.name}</Title>
                  <Text style={[styles.baniNameGurmukhi, { color: colors.text }]}>{bani.nameGurmukhi}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.primary} />
              </View>
              <Paragraph style={[styles.description, { color: colors.textSecondary }]}>{bani.description}</Paragraph>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>{bani.time}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="hourglass-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>{bani.duration}</Text>
                </View>
              </View>
            </Card.Content>
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 16,
    marginTop: 5,
  },
  successText: {
    fontSize: 12,
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    margin: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitleContainer: {
    flex: 1,
  },
  baniName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  baniNameGurmukhi: {
    fontSize: 20,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
