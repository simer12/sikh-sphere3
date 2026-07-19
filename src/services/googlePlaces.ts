/**
 * Google Places API Service for Gurdwara Database
 * Provides comprehensive, accurate Gurdwara data worldwide
 */

import Constants from 'expo-constants';
import { Gurdwara } from './gurdwara';

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey || '';
const PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place';

/**
 * Fetch Gurdwaras near a location using Google Places API
 */
export async function fetchGurdwarasNearLocationGoogle(
  latitude: number,
  longitude: number,
  radiusMeters: number = 50000
): Promise<Gurdwara[]> {
  try {
    console.log(`Fetching Gurdwaras from Google Places within ${radiusMeters/1000}km...`);
    
    const url = `${PLACES_API_BASE}/nearbysearch/json?` +
      `location=${latitude},${longitude}&` +
      `radius=${radiusMeters}&` +
      `type=place_of_worship&` +
      `keyword=gurdwara|gurudwara|sikh temple&` +
      `key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      throw new Error(`Google Places API: ${data.status}`);
    }

    const gurdwaras = data.results.map((place: any) => ({
      id: `google-${place.place_id}`,
      name: place.name,
      address: place.vicinity || place.formatted_address || '',
      city: extractCity(place),
      state: extractState(place),
      country: extractCountry(place),
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      phone: place.formatted_phone_number,
      website: place.website,
      description: place.editorial_summary?.overview,
      type: determineType(place.name),
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      photos: place.photos?.map((p: any) => getPhotoUrl(p.photo_reference)) || [],
    })) as Gurdwara[];

    console.log(`✅ Google Places: Found ${gurdwaras.length} Gurdwaras`);
    return gurdwaras;
  } catch (error) {
    console.error('Error fetching from Google Places:', error);
    throw error;
  }
}

/**
 * Search Gurdwaras by text query using Google Places API
 */
export async function searchGurdwarasGoogle(query: string): Promise<Gurdwara[]> {
  try {
    console.log(`Searching Google Places for: ${query}`);
    
    const url = `${PLACES_API_BASE}/textsearch/json?` +
      `query=${encodeURIComponent(query + ' gurdwara')}&` +
      `key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places search error:', data.status);
      throw new Error(`Search failed: ${data.status}`);
    }

    const results = data.results.map((place: any) => ({
      id: `google-${place.place_id}`,
      name: place.name,
      address: place.formatted_address || '',
      city: extractCity(place),
      state: extractState(place),
      country: extractCountry(place),
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      type: determineType(place.name),
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
    })) as Gurdwara[];

    console.log(`✅ Search found ${results.length} Gurdwaras`);
    return results;
  } catch (error) {
    console.error('Error searching Google Places:', error);
    throw error;
  }
}

/**
 * Fetch all Gurdwaras in India using region-by-region search
 */
export async function fetchAllIndianGurdwarasGoogle(): Promise<Gurdwara[]> {
  console.log('Fetching all Gurdwaras in India from Google Places...');
  
  // Major cities and regions in India with significant Gurdwara populations
  const searchLocations = [
    // Punjab
    { name: 'Amritsar', lat: 31.6340, lng: 74.8723, radius: 100000 },
    { name: 'Ludhiana', lat: 30.9010, lng: 75.8573, radius: 80000 },
    { name: 'Jalandhar', lat: 31.3260, lng: 75.5762, radius: 60000 },
    { name: 'Patiala', lat: 30.3398, lng: 76.3869, radius: 60000 },
    { name: 'Bathinda', lat: 30.2110, lng: 74.9455, radius: 60000 },
    
    // Haryana
    { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, radius: 80000 },
    { name: 'Ambala', lat: 30.3782, lng: 76.7767, radius: 50000 },
    { name: 'Karnal', lat: 29.6857, lng: 76.9905, radius: 50000 },
    
    // Delhi
    { name: 'Delhi', lat: 28.7041, lng: 77.1025, radius: 100000 },
    
    // Uttar Pradesh
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462, radius: 60000 },
    { name: 'Kanpur', lat: 26.4499, lng: 80.3319, radius: 50000 },
    { name: 'Agra', lat: 27.1767, lng: 78.0081, radius: 50000 },
    
    // Rajasthan
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, radius: 60000 },
    { name: 'Jodhpur', lat: 26.2389, lng: 73.0243, radius: 50000 },
    
    // Maharashtra
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, radius: 80000 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, radius: 60000 },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882, radius: 50000 },
    
    // Other major cities
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946, radius: 60000 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, radius: 60000 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707, radius: 60000 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, radius: 60000 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, radius: 60000 },
    { name: 'Patna', lat: 25.5941, lng: 85.1376, radius: 60000 },
    
    // Himachal Pradesh & J&K
    { name: 'Shimla', lat: 31.1048, lng: 77.1734, radius: 80000 },
    { name: 'Jammu', lat: 32.7266, lng: 74.8570, radius: 80000 },
  ];

  const allGurdwaras: Gurdwara[] = [];
  const seenIds = new Set<string>();

  for (const location of searchLocations) {
    try {
      console.log(`Fetching from ${location.name}...`);
      
      const gurdwaras = await fetchGurdwarasNearLocationGoogle(
        location.lat,
        location.lng,
        location.radius
      );

      // Add unique Gurdwaras only
      gurdwaras.forEach(g => {
        if (!seenIds.has(g.id)) {
          seenIds.add(g.id);
          allGurdwaras.push(g);
        }
      });

      console.log(`${location.name}: +${gurdwaras.length} | Total: ${allGurdwaras.length}`);

      // Rate limiting - Google has stricter limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error fetching ${location.name}:`, error);
    }
  }

  console.log(`🎉 Total unique Gurdwaras from Google: ${allGurdwaras.length}`);
  return allGurdwaras;
}

/**
 * Get photo URL from photo reference
 */
function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  return `${PLACES_API_BASE}/photo?` +
    `maxwidth=${maxWidth}&` +
    `photo_reference=${photoReference}&` +
    `key=${GOOGLE_PLACES_API_KEY}`;
}

/**
 * Extract city from place data
 */
function extractCity(place: any): string {
  if (place.vicinity) return place.vicinity.split(',')[0] || '';
  
  const addressComponents = place.address_components || [];
  const city = addressComponents.find((c: any) => 
    c.types.includes('locality') || c.types.includes('administrative_area_level_2')
  );
  
  return city?.long_name || '';
}

/**
 * Extract state from place data
 */
function extractState(place: any): string {
  const addressComponents = place.address_components || [];
  const state = addressComponents.find((c: any) => 
    c.types.includes('administrative_area_level_1')
  );
  
  return state?.long_name || '';
}

/**
 * Extract country from place data
 */
function extractCountry(place: any): string {
  const addressComponents = place.address_components || [];
  const country = addressComponents.find((c: any) => 
    c.types.includes('country')
  );
  
  return country?.long_name || '';
}

/**
 * Determine Gurdwara type from name
 */
function determineType(name: string): 'historical' | 'community' | 'takht' | 'other' {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('takht') || lowerName.includes('akal')) return 'takht';
  if (lowerName.includes('harmandir') || lowerName.includes('golden temple')) return 'takht';
  if (lowerName.includes('bangla') || lowerName.includes('sis ganj') || lowerName.includes('janam')) {
    return 'historical';
  }
  
  return 'community';
}
