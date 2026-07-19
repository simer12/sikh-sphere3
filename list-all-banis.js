// List all Banis from BaniDB API
const API_BASE = 'https://api.banidb.com/v2';

async function listAllBanis() {
  console.log('Fetching all Banis from BaniDB API...\n');
  
  try {
    const response = await fetch(`${API_BASE}/banis`);
    const banis = await response.json();
    
    console.log(`Found ${banis.length} total Banis\n`);
    console.log('ID | Gurmukhi | English');
    console.log('---|----------|--------');
    
    banis.forEach(bani => {
      console.log(`${bani.id} | ${bani.gurmukhi || bani.unicode || 'N/A'} | ${bani.english || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('Error fetching Banis:', error);
  }
}

listAllBanis().catch(console.error);
