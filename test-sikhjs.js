// Test SikhJS Hukamnama API
const https = require('https');

console.log('Testing SikhJS Hukamnama API...\n');

const endpoints = [
  'https://api.sikhjs.com/hukamnama/today',
  'https://api.sikhjs.com/v1/hukamnama/today',
  'https://api.sikhjs.com/v2/hukamnama/today',
  'https://api.sikhjs.com/hukamnama',
];

async function testEndpoint(url) {
  return new Promise((resolve) => {
    console.log(`Testing: ${url}`);
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ SUCCESS! Status: ${res.statusCode}`);
          console.log('Response keys:', Object.keys(json).join(', '));
          console.log('Sample data:', JSON.stringify(json).substring(0, 400) + '...\n');
          resolve({ success: true, data: json });
        } catch (e) {
          console.log(`⚠️ Response (Status ${res.statusCode}):`, data.substring(0, 200));
          console.log('');
          resolve({ success: false, error: 'Invalid JSON' });
        }
      });
    }).on('error', (e) => {
      console.error(`❌ Request failed:`, e.message);
      console.log('');
      resolve({ success: false, error: e.message });
    });
  });
}

(async () => {
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    await new Promise(r => setTimeout(r, 500)); // Wait between requests
  }
})();
