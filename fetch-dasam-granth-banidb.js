// Fetch all available Dasam Granth Banis from BaniDB API
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://api.banidb.com/v2';

// Known Dasam Granth Bani IDs from BaniDB
// Based on earlier testing and BaniDB documentation
const DASAM_GRANTH_BANIS = [
  { id: 4, name: 'Jaap Sahib', nameGurmukhi: 'ਜਾਪੁ ਸਾਹਿਬ' },
  { id: 28, name: 'Akal Ustat', nameGurmukhi: 'ਅਕਾਲ ਉਸਤਤ' },
  { id: 5, name: 'Tav Prasad Savaiye', nameGurmukhi: 'ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ' },
  { id: 6, name: 'Chaupai Sahib', nameGurmukhi: 'ਚੌਪਈ ਸਾਹਿਬ' },
  { id: 3, name: 'Shabd Hazare', nameGurmukhi: 'ਸ਼ਬਦ ਹਜ਼ਾਰੇ' },
  { id: 12, name: 'Ath Chandi Charitar', nameGurmukhi: 'ਅਠ ਚੰਡੀ ਚਰਿਤ੍ਰ' },
  { id: 13, name: 'Chandi Di Vaar', nameGurmukhi: 'ਚੰਡੀ ਦੀ ਵਾਰ' },
  { id: 19, name: 'Shastar Naam Mala', nameGurmukhi: 'ਸ਼ਸਤਰ ਨਾਮ ਮਾਲਾ' },
];

async function fetchAllBanis() {
  console.log('Using known Dasam Granth Bani IDs from BaniDB...\n');
  return DASAM_GRANTH_BANIS;
}

async function fetchBaniDetail(baniId) {
  try {
    const response = await fetch(`${API_BASE}/banis/${baniId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching Bani ${baniId}:`, error);
    return null;
  }
}

async function downloadAllDasamGranthContent() {
  console.log('\n=== Starting Full Content Download ===\n');
  
  const banis = await fetchAllBanis();
  
  // Create output directory
  const outputDir = './src/data/dasamGranthContent';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log(`\nDownloading full content for ${banis.length} Banis...\n`);
  
  const downloadedBanis = [];
  
  for (const bani of banis) {
    console.log(`Downloading: ${bani.name} (ID: ${bani.id})...`);
    
    const detail = await fetchBaniDetail(bani.id);
    
    if (detail && detail.verses) {
      // Transform to our format
      const baniData = {
        id: bani.id,
        name: bani.name,
        nameGurmukhi: bani.nameGurmukhi,
        description: `${bani.name} from Sri Dasam Granth Sahib`,
        verses: detail.verses.map((verse, index) => ({
          id: verse.verse?.verseId?.toString() || `${bani.id}-${index + 1}`,
          gurmukhi: verse.verse?.verse?.unicode || verse.verse?.verse?.gurmukhi || '',
          transliteration: verse.verse?.transliteration?.english || verse.verse?.transliteration?.en || '',
          translation: verse.verse?.translation?.en?.bdb || '',
          lineNumber: index + 1,
        })),
        totalVerses: detail.verses.length,
      };
      
      // Save to JSON file
      const filename = path.join(outputDir, `${bani.id}.json`);
      fs.writeFileSync(filename, JSON.stringify(baniData, null, 2));
      
      downloadedBanis.push({
        id: bani.id,
        name: bani.name,
        nameGurmukhi: bani.nameGurmukhi,
        verses: baniData.totalVerses,
      });
      
      console.log(`  ✅ Saved ${baniData.totalVerses} verses\n`);
    } else {
      console.log(`  ❌ Failed to fetch content\n`);
    }
    
    // Small delay to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Create index file
  const indexData = {
    banis: downloadedBanis,
    totalBanis: downloadedBanis.length,
    totalVerses: downloadedBanis.reduce((sum, b) => sum + b.verses, 0),
    lastUpdated: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'index.json'),
    JSON.stringify(indexData, null, 2)
  );
  
  console.log('\n✅ Download Complete!');
  console.log(`Total Banis: ${downloadedBanis.length}`);
  console.log(`Total Verses: ${indexData.totalVerses}`);
}

// Run the script
downloadAllDasamGranthContent().catch(console.error);
