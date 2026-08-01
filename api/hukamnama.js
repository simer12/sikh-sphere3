// Simple backend API to fetch Hukamnama
// Deploy this to Vercel, Netlify, or any Node.js hosting

const https = require('https');

module.exports = async (req, res) => {
  // Enable CORS & Vercel Global Edge Caching (1 Minute CDN cache to prevent stale text)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const html = await fetchSGPC();
    const hukamnama = parseHukamnama(html);
    res.status(200).json(hukamnama);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

function fetchSGPC() {
  return new Promise((resolve, reject) => {
    https.get('https://hs.sgpc.net/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    }, (res) => {
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => resolve(html));
    }).on('error', reject);
  });
}

function parseHukamnama(html) {
  const dateMatch = html.match(/(\d{2}-\d{2}-\d{4})/);
  const dateString = dateMatch ? dateMatch[1] : null;
  let formattedDate = '';
  
  if (dateString) {
    try {
      const [day, month, year] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
    } catch (e) {
      formattedDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
    }
  } else {
    formattedDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  }

  const cleanScrapedText = (text) => {
    if (!text) return '';
    return text
      .replace(/<!--[\s\S]*?(?:-->|$)/gi, '') // Strip HTML comments
      .replace(/<[^>]+>/g, ' ') // Strip HTML tags
      .replace(/[\uFFFD\u007F-\u009F]/g, '') // Strip Unicode replacement (?) characters
      .replace(/&nbsp;/gi, ' ')
      .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  let raag = '';
  let gurmukhi = '';
  let punjabi = '';
  let english = '';

  // 1. Try card-based extraction first (highly reliable based on SGPC grid container layout)
  const gurmukhiCard = html.match(/<div class="hukamnama-card(?:\s+[^"]*)?"[^>]*>([\s\S]*?)<\/div>/i);
  const explanationCards = html.match(/<div class="hukamnama-card2(?:\s+[^"]*)?"[^>]*>([\s\S]*?)<\/div>/gi) || [];

  if (gurmukhiCard) {
    const rawGurmukhi = gurmukhiCard[1];
    const titleMatch = rawGurmukhi.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
    raag = titleMatch ? cleanScrapedText(titleMatch[1]) : '';
    
    gurmukhi = cleanScrapedText(rawGurmukhi)
      .replace(/ਸ਼ਨਿਚਰਵਾਰ|ਸੋਮਵਾਰ|ਮੰਗਲਵਾਰ|ਬੁੱਧਵਾਰ|ਵੀਰਵਾਰ|ਸ਼ੁੱਕਰਵਾਰ|ਐਤਵਾਰ.*/gi, '')
      .trim();
  }

  explanationCards.forEach((cardHtml) => {
    if (cardHtml.includes('ਪੰਜਾਬੀ ਵਿਆਖਿਆ') || cardHtml.includes('ਪੰਜਾਬੀ')) {
      punjabi = cleanScrapedText(cardHtml.replace(/<h[1-6][^>]*>ਪੰਜਾਬੀ ਵਿਆਖਿਆ<\/h[1-6]>/gi, ''));
    } else if (cardHtml.includes('English Translation') || cardHtml.includes('English')) {
      english = cleanScrapedText(cardHtml.replace(/<h[1-6][^>]*>English Translation<\/h[1-6]>/gi, ''));
    }
  });

  // 2. Legacy markers fallback
  if (!gurmukhi) {
    const raagFallback = html.match(/<(?:h[1-6]|div|p)[^>]*>([^<]*ਮਹਲਾ[^<]*)<\/(?:h[1-6]|div|p)>/i);
    raag = raagFallback ? raagFallback[1].trim() : '';

    const gurmukhiFallback = html.match(/(?:ਮਹਲਾ[^<]*<\/(?:h[1-6]|div|p)>)([\s\S]*?)(?:ਪੰਜਾਬੀ|Punjabi|ਵਿਆਖਿਆ)/i);
    if (gurmukhiFallback) {
      gurmukhi = cleanScrapedText(gurmukhiFallback[1])
        .replace(/ਮੰਗਲਵਾਰ|ਸੋਮਵਾਰ|ਬੁੱਧਵਾਰ|ਵੀਰਵਾਰ|ਸ਼ੁੱਕਰਵਾਰ|ਸ਼ਨਿੱਚਰਵਾਰ|ਐਤਵਾਰ.*/g, '')
        .trim();
    }
  }

  if (!punjabi) {
    const punjabiFallback = html.match(/(?:ਪੰਜਾਬੀ|Punjabi)(?:[\s\S]*?<\/(?:h[1-6]|div|p)>)([\s\S]*?)(?:English)/i);
    if (punjabiFallback) {
      punjabi = cleanScrapedText(punjabiFallback[1]);
    }
  }

  if (!english) {
    const englishFallback = html.match(/(?:English)(?:[\s\S]*?<\/(?:h[1-6]|div|p)>)([\s\S]*?)(?:Tuesday|Monday|Wednesday|Thursday|Friday|Saturday|Sunday)/i);
    if (englishFallback) {
      english = cleanScrapedText(englishFallback[1]);
    }
  }

  if (english.startsWith('English Translation')) {
    english = english.replace(/^English Translation\s*/i, '').trim();
  }

  const angMatch = html.match(/(?:Page|ਅੰਗ)\s*(?::|\s)\s*(\d+)/i);
  const ang = angMatch ? angMatch[1] : 'N/A';

  return {
    date: formattedDate,
    gurmukhi: gurmukhi || 'Unable to extract Gurmukhi text',
    punjabi: punjabi || 'ਪੰਜਾਬੀ ਵਿਆਖਿਆ ਉਪਲਬਧ ਨਹੀਂ ਹੈ',
    english: english || 'English translation not available',
    reference: `Guru Granth Sahib Ji, Ang ${ang}`,
    ang: ang,
    raag: raag || 'Bhagat Bani',
  };
}
