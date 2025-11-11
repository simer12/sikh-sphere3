// Test modern Hukamnama APIs
const https = require('https');

console.log('Testing modern Hukamnama APIs...\n');

// Test SikhiToTheMax API
function testBaniDBAPI() {
  return new Promise((resolve, reject) => {
    https.get('https://api.banidb.com/v2/hukamnama/today', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('✅ BaniDB API (api.banidb.com) is WORKING!');
          console.log('Sample data:', JSON.stringify(json).substring(0, 200) + '...\n');
          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Test GurbaniNow API
function testGurbaniNowAPI() {
  return new Promise((resolve, reject) => {
    https.get('https://www.gurbaninow.com/api/hukamnama', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('✅ GurbaniNow API is WORKING!');
          console.log('Sample data:', JSON.stringify(json).substring(0, 200) + '...\n');
          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Run tests
(async () => {
  try {
    await testBaniDBAPI();
  } catch (e) {
    console.error('❌ BaniDB API failed:', e.message);
  }
  
  try {
    await testGurbaniNowAPI();
  } catch (e) {
    console.error('❌ GurbaniNow API failed:', e.message);
  }
})();
