// Test the actual SGPC scraping logic
const https = require('https');

console.log('Testing SGPC Hukamnama fetch...\n');

function fetchHukamnama() {
  return new Promise((resolve, reject) => {
    https.get('https://hs.sgpc.net/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    }, (res) => {
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => {
        console.log('✅ Fetched HTML from SGPC');
        console.log('Status:', res.statusCode);
        console.log('HTML length:', html.length, 'characters\n');
        
        // Try to parse the data
        try {
          const parsed = parseHukamnama(html);
          console.log('✅ Parsed Hukamnama:\n');
          console.log('Date:', parsed.date);
          console.log('Raag:', parsed.raag);
          console.log('Ang:', parsed.ang);
          console.log('Gurmukhi (first 100 chars):', parsed.gurmukhi.substring(0, 100) + '...');
          console.log('English (first 100 chars):', parsed.english.substring(0, 100) + '...');
          console.log('Punjabi (first 100 chars):', parsed.punjabi.substring(0, 100) + '...');
          resolve(parsed);
        } catch (e) {
          console.error('❌ Parsing failed:', e.message);
          // Save HTML for debugging
          const fs = require('fs');
          fs.writeFileSync('sgpc-debug.html', html);
          console.log('\n📄 Saved HTML to sgpc-debug.html for inspection');
          reject(e);
        }
      });
    }).on('error', (e) => {
      console.error('❌ Request failed:', e.message);
      reject(e);
    });
  });
}

function parseHukamnama(html) {
  // Extract date
  const dateMatch = html.match(/(\d{2}-\d{2}-\d{4})/);
  const dateString = dateMatch ? dateMatch[1] : new Date().toLocaleDateString();
  const [day, month, year] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  // Extract Raag
  const raagMatch = html.match(/<h4[^>]*>([^<]*ਮਹਲਾ[^<]*)<\/h4>/);
  const raag = raagMatch ? raagMatch[1].trim() : '';

  // Extract Gurmukhi - look for content between raag and date
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
    gurmukhi: gurmukhi || 'Unable to extract Gurmukhi',
    punjabi: punjabi || 'Unable to extract Punjabi',
    english: english || 'Unable to extract English',
    reference: `Guru Granth Sahib Ji, Ang ${ang}`,
    ang: ang,
    raag: raag,
  };
}

fetchHukamnama()
  .then(() => console.log('\n✅ Test completed successfully!'))
  .catch(() => console.log('\n❌ Test failed!'));
