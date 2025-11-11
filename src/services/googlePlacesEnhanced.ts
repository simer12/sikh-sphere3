/**
 * Enhanced Google Places API - Load ALL Gurdwaras at once
 * Comprehensive coverage with 75+ search locations across India
 */

import Constants from 'expo-constants';
import { Gurdwara } from './gurdwara';

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey || '';
const PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place';

/**
 * Fetch all Gurdwaras in India - COMPREHENSIVE VERSION
 * Queries 75+ locations across all Indian states
 */
export async function fetchAllGurdwarasIndia(): Promise<Gurdwara[]> {
  console.log('🌍 Starting comprehensive Gurdwara fetch from ALL of India...');
  
  const searchLocations = [
    // ===== FIVE TAKHTS - 100KM RADIUS PRIORITY =====
    { name: '⭐ Takht Sri Harmandir Sahib (Golden Temple)', lat: 31.6200, lng: 74.8765, radius: 100000 },
    { name: '⭐ Takht Sri Keshgarh Sahib - Anandpur', lat: 31.2394, lng: 76.5008, radius: 100000 },
    { name: '⭐ Takht Sri Damdama Sahib - Talwandi Sabo', lat: 29.9868, lng: 75.0874, radius: 100000 },
    { name: '⭐ Takht Sri Hazur Sahib - Nanded', lat: 19.1383, lng: 77.3210, radius: 100000 },
    { name: '⭐ Takht Sri Patna Sahib - Bihar', lat: 25.6093, lng: 85.1376, radius: 100000 },
    
    // Punjab - Very high density
    { name: 'Amritsar', lat: 31.6340, lng: 74.8723, radius: 150000 },
    { name: 'Ludhiana', lat: 30.9010, lng: 75.8573, radius: 100000 },
    { name: 'Jalandhar', lat: 31.3260, lng: 75.5762, radius: 80000 },
    { name: 'Patiala', lat: 30.3398, lng: 76.3869, radius: 80000 },
    { name: 'Bathinda', lat: 30.2110, lng: 74.9455, radius: 80000 },
    { name: 'Mohali', lat: 30.7046, lng: 76.7179, radius: 60000 },
    { name: 'Pathankot', lat: 32.2733, lng: 75.6520, radius: 60000 },
    { name: 'Hoshiarpur', lat: 31.5344, lng: 75.9119, radius: 60000 },
    { name: 'Moga', lat: 30.8158, lng: 75.1708, radius: 50000 },
    { name: 'Ferozepur', lat: 30.9181, lng: 74.6132, radius: 50000 },
    { name: 'Gurdaspur', lat: 32.0411, lng: 75.4054, radius: 50000 },
    { name: 'Kapurthala', lat: 31.3802, lng: 75.3807, radius: 50000 },
    { name: 'Sangrur', lat: 30.2448, lng: 75.8420, radius: 50000 },
    { name: 'Barnala', lat: 30.3776, lng: 75.5455, radius: 40000 },
    { name: 'Mansa Punjab', lat: 29.9988, lng: 75.3933, radius: 40000 },
    { name: 'Fatehgarh Sahib', lat: 30.6448, lng: 76.3946, radius: 40000 },
    { name: 'Rupnagar', lat: 30.9645, lng: 76.5308, radius: 40000 },
    { name: 'Muktsar', lat: 30.4755, lng: 74.5069, radius: 40000 },
    { name: 'Fazilka', lat: 30.4028, lng: 74.0279, radius: 40000 },
    { name: 'Tarn Taran', lat: 31.4519, lng: 74.9278, radius: 40000 },
    { name: 'Nawanshahr', lat: 31.1246, lng: 76.1163, radius: 40000 },
    { name: 'Abohar', lat: 30.1446, lng: 74.1989, radius: 40000 },
    { name: 'Malerkotla', lat: 30.5316, lng: 75.8813, radius: 30000 },
    { name: 'Khanna', lat: 30.7054, lng: 76.2217, radius: 30000 },
    { name: 'Phagwara', lat: 31.2246, lng: 75.7731, radius: 30000 },
    { name: 'Sunam', lat: 30.1282, lng: 75.7989, radius: 30000 },
    { name: 'Rajpura', lat: 30.4789, lng: 76.5935, radius: 30000 },
    { name: 'Dharamkot', lat: 31.2500, lng: 75.1167, radius: 30000 },
    
    // Haryana
    { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, radius: 100000 },
    { name: 'Ambala', lat: 30.3782, lng: 76.7767, radius: 80000 },
    { name: 'Karnal', lat: 29.6857, lng: 76.9905, radius: 60000 },
    { name: 'Panipat', lat: 29.3909, lng: 76.9635, radius: 60000 },
    { name: 'Kurukshetra', lat: 29.9695, lng: 76.8783, radius: 50000 },
    { name: 'Yamunanagar', lat: 30.1290, lng: 77.2674, radius: 50000 },
    { name: 'Rohtak', lat: 28.8955, lng: 76.6066, radius: 50000 },
    { name: 'Hisar', lat: 29.1492, lng: 75.7217, radius: 50000 },
    { name: 'Sirsa', lat: 29.5349, lng: 75.0289, radius: 40000 },
    { name: 'Sonipat', lat: 28.9931, lng: 77.0151, radius: 40000 },
    { name: 'Rewari', lat: 28.1989, lng: 76.6191, radius: 40000 },
    { name: 'Jhajjar', lat: 28.6063, lng: 76.6565, radius: 30000 },
    { name: 'Fatehabad', lat: 29.5152, lng: 75.4559, radius: 30000 },
    
    // Delhi NCR
    { name: 'Central Delhi', lat: 28.7041, lng: 77.1025, radius: 120000 },
    { name: 'Gurgaon', lat: 28.4595, lng: 77.0266, radius: 80000 },
    { name: 'Noida', lat: 28.5355, lng: 77.3910, radius: 60000 },
    { name: 'Faridabad', lat: 28.4089, lng: 77.3178, radius: 60000 },
    { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538, radius: 60000 },
    
    // Uttar Pradesh
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462, radius: 80000 },
    { name: 'Kanpur', lat: 26.4499, lng: 80.3319, radius: 70000 },
    { name: 'Agra', lat: 27.1767, lng: 78.0081, radius: 60000 },
    { name: 'Varanasi', lat: 25.3176, lng: 82.9739, radius: 60000 },
    { name: 'Meerut', lat: 28.9845, lng: 77.7064, radius: 60000 },
    { name: 'Bareilly', lat: 28.3670, lng: 79.4304, radius: 50000 },
    { name: 'Moradabad', lat: 28.8389, lng: 78.7378, radius: 50000 },
    { name: 'Saharanpur', lat: 29.9680, lng: 77.5460, radius: 50000 },
    { name: 'Allahabad', lat: 25.4358, lng: 81.8463, radius: 50000 },
    { name: 'Gorakhpur', lat: 26.7606, lng: 83.3732, radius: 50000 },
    { name: 'Mathura', lat: 27.4924, lng: 77.6737, radius: 50000 },
    { name: 'Aligarh', lat: 27.8974, lng: 78.0880, radius: 40000 },
    { name: 'Noida Extension', lat: 28.4744, lng: 77.5040, radius: 40000 },
    
    // Rajasthan
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, radius: 80000 },
    { name: 'Jodhpur', lat: 26.2389, lng: 73.0243, radius: 60000 },
    { name: 'Bikaner', lat: 28.0229, lng: 73.3119, radius: 50000 },
    { name: 'Udaipur', lat: 24.5854, lng: 73.7125, radius: 50000 },
    { name: 'Ajmer', lat: 26.4499, lng: 74.6399, radius: 50000 },
    { name: 'Kota', lat: 25.2138, lng: 75.8648, radius: 40000 },
    { name: 'Alwar', lat: 27.5530, lng: 76.6346, radius: 40000 },
    { name: 'Bharatpur', lat: 27.2173, lng: 77.4900, radius: 40000 },
    { name: 'Sikar', lat: 27.6119, lng: 75.1397, radius: 30000 },
    
    // Maharashtra
    { name: 'Mumbai Central', lat: 19.0760, lng: 72.8777, radius: 100000 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, radius: 80000 },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882, radius: 60000 },
    { name: 'Nashik', lat: 19.9975, lng: 73.7898, radius: 50000 },
    { name: 'Aurangabad', lat: 19.8762, lng: 75.3433, radius: 50000 },
    { name: 'Thane', lat: 19.2183, lng: 72.9781, radius: 40000 },
    { name: 'Nanded', lat: 19.1383, lng: 77.3210, radius: 100000 }, // HAZUR SAHIB!
    { name: 'Solapur', lat: 17.6599, lng: 75.9064, radius: 50000 },
    { name: 'Kolhapur', lat: 16.7050, lng: 74.2433, radius: 40000 },
    { name: 'Ahmednagar', lat: 19.0948, lng: 74.7480, radius: 40000 },
    
    // Gujarat
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, radius: 80000 },
    { name: 'Surat', lat: 21.1702, lng: 72.8311, radius: 60000 },
    { name: 'Vadodara', lat: 22.3072, lng: 73.1812, radius: 50000 },
    { name: 'Rajkot', lat: 22.3039, lng: 70.8022, radius: 50000 },
    { name: 'Gandhinagar', lat: 23.2156, lng: 72.6369, radius: 40000 },
    
    // Karnataka
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946, radius: 80000 },
    { name: 'Mysore', lat: 12.2958, lng: 76.6394, radius: 50000 },
    { name: 'Hubli', lat: 15.3647, lng: 75.1240, radius: 40000 },
    
    // Telangana & AP
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, radius: 80000 },
    { name: 'Visakhapatnam', lat: 17.6869, lng: 83.2185, radius: 50000 },
    { name: 'Vijayawada', lat: 16.5062, lng: 80.6480, radius: 40000 },
    
    // Tamil Nadu
    { name: 'Chennai', lat: 13.0827, lng: 80.2707, radius: 80000 },
    { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, radius: 50000 },
    { name: 'Madurai', lat: 9.9252, lng: 78.1198, radius: 40000 },
    
    // Kerala
    { name: 'Kochi', lat: 9.9312, lng: 76.2673, radius: 50000 },
    { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, radius: 40000 },
    
    // West Bengal
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, radius: 80000 },
    { name: 'Siliguri', lat: 26.7271, lng: 88.3953, radius: 40000 },
    
    // Bihar & Jharkhand
    { name: 'Patna', lat: 25.5941, lng: 85.1376, radius: 80000 },
    { name: 'Gaya', lat: 24.7955, lng: 85.0002, radius: 40000 },
    { name: 'Ranchi', lat: 23.3441, lng: 85.3096, radius: 50000 },
    { name: 'Jamshedpur', lat: 22.8046, lng: 86.2029, radius: 40000 },
    
    // Madhya Pradesh
    { name: 'Indore', lat: 22.7196, lng: 75.8577, radius: 60000 },
    { name: 'Bhopal', lat: 23.2599, lng: 77.4126, radius: 60000 },
    { name: 'Gwalior', lat: 26.2183, lng: 78.1828, radius: 50000 },
    { name: 'Jabalpur', lat: 23.1815, lng: 79.9864, radius: 40000 },
    
    // Chhattisgarh
    { name: 'Raipur', lat: 21.2514, lng: 81.6296, radius: 50000 },
    
    // Odisha
    { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, radius: 50000 },
    
    // Himachal Pradesh
    { name: 'Shimla', lat: 31.1048, lng: 77.1734, radius: 100000 },
    { name: 'Dharamshala', lat: 32.2190, lng: 76.3234, radius: 60000 },
    { name: 'Kullu', lat: 31.9578, lng: 77.1095, radius: 50000 },
    
    // J&K and Ladakh
    { name: 'Jammu', lat: 32.7266, lng: 74.8570, radius: 100000 },
    { name: 'Srinagar', lat: 34.0837, lng: 74.7973, radius: 80000 },
    { name: 'Leh', lat: 34.1526, lng: 77.5771, radius: 60000 },
    
    // Uttarakhand
    { name: 'Dehradun', lat: 30.3165, lng: 78.0322, radius: 80000 },
    { name: 'Haridwar', lat: 29.9457, lng: 78.1642, radius: 60000 },
    { name: 'Nainital', lat: 29.3803, lng: 79.4636, radius: 40000 },
    
    // North East
    { name: 'Guwahati', lat: 26.1445, lng: 91.7362, radius: 60000 },
    { name: 'Imphal', lat: 24.8170, lng: 93.9368, radius: 40000 },
    
    // Goa
    { name: 'Panaji', lat: 15.4909, lng: 73.8278, radius: 40000 },
  ];

  const allGurdwaras: Gurdwara[] = [];
  const seenIds = new Set<string>();
  let successCount = 0;
  let errorCount = 0;

  console.log(`📍 Will query ${searchLocations.length} locations across India`);

  for (let i = 0; i < searchLocations.length; i++) {
    const location = searchLocations[i];
    try {
      console.log(`[${i+1}/${searchLocations.length}] ${location.name}...`);
      
      const url = `${PLACES_API_BASE}/nearbysearch/json?` +
        `location=${location.lat},${location.lng}&` +
        `radius=${location.radius}&` +
        `type=place_of_worship&` +
        `keyword=gurdwara|gurudwara|sikh temple|sikh gurudwara|takht|dera|gurudwara sahib&` +
        `key=${GOOGLE_PLACES_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        let newCount = 0;
        data.results.forEach((place: any) => {
          const id = `google-${place.place_id}`;
          if (!seenIds.has(id)) {
            seenIds.add(id);
            allGurdwaras.push({
              id,
              name: place.name,
              address: place.vicinity || place.formatted_address || '',
              city: location.name,
              state: '',
              country: 'India',
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
              type: 'community',
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
            });
            newCount++;
          }
        });
        
        successCount++;
        console.log(`  ✓ +${newCount} new | Total: ${allGurdwaras.length}`);
      } else if (data.status === 'ZERO_RESULTS') {
        console.log(`  - No results`);
      } else {
        console.error(`  ✗ API Error: ${data.status}`);
        errorCount++;
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      errorCount++;
      console.error(`  ✗ ${location.name} failed:`, error);
    }
  }

  console.log(`\n📊 FINAL RESULTS:`);
  console.log(`   ✅ Successful queries: ${successCount}/${searchLocations.length}`);
  console.log(`   ❌ Failed queries: ${errorCount}`);
  console.log(`   🏛️  TOTAL GURDWARAS: ${allGurdwaras.length}`);
  
  return allGurdwaras;
}
