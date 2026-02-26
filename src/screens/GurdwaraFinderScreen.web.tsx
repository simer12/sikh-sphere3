import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { 
  Gurdwara, 
  getFamousGurdwaras,
} from '../services/gurdwara';
import {
  searchGurdwarasGoogle,
} from '../services/googlePlaces';

export default function GurdwaraFinderScreen() {
  const [gurdwaras, setGurdwaras] = useState<Gurdwara[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGurdwaras();
  }, []);

  const loadGurdwaras = async () => {
    try {
      setLoading(true);
      const famous = getFamousGurdwaras();
      setGurdwaras(famous);
    } catch (error) {
      console.error('Error loading Gurdwaras:', error);
      setGurdwaras(getFamousGurdwaras());
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadGurdwaras();
      return;
    }

    try {
      setLoading(true);
      const results = await searchGurdwarasGoogle(searchQuery);
      setGurdwaras(results.length > 0 ? results : getFamousGurdwaras());
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Unable to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openDirections = (gurdwara: Gurdwara) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${gurdwara.latitude},${gurdwara.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Gurdwaras worldwide..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        {loading && <ActivityIndicator size="small" color={theme.colors.primary} />}
      </View>

      {/* Web Message */}
      <View style={styles.webMessage}>
        <Ionicons name="information-circle" size={48} color={theme.colors.primary} />
        <Text style={styles.webMessageText}>Map view is only available on mobile apps</Text>
        <Text style={styles.webMessageSubtext}>Browse Gurdwaras in the list below</Text>
      </View>

      {/* List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          {searchQuery ? 'Search Results' : 'Gurdwaras'} ({gurdwaras.length})
        </Text>
        <ScrollView>
          {gurdwaras.map((gurdwara) => (
            <TouchableOpacity
              key={gurdwara.id}
              style={styles.gurdwaraItem}
              onPress={() => openDirections(gurdwara)}
            >
              <Ionicons 
                name="location" 
                size={24} 
                color={gurdwara.type === 'takht' ? '#FFD700' : theme.colors.primary} 
              />
              <View style={styles.gurdwaraInfo}>
                <Text style={styles.gurdwaraName}>{gurdwara.name}</Text>
                {gurdwara.nameGurmukhi && (
                  <Text style={styles.gurdwaraGurmukhi}>{gurdwara.nameGurmukhi}</Text>
                )}
                <Text style={styles.gurdwaraAddress}>
                  {gurdwara.city}, {gurdwara.country}
                </Text>
                {gurdwara.phone && (
                  <Text style={styles.gurdwaraPhone}>{gurdwara.phone}</Text>
                )}
                {gurdwara.type === 'takht' && (
                  <Text style={styles.takhBadge}>🪷 Takht Sahib</Text>
                )}
              </View>
              <Ionicons name="navigate" size={24} color="#666" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  webMessage: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  webMessageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  webMessageSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  gurdwaraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  gurdwaraInfo: {
    flex: 1,
    marginLeft: 12,
  },
  gurdwaraName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  gurdwaraGurmukhi: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 2,
  },
  gurdwaraAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  gurdwaraPhone: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 2,
  },
  takhBadge: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
