// Test BaniDB API response structure for Dasam Granth
const https = require('https');

async function testBaniStructure(baniId) {
  return new Promise((resolve) => {
    https.get(`https://api.banidb.com/v2/banis/${baniId}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

(async () => {
  console.log('Testing Jaap Sahib (ID: 4) structure...\n');
  
  const bani = await testBaniStructure(4);
  
  if (bani && bani.verses) {
    console.log('Bani Info:');
    console.log(JSON.stringify(bani.baniInfo, null, 2));
    console.log('\nFirst 3 verses structure:');
    console.log(JSON.stringify(bani.verses.slice(0, 3), null, 2));
  }
})();
