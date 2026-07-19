// BaniDB API Service - Khalsa Foundation's authentic Gurbani database
const API_BASE_URL = 'https://api.banidb.com/v2';

interface BaniDBVerse {
  verse: {
    verseId: number;
    verse: {
      unicode: string;
      gurmukhi: string;
    };
    transliteration: {
      english: string;
      en: string;
    };
    translation: {
      en: string;
      pu: string;
      hi: string;
    };
  };
  header: number;
}

interface BaniDBResponse {
  baniInfo: {
    baniID: number;
    unicode: string;
    english: string;
    gurmukhi: string;
    hindi: string;
  };
  verses: BaniDBVerse[];
}

import { nitnemBanisMetadata, type NitnemBaniMetadata } from '../data/banis';

/**
 * Fetch complete Bani from BaniDB API
 */
export async function fetchBaniFromAPI(baniId: number): Promise<BaniDBResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/banis/${baniId}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Loaded Bani ${baniId}: ${data.baniInfo?.unicode || data.baniInfo?.english}`);
    console.log(`Verses count: ${data.verses?.length || 0}`);
    return data;
  } catch (error) {
    console.error('Error fetching Bani from BaniDB:', error);
    throw error;
  }
}

/**
 * Convert BaniDB response to our app's Bani format (continuous Gutka style)
 */
export function convertBaniDBToBani(baniDBData: BaniDBResponse | BaniDBResponse[], baniInfo: NitnemBaniMetadata) {
  try {
    const responses = Array.isArray(baniDBData) ? baniDBData : [baniDBData];
    const verses = responses.reduce<BaniDBVerse[]>((mergedVerses, response) => {
      if (Array.isArray(response.verses)) {
        mergedVerses.push(...response.verses);
      }

      return mergedVerses;
    }, []);
    
    if (!Array.isArray(verses)) {
      throw new Error('Invalid API response: verses not found');
    }

    // Include ALL verses - headers and content (header values: 0=content, 1+=headers)
    // Headers often contain important content like Mool Mantar, section titles, etc.
    const allVerses = verses;

    // Combine all verses into continuous text blocks (Gutka format)
    const gurmukhiText = allVerses
      .map(v => v.verse?.verse?.unicode || '')
      .filter(text => text && text.trim && text.trim())
      .join('\n\n');
    
    const transliterationText = allVerses
      .map(v => v.verse?.transliteration?.english || v.verse?.transliteration?.en || '')
      .filter(text => text && text.trim && text.trim())
      .join('\n\n');
    
    const englishText = allVerses
      .map(v => v.verse?.translation?.en || '')
      .filter(text => text && text.trim && text.trim())
      .join('\n\n');

    const hindiText = allVerses
      .map(v => v.verse?.translation?.hi || '')
      .filter(text => text && text.trim && text.trim())
      .join('\n\n');

    const punjabiText = allVerses
      .map(v => v.verse?.translation?.pu || '')
      .filter(text => text && text.trim && text.trim())
      .join('\n\n');

    return {
      id: baniInfo.id,
      name: baniInfo.name,
      nameGurmukhi: baniInfo.nameGurmukhi, // Use our metadata names, not API names
      description: baniInfo.description,
      time: baniInfo.time,
      duration: baniInfo.duration,
      gurmukhi: gurmukhiText,
      transliteration: transliterationText,
      english: englishText,
      hindi: hindiText,
      punjabi: punjabiText || gurmukhiText,
    };
  } catch (error) {
    console.error('Error converting BaniDB data:', error);
    throw error;
  }
}

/**
 * Fetch all Nitnem Banis
 */
export async function fetchAllNitnemBanis() {
  const banis = [];
  
  for (const info of nitnemBanisMetadata) {
    try {
      const baniData = await Promise.all(info.apiIds.map(apiId => fetchBaniFromAPI(apiId)));
      const bani = convertBaniDBToBani(baniData, info);
      banis.push(bani);
    } catch (error) {
      console.error(`Error fetching ${info.name}:`, error);
      // Keep static data as fallback
    }
  }

  return banis;
}
