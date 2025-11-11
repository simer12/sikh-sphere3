// Simple backend API to fetch Hukamnama
// Deploy this to Vercel, Netlify, or any Node.js hosting

const https = require('https');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');

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
  const dateString = dateMatch ? dateMatch[1] : new Date().toLocaleDateString();
  const [day, month, year] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const raagMatch = html.match(/<h4[^>]*>([^<]*ਮਹਲਾ[^<]*)<\/h4>/);
  const raag = raagMatch ? raagMatch[1].trim() : '';

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

  let punjabi = '';
  const punjabiSection = html.match(/ਪੰਜਾਬੀ ਵਿਆਖਿਆ<\/h4>([\s\S]*?)<h4[^>]*>English/);
  if (punjabiSection) {
    punjabi = punjabiSection[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

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
