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
  // 1. Try Vercel Edge API first (CORS-friendly, cached globally at 0 DB cost)
  try {
    console.log('Attempting fetch from Edge API...');
    const isVercelHost = typeof window !== 'undefined' && window?.location?.hostname?.endsWith('vercel.app');
    const baseUrl = isVercelHost ? '/api/hukamnama' : 'https://sikh-sphere3.vercel.app/api/hukamnama';
    const endpoint = `${baseUrl}?v=${new Date().toISOString().split('T')[0]}`;

    const apiRes = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.gurmukhi && !data.error) {
        console.log('Edge API fetch succeeded!');
        return data;
      }
    }
  } catch (e: any) {
    console.log('Edge API fetch unavailable, falling back to direct SGPC fetch...', e?.message || e);
  }

  // 2. Try direct fetch from SGPC (fallback)
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

  // 3. Fallback: Try simple fetch
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

  // If all fail, throw error with helpful message
  throw new Error(
    'Unable to fetch Hukamnama. This may be due to network restrictions. ' +
    'Please check your internet connection or try again later.'
  );
}

/**
 * Parse HTML from SGPC website to extract Hukamnama data
 */
/**
 * Parse HTML from SGPC website to extract Hukamnama data
 */
function parseHukamnamaHTML(html: string): HukamnamaData {
  // Extract date (format: 11-11-2025)
  const dateMatch = html.match(/(\d{2}-\d{2}-\d{4})/);
  const dateString = dateMatch ? dateMatch[1] : null;
  let formattedDate = '';
  
  if (dateString) {
    try {
      const [day, month, year] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      formattedDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  } else {
    formattedDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  // Extract Raag (Supports any heading, div, or paragraph tag containing "ਮਹਲਾ")
  const raagMatch = html.match(/<(?:h[1-6]|div|p)[^>]*>([^<]*ਮਹਲਾ[^<]*)<\/(?:h[1-6]|div|p)>/i);
  const raag = raagMatch ? raagMatch[1].trim() : '';

  // Helper function to thoroughly clean scraped fragments
  const cleanScrapedText = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/<!--[\s\S]*?(?:-->|$)/gi, '') // Strip HTML comments
      .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, ' ') // Strip internal headers
      .replace(/<div[^>]*>.*?<\/div>/gi, ' ') // Strip internal divisions
      .replace(/<[^>]+>/g, ' ') // Strip other HTML tags
      .replace(/[\uFFFD\u007F-\u009F]/g, '') // Strip Unicode replacement (?) characters
      .replace(/&nbsp;/gi, ' ')
      .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Extract Gurmukhi
  let gurmukhi = '';
  const gurmukhiSection = html.match(/(?:ਮਹਲਾ[^<]*<\/(?:h[1-6]|div|p)>)([\s\S]*?)(?:ਪੰਜਾਬੀ|Punjabi|ਵਿਆਖਿਆ)/i);
  if (gurmukhiSection) {
    gurmukhi = cleanScrapedText(gurmukhiSection[1])
      .replace(/ਮੰਗਲਵਾਰ|ਸੋਮਵਾਰ|ਬੁੱਧਵਾਰ|ਵੀਰਵਾਰ|ਸ਼ੁੱਕਰਵਾਰ|ਸ਼ਨਿੱਚਰਵਾਰ|ਐਤਵਾਰ.*/g, '')
      .trim();
  }

  // Extract Punjabi translation
  let punjabi = '';
  const punjabiSection = html.match(/(?:ਪੰਜਾਬੀ|Punjabi)(?:[\s\S]*?<\/(?:h[1-6]|div|p)>)([\s\S]*?)(?:English)/i);
  if (punjabiSection) {
    punjabi = cleanScrapedText(punjabiSection[1]);
  }

  // Extract English translation
  let english = '';
  const englishSection = html.match(/(?:English)(?:[\s\S]*?<\/(?:h[1-6]|div|p)>)([\s\S]*?)(?:Tuesday|Monday|Wednesday|Thursday|Friday|Saturday|Sunday)/i);
  if (englishSection) {
    english = cleanScrapedText(englishSection[1]);
  }

  // Extract Ang
  const angMatch = html.match(/(?:Page|ਅੰਗ)\s*(?::|\s)\s*(\d+)/i);
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
