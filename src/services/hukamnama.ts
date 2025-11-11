/**
 * Hukamnama Service
 * Fetches daily Hukamnama from SGPC website via CORS proxy
 */

interface HukamnamaData {
  date: string;
  gurmukhi: string;
  punjabi: string;
  english: string;
  reference: string;
  ang: string;
  raag: string;
}

/**
 * Fetch Hukamnama from SGPC website
 * Tries direct fetch first, then falls back to parsing
 */
export async function fetchHukamnama(): Promise<HukamnamaData> {
  // Try direct fetch first (works on some networks)
  try {
    console.log('Attempting direct SGPC fetch...');
    const response = await fetch('https://hs.sgpc.net/', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html',
      },
    });

    if (response.ok) {
      const html = await response.text();
      if (html.length > 1000) {
        console.log('Direct fetch succeeded!');
        return parseHukamnamaHTML(html);
      }
    }
  } catch (e) {
    console.log('Direct fetch failed, trying alternative...');
  }

  // Fallback: Try with fetch and no-cors mode
  try {
    console.log('Trying fetch with simple request...');
    const response = await fetch('https://hs.sgpc.net/');
    
    if (response.ok || response.type === 'opaque') {
      const html = await response.text();
      if (html && html.length > 1000) {
        console.log('Alternative fetch succeeded!');
        return parseHukamnamaHTML(html);
      }
    }
  } catch (e) {
    console.log('Alternative fetch failed:', e);
  }

  // If both fail, throw error with helpful message
  throw new Error(
    'Unable to fetch Hukamnama. This may be due to network restrictions. ' +
    'Please check your internet connection or try again later.'
  );
}

/**
 * Parse HTML from SGPC website to extract Hukamnama data
 */
function parseHukamnamaHTML(html: string): HukamnamaData {
  // Extract date (format: 11-11-2025)
  const dateMatch = html.match(/(\d{2}-\d{2}-\d{4})/);
  const dateString = dateMatch ? dateMatch[1] : new Date().toLocaleDateString();
  
  // Convert date format
  const [day, month, year] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Extract Raag
  const raagMatch = html.match(/<h4[^>]*>([^<]*ਮਹਲਾ[^<]*)<\/h4>/);
  const raag = raagMatch ? raagMatch[1].trim() : '';

  // Extract Gurmukhi
  let gurmukhi = '';
  const gurmukhiSection = html.match(/<h4[^>]*>[^<]*ਮਹਲਾ[^<]*<\/h4>([\s\S]*?)<h4[^>]*>ਪੰਜਾਬੀ/);
  if (gurmukhiSection) {
    gurmukhi = gurmukhiSection[1]
      .replace(/<h5[^>]*>.*?<\/h5>/g, '')
      .replace(/<h6[^>]*>.*?<\/h6>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/ਮੰਗਲਵਾਰ|ਸੋਮਵਾਰ|ਬੁੱਧਵਾਰ|ਵੀਰਵਾਰ|ਸ਼ੁੱਕਰਵਾਰ|ਸ਼ਨਿੱਚਰਵਾਰ|ਐਤਵਾਰ.*/g, '')
      .trim();
  }

  // Extract Punjabi translation
  let punjabi = '';
  const punjabiSection = html.match(/ਪੰਜਾਬੀ ਵਿਆਖਿਆ<\/h4>([\s\S]*?)<h4[^>]*>English/);
  if (punjabiSection) {
    punjabi = punjabiSection[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Extract English translation
  let english = '';
  const englishSection = html.match(/English Translation<\/h4>([\s\S]*?)(Tuesday|Monday|Wednesday|Thursday|Friday|Saturday|Sunday),/);
  if (englishSection) {
    english = englishSection[1]
      .replace(/<h5[^>]*>.*?<\/h5>/g, '')
      .replace(/<h6[^>]*>.*?<\/h6>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Extract Ang
  const angMatch = html.match(/\((?:Page|ਅੰਗ):\s*(\d+)\)/i);
  const ang = angMatch ? angMatch[1] : 'N/A';

  return {
    date: formattedDate,
    gurmukhi: gurmukhi || 'Unable to extract Gurmukhi text',
    punjabi: punjabi || 'ਪੰਜਾਬੀ ਵਿਆਖਿਆ ਉਪਲਬਧ ਨਹੀਂ ਹੈ',
    english: english || 'English translation not available',
    reference: `Guru Granth Sahib Ji, Ang ${ang}`,
    ang: ang,
    raag: raag,
  };
}
