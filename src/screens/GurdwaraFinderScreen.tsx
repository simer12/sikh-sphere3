import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { 
  Gurdwara, 
  fetchGurdwarasNearLocation, 
  searchGurdwaras, 
  getFamousGurdwaras,
  fetchAllIndianGurdwaras,
  fetchGurdwarasByCountry
} from '../services/gurdwara';
import {
  fetchGurdwarasNearLocationGoogle,
  searchGurdwarasGoogle,
  fetchAllIndianGurdwarasGoogle
} from '../services/googlePlaces';
import { fetchAllGurdwarasIndia } from '../services/googlePlacesEnhanced';

export default function GurdwaraFinderScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [gurdwaras, setGurdwaras] = useState<Gurdwara[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadGurdwaras();
  }, []);

  const loadGurdwaras = async () => {
    try {
      setLoading(true);
      
      // Get location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      // Get user location (optional, for map centering)
      let userLocation = null;
      if (status === 'granted') {
        try {
          userLocation = await Location.getCurrentPositionAsync({});
          setLocation(userLocation);
        } catch (err) {
          console.log('Could not get location:', err);
        }
      }

      // Load ALL Gurdwaras from India using Google Places
      console.log('🌍 Loading ALL Gurdwaras from India (this may take 30-60 seconds)...');
      const allIndia = await fetchAllGurdwarasIndia();
      
      // Add famous/historical Gurdwaras
      const famous = getFamousGurdwaras();
      const combined = [...famous, ...allIndia];
      
      // Remove duplicates
      const unique = removeDuplicates(combined);
      
      console.log(`✅ Total Gurdwaras loaded: ${unique.length}`);
      setGurdwaras(unique);
      
      if (unique.length < 1000) {
        console.warn('⚠️ Expected more Gurdwaras. Google API might have limits.');
      }
    } catch (error) {
      console.error('Error loading Gurdwaras:', error);
      // Fallback to famous Gurdwaras
      setGurdwaras(getFamousGurdwaras());
      Alert.alert('Error', 'Could not load all Gurdwaras. Showing famous ones only.');
    } finally {
      setLoading(false);
    }
  };

  const loadAllIndia = async () => {
    Alert.alert(
      'Load All Indian Gurdwaras',
      'This will fetch 6000+ Gurdwaras from India using Google Places. It may take 1-2 minutes. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Load All', 
          onPress: async () => {
            try {
              setLoading(true);
              const allIndia = await fetchAllIndianGurdwarasGoogle();
              const famous = getFamousGurdwaras();
              const combined = [...famous, ...allIndia];
              const unique = removeDuplicates(combined);
              setGurdwaras(unique);
              Alert.alert('Success', `Loaded ${unique.length} Gurdwaras from Google Places! 🎉`);
            } catch (error) {
              Alert.alert('Error', 'Failed to load all Gurdwaras. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
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

  const removeDuplicates = (gurdwaras: Gurdwara[]): Gurdwara[] => {
    const seen = new Set();
    return gurdwaras.filter((g) => {
      const key = `${g.latitude.toFixed(3)},${g.longitude.toFixed(3)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const openDirections = (gurdwara: Gurdwara) => {
    Alert.alert(
      gurdwara.name,
      `Open in Maps app for directions?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => {
          // In real app, use Linking.openURL with maps URL
        }},
      ]
    );
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

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || 31.6200,
          longitude: location?.coords.longitude || 74.8765,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        showsUserLocation={true}
      >
        {gurdwaras.map((gurdwara) => (
          <Marker
            key={gurdwara.id}
            coordinate={{
              latitude: gurdwara.latitude,
              longitude: gurdwara.longitude,
            }}
            title={gurdwara.name}
            description={gurdwara.address}
            onCalloutPress={() => openDirections(gurdwara)}
          >
            <View style={styles.markerContainer}>
              <Ionicons 
                name="location" 
                size={40} 
                color={gurdwara.type === 'takht' ? '#FFD700' : theme.colors.primary} 
              />
            </View>
          </Marker>
        ))}
      </MapView>

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
    color: '#333',
  },
  loadAllButton: {
    marginLeft: 8,
    padding: 4,
  },
  map: {
    height: '40%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  listContainer: {
    height: '50%',
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
