/**
 * Fetch complete Dasam Granth content from ShabadOS Database
 * This script extracts all Dasam Granth compositions from @shabados/database
 * and saves them as JSON files for use in the SikhSphere app
 */

const Database = require('@shabados/database');
const fs = require('fs');
const path = require('path');

// Initialize the database
const baniDB = new Database({
  // Use default settings - will download/use the latest database
});

// Output directory for JSON files
const OUTPUT_DIR = path.join(__dirname, 'src', 'data', 'dasamGranthContent');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Map of Dasam Granth composition names to search for
 * Based on the Wikipedia list of all 18 sections
 */
const DASAM_COMPOSITIONS = [
  // Already have from BaniDB
  { search: 'Jaap Sahib', filename: 'jaap-sahib.json' },
  { search: 'Akal Ustat', filename: 'akal-ustat.json' },
  { search: 'Tav Prasad Savaiye', filename: 'tav-prasad-savaiye.json' },
  { search: 'Chaupai', filename: 'chaupai-sahib.json' },
  { search: 'Shabad Hazare', filename: 'shabad-hazare.json' },
  { search: 'Chandi Charitar', filename: 'chandi-charitar.json' },
  { search: 'Chandi Di Var', filename: 'chandi-di-var.json' },
  { search: 'Shastar Naam Mala', filename: 'shastar-naam-mala.json' },
  
  // Missing compositions we need to find
  { search: 'Bachittar Natak', filename: 'bachittar-natak.json' },
  { search: 'Gyan Prabodh', filename: 'gyan-prabodh.json' },
  { search: 'Chaubis Avtar', filename: 'chaubis-avtar.json' },
  { search: 'Brahma Avtar', filename: 'brahma-avtar.json' },
  { search: 'Rudra Avtar', filename: 'rudra-avtar.json' },
  { search: 'Khalsa Mahima', filename: 'khalsa-mahima.json' },
  { search: 'Charitropakhyan', filename: 'charitropakhyan.json' },
  { search: 'Zafarnama', filename: 'zafarnama.json' },
  { search: 'Hikayat', filename: 'hikayats.json' },
  { search: 'Ugardanti', filename: 'ugardanti.json' },
];

/**
 * Fetch a composition and save to JSON
 */
async function fetchComposition(compositionInfo) {
  try {
    console.log(`\nSearching for: ${compositionInfo.search}...`);
    
    // Query the database for this composition
    // The exact query syntax depends on @shabados/database API
    // This is a template - adjust based on actual API
    const results = await baniDB.query({
      source: 'Dasam Granth',
      composition: compositionInfo.search,
    });

    if (!results || results.length === 0) {
      console.log(`  ❌ Not found: ${compositionInfo.search}`);
      return null;
    }

    console.log(`  ✅ Found ${results.length} verses`);

    // Transform to our app's format
    const verses = results.map((verse, index) => ({
      id: verse.id || index + 1,
      gurmukhi: verse.gurmukhi || verse.unicode || '',
      transliteration: verse.transliteration?.english || '',
      translation: verse.translation?.english || '',
      lineNumber: verse.lineNumber || index + 1,
      pageNumber: verse.pageNumber || null,
    }));

    const output = {
      id: compositionInfo.filename.replace('.json', ''),
      name: compositionInfo.search,
      nameGurmukhi: results[0]?.compositionGurmukhi || compositionInfo.search,
      source: 'ShabadOS Database',
      verses: verses,
      totalVerses: verses.length,
      fetchedAt: new Date().toISOString(),
    };

    // Save to file
    const filePath = path.join(OUTPUT_DIR, compositionInfo.filename);
    fs.writeFileSync(filePath, JSON.stringify(output, null, 2), 'utf8');
    console.log(`  💾 Saved to: ${compositionInfo.filename}`);

    return output;

  } catch (error) {
    console.error(`  ⚠️  Error fetching ${compositionInfo.search}:`, error.message);
    return null;
  }
}

/**
 * Main function to fetch all Dasam Granth content
 */
async function fetchAllDasamGranth() {
  console.log('🔍 Starting Dasam Granth extraction from ShabadOS Database...\n');
  console.log('=' .repeat(60));

  try {
    // Initialize database connection
    await baniDB.connect();
    console.log('✅ Connected to ShabadOS Database\n');

    const results = [];
    let totalVerses = 0;

    // Fetch each composition
    for (const comp of DASAM_COMPOSITIONS) {
      const result = await fetchComposition(comp);
      if (result) {
        results.push(result);
        totalVerses += result.totalVerses;
      }
      
      // Small delay to avoid overwhelming the DB
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY:');
    console.log(`   Total compositions found: ${results.length}/${DASAM_COMPOSITIONS.length}`);
    console.log(`   Total verses extracted: ${totalVerses}`);
    console.log(`   Output directory: ${OUTPUT_DIR}`);

    // Create index file
    const index = results.map(r => ({
      id: r.id,
      name: r.name,
      nameGurmukhi: r.nameGurmukhi,
      filename: `${r.id}.json`,
      verseCount: r.totalVerses,
    }));

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'shabados-index.json'),
      JSON.stringify(index, null, 2),
      'utf8'
    );

    console.log('\n✅ Extraction complete!');
    console.log('📝 Index saved to: shabados-index.json\n');

    // List missing compositions
    const missing = DASAM_COMPOSITIONS.filter(
      comp => !results.find(r => r.name === comp.search)
    );
    
    if (missing.length > 0) {
      console.log('⚠️  Missing compositions (not found in database):');
      missing.forEach(m => console.log(`   - ${m.search}`));
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
  } finally {
    await baniDB.disconnect();
  }
}

// Run the extraction
fetchAllDasamGranth()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
