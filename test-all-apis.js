// Test all known Hukamnama API sources
const https = require('https');
const http = require('http');

console.log('Testing ALL known Hukamnama APIs...\n');
console.log('=' .repeat(60) + '\n');

const endpoints = [
  // SikhNet APIs
  { url: 'https://api.sikhnet.com/hukamnama', name: 'SikhNet API' },
  { url: 'https://www.sikhnet.com/api/hukamnama', name: 'SikhNet API (alt)' },
  
  // GurbaniNow
  { url: 'https://api.gurbaninow.com/v2/hukamnama/today', name: 'GurbaniNow v2' },
  
  // Khalsa APIs
  { url: 'https://khalsa.io/api/hukamnama', name: 'Khalsa.io' },
  { url: 'https://api.khalsa.io/hukamnama', name: 'Khalsa.io API' },
  
  // SikhiToTheMax
  { url: 'https://api.sikhitothemax.org/hukamnama', name: 'SikhiToTheMax' },
  
  // Gurbani API
  { url: 'https://api.gurbani.org/hukamnama', name: 'Gurbani.org' },
  
  // SearchGurbani
  { url: 'https://searchgurbani.com/api/hukamnama', name: 'SearchGurbani' },
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    console.log(`\n📡 Testing: ${endpoint.name}`);
    console.log(`   URL: ${endpoint.url}`);
    
    const protocol = endpoint.url.startsWith('https') ? https : http;
    
    const request = protocol.get(endpoint.url, {
      headers: {
        'User-Agent': 'SikhSphere/1.0',
        'Accept': 'application/json',
      },
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log(`   ✅ WORKING! (Status: ${res.statusCode})`);
            console.log(`   Keys: ${Object.keys(json).join(', ')}`);
            console.log(`   Sample: ${JSON.stringify(json).substring(0, 150)}...`);
            resolve({ success: true, url: endpoint.url, name: endpoint.name });
          } catch (e) {
            console.log(`   ⚠️ Response OK but not JSON (Status: ${res.statusCode})`);
            console.log(`   Content: ${data.substring(0, 100)}...`);
            resolve({ success: false });
          }
        } else {
          console.log(`   ❌ Failed (Status: ${res.statusCode})`);
          resolve({ success: false });
        }
      });
    });
    
    request.on('error', (e) => {
      console.log(`   ❌ Connection failed: ${e.message}`);
      resolve({ success: false });
    });
    
    request.on('timeout', () => {
      console.log(`   ❌ Request timeout`);
      request.destroy();
      resolve({ success: false });
    });
  });
}

(async () => {
  const workingAPIs = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    if (result.success) {
      workingAPIs.push(result);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SUMMARY:');
  console.log('='.repeat(60));
  
  if (workingAPIs.length > 0) {
    console.log(`\n✅ Found ${workingAPIs.length} working API(s):\n`);
    workingAPIs.forEach((api, i) => {
      console.log(`${i + 1}. ${api.name}`);
      console.log(`   ${api.url}\n`);
    });
  } else {
    console.log('\n❌ No working APIs found!');
    console.log('You may need to scrape directly from SGPC website or create your own backend.\n');
  }
})();
