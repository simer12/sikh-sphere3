// Test script to fetch multiple Banis to identify Dasam Granth content
const https = require('https');

console.log('Testing BaniDB API to find Dasam Granth Banis...\n');

async function fetchBani(id) {
  return new Promise((resolve) => {
    https.get(`https://api.banidb.com/v2/banis/${id}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.baniInfo) {
            resolve({
              id,
              gurmukhi: json.baniInfo.unicode || 'N/A',
              english: json.baniInfo.english || 'N/A',
              verses: json.verses?.length || 0
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

(async () => {
  console.log('Fetching Banis 1-30...\n');
  console.log('ID | Gurmukhi Name | English Name | Verses');
  console.log('---|--------------|--------------|--------');
  
  for (let i = 1; i <= 30; i++) {
    const bani = await fetchBani(i);
    if (bani) {
      console.log(`${bani.id} | ${bani.gurmukhi} | ${bani.english} | ${bani.verses}`);
    }
    await new Promise(r => setTimeout(r, 200)); // Wait 200ms between requests
  }
})();
