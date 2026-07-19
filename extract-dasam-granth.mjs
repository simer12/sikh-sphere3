// Extract Dasam Granth content from Shabados Database and save as JSON
import createDatabaseClient from '@shabados/database';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('Starting Dasam Granth extraction...\n');

// Map of Dasam Granth Banis we want to extract
const dasamGranthBanis = [
  { id: 'JS', name: 'Jaap Sahib', nameGurmukhi: 'ਜਾਪੁ ਸਾਹਿਬ' },
  { id: 'AU', name: 'Akal Ustat', nameGurmukhi: 'ਅਕਾਲ ਉਸਤਤਿ' },
  { id: 'BN', name: 'Bachitar Natak', nameGurmukhi: 'ਬਚਿੱਤ੍ਰ ਨਾਟਕ' },
  { id: 'CCUB', name: 'Chandi Charitar Ukati Bilas', nameGurmukhi: 'ਚੰਡੀ ਚਰਿਤ੍ਰ ਉਕਤਿ ਬਿਲਾਸ' },
  { id: 'CC', name: 'Chandi Charitar', nameGurmukhi: 'ਚੰਡੀ ਚਰਿਤ੍ਰ' },
  { id: 'VSBK', name: 'Var Sri Bhagauti Ji Ki', nameGurmukhi: 'ਵਾਰ ਸ੍ਰੀ ਭਗਉਤੀ ਜੀ ਕੀ' },
  { id: 'GP', name: 'Gyan Prabodh', nameGurmukhi: 'ਗਿਆਨ ਪ੍ਰਬੋਧ' },
  { id: 'ZN', name: 'Zafarnama', nameGurmukhi: 'ਜ਼ਫ਼ਰਨਾਮਾ' },
  { id: 'SH', name: 'Shabd Hazare', nameGurmukhi: 'ਸ਼ਬਦ ਹਜ਼ਾਰੇ' },
];

const outputDir = './src/data/dasamGranthContent';

async function extractBani(baniInfo) {
  try {
    console.log(`Extracting ${baniInfo.name}...`);
    
    const db = createDatabaseClient();

    const bani = await db.query.banis.findFirst({
      where: (banis, { eq }) => eq(banis.id, baniInfo.id),
      with: {
        lines: {
          orderBy: (baniLines, { asc }) => [
            asc(baniLines.sectionOrder),
            asc(baniLines.lineOrder),
          ],
          with: {
            line: {
              with: {
                assetContent: {
                  orderBy: (assetLines, { asc }) => asc(assetLines.priority),
                },
              },
            },
          },
        },
      },
    });

    if (!bani) {
      console.log(`  ❌ Bani not found: ${baniInfo.id}`);
      return null;
    }

    // Transform to simple JSON structure
    const verses = bani.lines.map((baniLine, index) => {
      const line = baniLine.line;
      const primaryContent = line.assetContent.find(ac => ac.type === 'primary');
      const transliteration = line.assetContent.find(ac => ac.type === 'transliteration');
      const translation = line.assetContent.find(ac => ac.type === 'translation');
      
      return {
        id: line.id,
        gurmukhi: primaryContent?.data || '',
        transliteration: transliteration?.data || '',
        translation: translation?.data || '',
        lineNumber: index + 1,
      };
    });

    const baniData = {
      id: bani.id,
      name: baniInfo.name,
      nameGurmukhi: baniInfo.nameGurmukhi,
      verses,
      totalVerses: verses.length,
    };

    // Save to JSON file
    const filename = join(outputDir, `${baniInfo.id}.json`);
    writeFileSync(filename, JSON.stringify(baniData, null, 2));
    
    console.log(`  ✅ Saved ${verses.length} verses to ${filename}\n`);
    return baniData;

  } catch (error) {
    console.error(`  ❌ Error extracting ${baniInfo.name}:`, error.message);
    return null;
  }
}

async function extractAll() {
  try {
    // Create output directory
    mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory: ${outputDir}\n`);

    // Extract each Bani
    const results = [];
    for (const baniInfo of dasamGranthBanis) {
      const result = await extractBani(baniInfo);
      if (result) {
        results.push({
          id: result.id,
          name: result.name,
          nameGurmukhi: result.nameGurmukhi,
          verses: result.totalVerses,
        });
      }
    }

    // Create index file with all banis
    const indexData = {
      banis: results,
      totalBanis: results.length,
      totalVerses: results.reduce((sum, b) => sum + b.verses, 0),
    };

    writeFileSync(
      join(outputDir, 'index.json'),
      JSON.stringify(indexData, null, 2)
    );

    console.log('\n✅ Extraction complete!');
    console.log(`Total Banis: ${results.length}`);
    console.log(`Total Verses: ${indexData.totalVerses}`);

  } catch (error) {
    console.error('\n❌ Extraction failed:', error);
    throw error;
  }
}

extractAll().catch(console.error);
