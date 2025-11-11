// Test correct Hukamnama API endpoint
const https = require('https');

console.log('Testing Hukamnama API endpoints...\n');

// Test correct BaniDB endpoint
function testAPI(url, name) {
  return new Promise((resolve, reject) => {
    console.log(`Testing ${name}...`);
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ ${name} is WORKING!`);
          console.log('Response keys:', Object.keys(json).join(', '));
          console.log('Sample:', JSON.stringify(json).substring(0, 300) + '...\n');
          resolve(json);
        } catch (e) {
          console.log(`❌ ${name} returned invalid JSON:`, data.substring(0, 100));
          reject(e);
        }
      });
    }).on('error', (e) => {
      console.error(`❌ ${name} failed:`, e.message);
      reject(e);
    });
  });
}

(async () => {
  // Try different endpoints
  const endpoints = [
    { url: 'https://api.banidb.com/hukamnama/today', name: 'BaniDB /hukamnama/today' },
    { url: 'https://api.banidb.com/v2/hukamnama', name: 'BaniDB /v2/hukamnama' },
    { url: 'https://api.gurbaninow.com/hukamnama', name: 'GurbaniNow API' },
  ];

  for (const endpoint of endpoints) {
    try {
      await testAPI(endpoint.url, endpoint.name);
      await new Promise(r => setTimeout(r, 1000)); // Wait 1 second between requests
    } catch (e) {
      // Error already logged
    }
  }
})();
