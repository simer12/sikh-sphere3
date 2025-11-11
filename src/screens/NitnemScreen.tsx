import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { nitnemBanisMetadata, Bani } from '../data/banis';
import { fetchBaniFromAPI, convertBaniDBToBani } from '../services/banidb';

export default function NitnemScreen({ navigation }: any) {
  const [banis, setBanis] = useState<Bani[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBanisFromAPI();
  }, []);

  const loadBanisFromAPI = async () => {
    try {
      setLoading(true);
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
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="book" size={40} color={theme.colors.primary} />
          <Text style={styles.headerText}>Daily Prayers</Text>
          <Text style={styles.subheaderText}>Nitnem Banis</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading authentic Gurbani from BaniDB...</Text>
          <Text style={styles.loadingSubtext}>Please wait while we fetch the prayers</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="book" size={40} color={theme.colors.primary} />
          <Text style={styles.headerText}>Daily Prayers</Text>
          <Text style={styles.subheaderText}>Nitnem Banis</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline" size={60} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadBanisFromAPI}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="book" size={40} color={theme.colors.primary} />
        <Text style={styles.headerText}>Daily Prayers</Text>
        <Text style={styles.subheaderText}>Nitnem Banis</Text>
        <Text style={styles.successText}>✓ Loaded from BaniDB API</Text>
      </View>

      {banis.map((bani) => (
        <Card key={bani.id} style={styles.card}>
          <TouchableOpacity onPress={() => navigation.navigate('BaniDetail', { bani })}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <Title style={styles.baniName}>{bani.name}</Title>
                  <Text style={styles.baniNameGurmukhi}>{bani.nameGurmukhi}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
              </View>
              <Paragraph style={styles.description}>{bani.description}</Paragraph>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{bani.time}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="hourglass-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{bani.duration}</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subheaderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  successText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 5,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#999',
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
    color: '#FF6B6B',
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.primary,
  },
  baniNameGurmukhi: {
    fontSize: 20,
    color: '#333',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
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
    color: '#666',
    marginLeft: 4,
  },
});
