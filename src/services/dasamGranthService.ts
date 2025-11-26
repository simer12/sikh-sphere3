// Dasam Granth Service - Loads content from local JSON files
// Content downloaded from BaniDB API and stored as JSON

// Import all JSON files
import bani3 from '../data/dasamGranthContent/3.json';
import bani4 from '../data/dasamGranthContent/4.json';
import bani5 from '../data/dasamGranthContent/5.json';
import bani6 from '../data/dasamGranthContent/6.json';
import bani12 from '../data/dasamGranthContent/12.json';
import bani13 from '../data/dasamGranthContent/13.json';
import bani19 from '../data/dasamGranthContent/19.json';
import bani28 from '../data/dasamGranthContent/28.json';

export interface DasamGranthVerse {
  id: string;
  gurmukhi: string;
  transliteration?: string;
  translation?: string;
  lineNumber: number;
}

export interface DasamGranthBaniDetail {
  id: number;
  name: string;
  nameGurmukhi: string;
  description: string;
  verses: DasamGranthVerse[];
  totalVerses: number;
  gurmukhi?: string; // Combined Gurmukhi text for traditional display
}

// Map Bani Gurmukhi names to their JSON file IDs (matching Nitnem structure)
const BANI_GURMUKHI_TO_ID: { [key: string]: number } = {
  'ਜਾਪੁ ਸਾਹਿਬ': 4,
  'ਅਕਾਲ ਉਸਤਤ': 28,
  'ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ': 5,
  'ਚੌਪਈ ਸਾਹਿਬ': 6,
  'ਸ਼ਬਦ ਹਜ਼ਾਰੇ': 3,
  'ਅਠ ਚੰਡੀ ਚਰਿਤ੍ਰ': 12,
  'ਚੰਡੀ ਦੀ ਵਾਰ': 13,
  'ਸ਼ਸਤਰ ਨਾਮ ਮਾਲਾ': 19,
};

// Map IDs to imported JSON data
const BANI_DATA: { [key: number]: any } = {
  3: bani3,
  4: bani4,
  5: bani5,
  6: bani6,
  12: bani12,
  13: bani13,
  19: bani19,
  28: bani28,
};

/**
 * Fetch a specific Dasam Granth Bani from local JSON files
 * Uses Gurmukhi name as parameter (matching Nitnem structure)
 */
export const fetchDasamGranthBani = async (
  baniNameGurmukhi: string
): Promise<DasamGranthBaniDetail | null> => {
  try {
    const baniId = BANI_GURMUKHI_TO_ID[baniNameGurmukhi];
    
    if (!baniId) {
      console.log(`Bani not found: ${baniNameGurmukhi}`);
      return null;
    }

    const baniData = BANI_DATA[baniId];
    
    if (!baniData) {
      console.log(`Bani data not found for ID: ${baniId}`);
      return null;
    }
    
    return baniData as DasamGranthBaniDetail;

  } catch (error) {
    console.error('Error fetching Dasam Granth Bani:', error);
    return null;
  }
};

/**
 * Get list of all available Dasam Granth Banis
 */
export const getAvailableDasamGranthBanis = () => {
  return Object.keys(BANI_GURMUKHI_TO_ID).map(nameGurmukhi => ({
    nameGurmukhi,
    id: BANI_GURMUKHI_TO_ID[nameGurmukhi],
  }));
};
