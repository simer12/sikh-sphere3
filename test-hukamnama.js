// Test script to check if hukamnama-json API still works
const hukamnama = require('hukamnama-json');

console.log('Testing hukamnama-json API...\n');

hukamnama.default()
  .then(({ ang, content, gurbani, punjabi, english, date }) => {
    console.log('✅ API is working!\n');
    console.log('Date:', date);
    console.log('Ang:', ang);
    console.log('\nGurbani (first 100 chars):', gurbani?.substring(0, 100) + '...');
    console.log('\nPunjabi (first 100 chars):', punjabi?.substring(0, 100) + '...');
    console.log('\nEnglish (first 100 chars):', english?.substring(0, 100) + '...');
    console.log('\n✅ The API is still working and returning data!');
  })
  .catch(error => {
    console.error('❌ API failed:', error.message);
    console.error('\nThe API might not be working anymore.');
  });
