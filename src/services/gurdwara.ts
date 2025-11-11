/**
 * Comprehensive Gurdwara Database Service
 * Sources: OpenStreetMap, Wikidata, Community contributions
 */

// Multiple Overpass API servers for better reliability
const OVERPASS_SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

let currentServerIndex = 0;

function getOverpassServer(): string {
  const server = OVERPASS_SERVERS[currentServerIndex];
  currentServerIndex = (currentServerIndex + 1) % OVERPASS_SERVERS.length;
  return server;
}

export interface Gurdwara {
  id: string;
  name: string;
  nameGurmukhi?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  description?: string;
  established?: string;
  type: 'historical' | 'community' | 'takht' | 'other';
  // Google Places specific fields
  rating?: number;
  userRatingsTotal?: number;
  photos?: string[];
}

/**
 * Fetch Gurdwaras from OpenStreetMap Overpass API
 * This gets real, up-to-date Gurdwara locations worldwide
 */
export async function fetchGurdwarasNearLocation(
  latitude: number,
  longitude: number,
  radiusKm: number = 50
): Promise<Gurdwara[]> {
  try {
    // Overpass API query - increased timeout and better query
    const query = `
      [out:json][timeout:90];
      (
        node["amenity"="place_of_worship"]["religion"="sikh"](around:${radiusKm * 1000},${latitude},${longitude});
        way["amenity"="place_of_worship"]["religion"="sikh"](around:${radiusKm * 1000},${latitude},${longitude});
        relation["amenity"="place_of_worship"]["religion"="sikh"](around:${radiusKm * 1000},${latitude},${longitude});
        node["building"="gurdwara"](around:${radiusKm * 1000},${latitude},${longitude});
        way["building"="gurdwara"](around:${radiusKm * 1000},${latitude},${longitude});
      );
      out center 1000;
    `;

    const response = await fetch(getOverpassServer(), {
      method: 'POST',
      body: query,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from OpenStreetMap');
    }

    const data = await response.json();
    
    const gurdwaras = data.elements.map((element: any, index: number) => {
      const lat = element.lat || element.center?.lat || latitude;
      const lon = element.lon || element.center?.lon || longitude;
      
      return {
        id: `osm-${element.id}`,
        name: element.tags?.name || element.tags?.['name:en'] || 'Gurdwara Sahib',
        nameGurmukhi: element.tags?.['name:pa'] || element.tags?.['name:pnb'],
        address: formatAddress(element.tags),
        city: element.tags?.['addr:city'] || element.tags?.city || '',
        state: element.tags?.['addr:state'] || element.tags?.state,
        country: element.tags?.['addr:country'] || element.tags?.country || '',
        latitude: lat,
        longitude: lon,
        phone: element.tags?.phone || element.tags?.['contact:phone'],
        website: element.tags?.website || element.tags?.['contact:website'],
        description: element.tags?.description,
        type: determineType(element.tags),
      } as Gurdwara;
    });

    console.log(`Fetched ${gurdwaras.length} Gurdwaras from OSM`);
    return gurdwaras;
  } catch (error) {
    console.error('Error fetching from OSM:', error);
    return [];
  }
}

/**
 * Search Gurdwaras by name or location
 */
export async function searchGurdwaras(searchTerm: string): Promise<Gurdwara[]> {
  try {
    const query = `
      [out:json][timeout:90];
      (
        node["amenity"="place_of_worship"]["religion"="sikh"]["name"~"${searchTerm}",i];
        way["amenity"="place_of_worship"]["religion"="sikh"]["name"~"${searchTerm}",i];
        relation["amenity"="place_of_worship"]["religion"="sikh"]["name"~"${searchTerm}",i];
        node["building"="gurdwara"]["name"~"${searchTerm}",i];
        way["building"="gurdwara"]["name"~"${searchTerm}",i];
      );
      out center 1000;
    `;

    const response = await fetch(getOverpassServer(), {
      method: 'POST',
      body: query,
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    
    const results = data.elements.slice(0, 100).map((element: any) => {
      const lat = element.lat || element.center?.lat || 0;
      const lon = element.lon || element.center?.lon || 0;
      
      return {
        id: `osm-${element.id}`,
        name: element.tags?.name || 'Gurdwara Sahib',
        nameGurmukhi: element.tags?.['name:pa'],
        address: formatAddress(element.tags),
        city: element.tags?.['addr:city'] || '',
        state: element.tags?.['addr:state'],
        country: element.tags?.['addr:country'] || '',
        latitude: lat,
        longitude: lon,
        phone: element.tags?.phone,
        website: element.tags?.website,
        type: determineType(element.tags),
      } as Gurdwara;
    });

    console.log(`Search found ${results.length} Gurdwaras`);
    return results;
  } catch (error) {
    console.error('Error searching:', error);
    return [];
  }
}

/**
 * Fetch all Gurdwaras in a country or region
 * For comprehensive coverage
 */
export async function fetchGurdwarasByCountry(countryCode: string): Promise<Gurdwara[]> {
  try {
    console.log(`Fetching all Gurdwaras in ${countryCode}...`);
    
    const query = `
      [out:json][timeout:180];
      area["ISO3166-1"="${countryCode}"][admin_level=2];
      (
        node["amenity"="place_of_worship"]["religion"="sikh"](area);
        way["amenity"="place_of_worship"]["religion"="sikh"](area);
        relation["amenity"="place_of_worship"]["religion"="sikh"](area);
        node["building"="gurdwara"](area);
        way["building"="gurdwara"](area);
      );
      out center 5000;
    `;

    const response = await fetch(getOverpassServer(), {
      method: 'POST',
      body: query,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${countryCode}`);
    }

    const data = await response.json();
    
    const gurdwaras = data.elements.map((element: any) => {
      const lat = element.lat || element.center?.lat || 0;
      const lon = element.lon || element.center?.lon || 0;
      
      return {
        id: `osm-${element.id}`,
        name: element.tags?.name || element.tags?.['name:en'] || 'Gurdwara Sahib',
        nameGurmukhi: element.tags?.['name:pa'] || element.tags?.['name:pnb'],
        address: formatAddress(element.tags),
        city: element.tags?.['addr:city'] || element.tags?.city || '',
        state: element.tags?.['addr:state'] || element.tags?.state,
        country: element.tags?.['addr:country'] || countryCode,
        latitude: lat,
        longitude: lon,
        phone: element.tags?.phone || element.tags?.['contact:phone'],
        website: element.tags?.website || element.tags?.['contact:website'],
        description: element.tags?.description,
        type: determineType(element.tags),
      } as Gurdwara;
    });

    console.log(`Fetched ${gurdwaras.length} Gurdwaras from ${countryCode}`);
    return gurdwaras;
  } catch (error) {
    console.error(`Error fetching from ${countryCode}:`, error);
    return [];
  }
}

/**
 * Fetch all Gurdwaras in India (comprehensive)
 * Uses multiple queries to bypass API limits
 */
export async function fetchAllIndianGurdwaras(): Promise<Gurdwara[]> {
  console.log('Fetching all Gurdwaras in India - this may take a while...');
  
  // Major states/regions with significant Sikh populations
  const regions = [
    { name: 'Punjab', bbox: '29.5,73.9,32.6,76.9' },
    { name: 'Haryana', bbox: '27.6,74.4,30.9,77.6' },
    { name: 'Delhi', bbox: '28.4,76.8,28.9,77.4' },
    { name: 'Uttar Pradesh', bbox: '23.8,77.0,30.4,84.6' },
    { name: 'Rajasthan', bbox: '23.0,69.5,30.2,78.3' },
    { name: 'Himachal Pradesh', bbox: '30.4,75.5,33.3,79.1' },
    { name: 'Jammu & Kashmir', bbox: '32.3,73.3,37.1,80.3' },
    { name: 'Uttarakhand', bbox: '28.7,77.5,31.5,81.0' },
    { name: 'Madhya Pradesh', bbox: '21.1,74.0,26.9,82.8' },
    { name: 'Maharashtra', bbox: '15.6,72.6,22.0,80.9' },
    { name: 'Gujarat', bbox: '20.1,68.2,24.7,74.5' },
    { name: 'Bihar', bbox: '24.3,83.3,27.5,88.3' },
    { name: 'Rest of India', bbox: '6.7,68.1,35.5,97.4' }, // Entire India for missed ones
  ];
  
  const allGurdwaras: Gurdwara[] = [];
  const seenIds = new Set<string>();
  
  for (const region of regions) {
    try {
      console.log(`Fetching Gurdwaras in ${region.name}...`);
      
      const [south, west, north, east] = region.bbox.split(',').map(Number);
      
      const query = `
        [out:json][timeout:120];
        (
          node["amenity"="place_of_worship"]["religion"="sikh"](${south},${west},${north},${east});
          way["amenity"="place_of_worship"]["religion"="sikh"](${south},${west},${north},${east});
          relation["amenity"="place_of_worship"]["religion"="sikh"](${south},${west},${north},${east});
          node["building"="gurdwara"](${south},${west},${north},${east});
          way["building"="gurdwara"](${south},${west},${north},${east});
        );
        out center 10000;
      `;

      const response = await fetch(getOverpassServer(), {
        method: 'POST',
        body: query,
      });

      if (response.ok) {
        const data = await response.json();
        
        data.elements.forEach((element: any) => {
          const osmId = `osm-${element.id}`;
          
          // Avoid duplicates
          if (seenIds.has(osmId)) return;
          seenIds.add(osmId);
          
          const lat = element.lat || element.center?.lat || 0;
          const lon = element.lon || element.center?.lon || 0;
          
          if (lat === 0 || lon === 0) return;
          
          allGurdwaras.push({
            id: osmId,
            name: element.tags?.name || element.tags?.['name:en'] || 'Gurdwara Sahib',
            nameGurmukhi: element.tags?.['name:pa'] || element.tags?.['name:pnb'],
            address: formatAddress(element.tags),
            city: element.tags?.['addr:city'] || element.tags?.city || '',
            state: element.tags?.['addr:state'] || element.tags?.state || region.name,
            country: 'India',
            latitude: lat,
            longitude: lon,
            phone: element.tags?.phone || element.tags?.['contact:phone'],
            website: element.tags?.website || element.tags?.['contact:website'],
            description: element.tags?.description,
            type: determineType(element.tags),
          });
        });
        
        console.log(`${region.name}: Found ${data.elements.length} Gurdwaras (Total: ${allGurdwaras.length})`);
      }
      
      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error fetching ${region.name}:`, error);
    }
  }
  
  console.log(`✅ Total Gurdwaras fetched: ${allGurdwaras.length}`);
  return allGurdwaras;
}

/**
 * Get featured/famous Gurdwaras
 */
export function getFamousGurdwaras(): Gurdwara[] {
  return [
    // Five Takhts
    {
      id: 'takht-1',
      name: 'Akal Takht Sahib',
      nameGurmukhi: 'ਅਕਾਲ ਤਖ਼ਤ ਸਾਹਿਬ',
      address: 'Golden Temple Complex, Amritsar',
      city: 'Amritsar',
      state: 'Punjab',
      country: 'India',
      latitude: 31.6200,
      longitude: 74.8765,
      phone: '+91-183-2553957',
      website: 'https://sgpc.net',
      description: 'The highest seat of Sikh religious and temporal authority',
      type: 'takht',
    },
    {
      id: 'takht-2',
      name: 'Sri Harmandir Sahib (Golden Temple)',
      nameGurmukhi: 'ਹਰਿਮੰਦਰ ਸਾਹਿਬ',
      address: 'Golden Temple Road, Atta Mandi',
      city: 'Amritsar',
      state: 'Punjab',
      country: 'India',
      latitude: 31.6200,
      longitude: 74.8765,
      phone: '+91-183-2553957',
      website: 'https://sgpc.net',
      description: 'The most sacred Gurdwara of Sikhism, also known as Darbar Sahib',
      established: '1604',
      type: 'takht',
    },
    {
      id: 'takht-3',
      name: 'Takht Sri Keshgarh Sahib',
      nameGurmukhi: 'ਤਖ਼ਤ ਸ੍ਰੀ ਕੇਸਗੜ੍ਹ ਸਾਹਿਬ',
      address: 'Anandpur Sahib',
      city: 'Anandpur Sahib',
      state: 'Punjab',
      country: 'India',
      latitude: 31.2394,
      longitude: 76.5008,
      description: 'Where Khalsa was founded in 1699',
      established: '1699',
      type: 'takht',
    },
    {
      id: 'takht-4',
      name: 'Takht Sri Damdama Sahib',
      nameGurmukhi: 'ਤਖ਼ਤ ਸ੍ਰੀ ਦਮਦਮਾ ਸਾਹਿਬ',
      address: 'Talwandi Sabo',
      city: 'Bathinda',
      state: 'Punjab',
      country: 'India',
      latitude: 29.9868,
      longitude: 75.0874,
      description: 'Where Guru Gobind Singh Ji prepared the final version of Guru Granth Sahib',
      type: 'takht',
    },
    {
      id: 'takht-5',
      name: 'Takht Sri Hazur Sahib',
      nameGurmukhi: 'ਤਖ਼ਤ ਸ੍ਰੀ ਹਜ਼ੂਰ ਸਾਹਿਬ',
      address: 'Nanded',
      city: 'Nanded',
      state: 'Maharashtra',
      country: 'India',
      latitude: 19.1383,
      longitude: 77.3210,
      description: 'Where Guru Gobind Singh Ji left for heavenly abode',
      established: '1708',
      type: 'takht',
    },
    {
      id: 'takht-6',
      name: 'Takht Sri Patna Sahib',
      nameGurmukhi: 'ਤਖ਼ਤ ਸ੍ਰੀ ਪਟਨਾ ਸਾਹਿਬ',
      address: 'Patna City',
      city: 'Patna',
      state: 'Bihar',
      country: 'India',
      latitude: 25.6093,
      longitude: 85.1376,
      description: 'Birthplace of Guru Gobind Singh Ji',
      established: '1666',
      type: 'takht',
    },
    // Major Historical Gurdwaras
    {
      id: 'hist-1',
      name: 'Gurdwara Bangla Sahib',
      nameGurmukhi: 'ਗੁਰਦੁਆਰਾ ਬੰਗਲਾ ਸਾਹਿਬ',
      address: 'Ashoka Road, Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      latitude: 28.6262,
      longitude: 77.2081,
      phone: '+91-11-23364009',
      description: 'Associated with Guru Har Krishan Sahib Ji',
      type: 'historical',
    },
    {
      id: 'hist-2',
      name: 'Gurdwara Sis Ganj Sahib',
      nameGurmukhi: 'ਗੁਰਦੁਆਰਾ ਸੀਸ ਗੰਜ ਸਾਹਿਬ',
      address: 'Chandni Chowk',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      latitude: 28.6506,
      longitude: 77.2303,
      phone: '+91-11-23273369',
      description: 'Martyrdom place of Guru Tegh Bahadur Ji',
      type: 'historical',
    },
    {
      id: 'hist-3',
      name: 'Gurdwara Janam Asthan',
      nameGurmukhi: 'ਗੁਰਦੁਆਰਾ ਜਨਮ ਅਸਥਾਨ',
      address: 'Nankana Sahib',
      city: 'Nankana Sahib',
      state: 'Punjab',
      country: 'Pakistan',
      latitude: 31.4502,
      longitude: 73.7056,
      description: 'Birthplace of Guru Nanak Dev Ji',
      type: 'historical',
    },
  ];
}

function formatAddress(tags: any): string {
  const parts = [];
  if (tags?.['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags?.['addr:street']) parts.push(tags['addr:street']);
  if (tags?.['addr:city']) parts.push(tags['addr:city']);
  if (tags?.['addr:postcode']) parts.push(tags['addr:postcode']);
  
  return parts.join(', ') || tags?.address || 'Address not available';
}

function determineType(tags: any): 'historical' | 'community' | 'takht' | 'other' {
  const name = tags?.name?.toLowerCase() || '';
  
  if (name.includes('takht') || name.includes('akal')) return 'takht';
  if (name.includes('janam') || name.includes('martyrdom') || tags?.historic) return 'historical';
  return 'community';
}
