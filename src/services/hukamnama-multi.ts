/**
 * Hukamnama Service with Multiple Sources
 * Tries multiple APIs/sources to fetch daily Hukamnama
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
 * Fetch from SikhNet API (if available)
 */
async function fetchFromSikhNet(): Promise<HukamnamaData | null> {
  try {
    console.log('Trying SikhNet API...');
    const response = await fetch('https://api.sikhnet.com/hukamnama', {
      headers: { 'Accept': 'application/json' },
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        date: new Date().toLocaleDateString('en-US', { 
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        }),
        gurmukhi: data.gurmukhi || data.hukam?.gurmukhi || '',
        punjabi: data.punjabi || data.translation?.punjabi || '',
        english: data.english || data.translation?.english || data.hukam?.english || '',
        reference: `Guru Granth Sahib Ji, Ang ${data.ang || data.page || 'N/A'}`,
        ang: data.ang || data.page || 'N/A',
        raag: data.raag || '',
      };
    }
  } catch (e) {
    console.log('SikhNet failed:', e);
  }
  return null;
}

/**
 * Fetch from SGPC using a CORS proxy
 */
async function fetchFromSGPCViaProxy(): Promise<HukamnamaData | null> {
  try {
    console.log('Trying SGPC via proxy...');
    // Use a CORS proxy to bypass browser restrictions
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const targetUrl = encodeURIComponent('https://hs.sgpc.net/');
    
    const response = await fetch(proxyUrl + targetUrl);
    
    if (response.ok) {
      const html = await response.text();
      return parseHukamnamaHTML(html);
    }
  } catch (e) {
    console.log('SGPC proxy failed:', e);
  }
  return null;
}

/**
 * Fetch directly from SGPC (may fail due to CORS)
 */
async function fetchFromSGPCDirect(): Promise<HukamnamaData | null> {
  try {
    console.log('Trying SGPC direct...');
    const response = await fetch('https://hs.sgpc.net/', {
      headers: { 'Accept': 'text/html' },
    });
    
    if (response.ok) {
      const html = await response.text();
      if (html.length > 100) {
        return parseHukamnamaHTML(html);
      }
    }
  } catch (e) {
    console.log('SGPC direct failed:', e);
  }
  return null;
}

/**
 * Main fetch function with fallbacks
 */
export async function fetchHukamnama(): Promise<HukamnamaData> {
  console.log('Starting Hukamnama fetch with multiple sources...');
  
  // Try sources in order of preference
  const sources = [
    fetchFromSGPCDirect,
    fetchFromSGPCViaProxy,
    fetchFromSikhNet,
  ];
  
  for (const source of sources) {
    try {
      const result = await source();
      if (result && result.gurmukhi && result.gurmukhi.length > 10) {
        console.log('Successfully fetched from source');
        return result;
      }
    } catch (e) {
      console.log('Source failed, trying next...');
    }
  }
  
  // If all sources fail, throw error
  throw new Error('Unable to fetch Hukamnama from any source. Please check your internet connection.');
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
