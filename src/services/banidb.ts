// BaniDB API Service - Khalsa Foundation's authentic Gurbani database
const API_BASE_URL = 'https://api.banidb.com/v2';

// Common Nitnem Bani IDs from BaniDB
export const NITNEM_BANI_IDS = {
  JAPJI_SAHIB: 1,
  JAAP_SAHIB: 2,
  TVA_PRASAD_SAVAIYE: 3,
  CHAUPAI_SAHIB: 4,
  ANAND_SAHIB: 5,
  REHRAS_SAHIB: 6,
  KIRTAN_SOHILA: 7,
};

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
export function convertBaniDBToBani(baniDBData: BaniDBResponse, baniInfo: any) {
  try {
    const verses = baniDBData.verses;
    
    if (!Array.isArray(verses)) {
      throw new Error('Invalid API response: verses not found');
    }

    // Filter out header lines (header !== 0) and combine content lines
    const contentVerses = verses.filter(v => v.header === 0);

    // Combine all verses into continuous text blocks (Gutka format)
    const gurmukhiText = contentVerses
      .map(v => v.verse?.verse?.unicode || '')
      .filter(text => text && text.trim && text.trim())
      .join('\n\n');
    
    const transliterationText = contentVerses
      .map(v => v.verse?.transliteration?.english || v.verse?.transliteration?.en || '')
      .filter(text => text && text.trim && text.trim())
      .join('\n\n');
    
    const englishText = contentVerses
      .map(v => v.verse?.translation?.en || '')
      .filter(text => text && text.trim && text.trim())
      .join('\n\n');

    const hindiText = contentVerses
      .map(v => v.verse?.translation?.hi || '')
      .filter(text => text && text.trim && text.trim())
      .join('\n\n');

    const punjabiText = contentVerses
      .map(v => v.verse?.translation?.pu || '')
      .filter(text => text && text.trim && text.trim())
      .join('\n\n');

    return {
      id: baniInfo.id,
      name: baniInfo.name,
      nameGurmukhi: baniDBData.baniInfo?.unicode || baniInfo.nameGurmukhi,
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
  const baniInfos = [
    { id: '1', name: 'Japji Sahib', nameGurmukhi: 'ਜਪੁਜੀ ਸਾਹਿਬ', description: 'Morning prayer - The foundation of Sikh spirituality', time: 'Morning (Amrit Vela)', duration: '15-20 mins', apiId: NITNEM_BANI_IDS.JAPJI_SAHIB },
    { id: '2', name: 'Jaap Sahib', nameGurmukhi: 'ਜਾਪੁ ਸਾਹਿਬ', description: 'Composed by Guru Gobind Singh Ji', time: 'Morning (Amrit Vela)', duration: '10-15 mins', apiId: NITNEM_BANI_IDS.JAAP_SAHIB },
    { id: '3', name: 'Tav-Prasad Savaiye', nameGurmukhi: 'ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵਈਏ', description: 'Praise of the Almighty', time: 'Morning (Amrit Vela)', duration: '5 mins', apiId: NITNEM_BANI_IDS.TVA_PRASAD_SAVAIYE },
    { id: '4', name: 'Chaupai Sahib', nameGurmukhi: 'ਚੌਪਈ ਸਾਹਿਬ', description: 'Prayer for protection', time: 'Morning/Evening', duration: '5 mins', apiId: NITNEM_BANI_IDS.CHAUPAI_SAHIB },
    { id: '5', name: 'Anand Sahib', nameGurmukhi: 'ਆਨੰਦ ਸਾਹਿਬ', description: 'Song of Bliss', time: 'Morning/Evening', duration: '5-10 mins', apiId: NITNEM_BANI_IDS.ANAND_SAHIB },
    { id: '6', name: 'Rehras Sahib', nameGurmukhi: 'ਰਹਿਰਾਸ ਸਾਹਿਬ', description: 'Evening prayer', time: 'Evening (Sunset)', duration: '10-15 mins', apiId: NITNEM_BANI_IDS.REHRAS_SAHIB },
    { id: '7', name: 'Kirtan Sohila', nameGurmukhi: 'ਕੀਰਤਨ ਸੋਹਿਲਾ', description: 'Night prayer', time: 'Night (Before Sleep)', duration: '5 mins', apiId: NITNEM_BANI_IDS.KIRTAN_SOHILA },
  ];

  const banis = [];
  
  for (const info of baniInfos) {
    try {
      const baniData = await fetchBaniFromAPI(info.apiId);
      const bani = convertBaniDBToBani(baniData, info);
      banis.push(bani);
    } catch (error) {
      console.error(`Error fetching ${info.name}:`, error);
      // Keep static data as fallback
    }
  }

  return banis;
}
