const fs = require('fs');
const path = require('path');

// Load restructured chapters
const inputPath = path.join(__dirname, 'extracted-history', 'restructured-chapters.json');
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

console.log('🧹 Enhanced OCR Error Correction');
console.log('='.repeat(70));
console.log('');

// Enhanced OCR error patterns for Gurmukhi text
function enhancedCleanup(text) {
  let cleaned = text;
  
  // 1. Remove page number patterns
  const pagePatterns = [
    /182੯\s*\d+/g,
    /॥0੩\d+[੯€]\s*\d+/g,
    /7੩\d+[੯€]\s*\d+/g,
    /1826\s*\d+/g,
    /0੩2੯\s*\d+/g,
    /॥੩\d+[੯€]\s*\d+/g,
    /\d{3,4}੯\s*\d+/g
  ];
  
  pagePatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // 2. Remove formatting artifacts and random character sequences
  cleaned = cleaned.replace(/[॥।1]+\d+\([%\d]+\)॥[ਖਗਘ]/g, '');
  cleaned = cleaned.replace(/ਜਲਿ ਪਰ ਦਾ ਕਿ,\s*\.\.\s*1 ਹਾ\s*\.\.\s*ਹਦ ਤੋ/g, '');
  cleaned = cleaned.replace(/ਰ੍\s*ਕਿ\s*$/gm, '');
  cleaned = cleaned.replace(/^[ਰਤਪਹਭਟਜਸਨ]੍\s*[।॥ਟਗ'੍‌]?\s*$/gm, '');
  
  // 3. Clean up publisher/copyright info that appears multiple times
  cleaned = cleaned.replace(/ਲਾਹੌਰ ਬੁੱਕ ਸ਼ਾਪ\s*2-ਲਾਜਪਤ ਰਾਏ ਮਾਰਕਿਟ, ਲੁਧਿਆਣਾ/g, '');
  cleaned = cleaned.replace(/ਪ੍ਰੋ\.\s*ਕਰਤਾਰਸਿੰਘਐੱਮ\.\s*ਏਈ[""]?/g, '');
  cleaned = cleaned.replace(/੬510\.\s*1940/g, '');
  
  // 4. Remove TOC section markers that leaked into content
  cleaned = cleaned.replace(/^ਸਚੀ\s*$/gm, '');
  cleaned = cleaned.replace(/^ਅੰਤਕਾ\s*\d+\s*$/gm, '');
  
  // 5. Fix common Devanagari/Gurmukhi mixing
  cleaned = cleaned.replace(/॥/g, '।');  // Devanagari danda to Gurmukhi
  cleaned = cleaned.replace(/ः/g, '');    // Remove Devanagari visarga
  
  // 6. Remove standalone numbers
  cleaned = cleaned.replace(/^\d+\s*$/gm, '');
  
  // 7. Clean up excessive punctuation
  cleaned = cleaned.replace(/[।॥]{3,}/g, '॥');
  cleaned = cleaned.replace(/\.{3,}/g, '...');
  
  // 8. Remove common artifacts at line starts
  cleaned = cleaned.replace(/^[\s।॥]+/gm, '');
  
  // 9. Fix spacing issues
  cleaned = cleaned.replace(/\s+([।॥,;.!?])/g, '$1');  // Remove space before punctuation
  cleaned = cleaned.replace(/([।॥])\s*\n/g, '$1\n');   // Clean line endings
  cleaned = cleaned.replace(/ {2,}/g, ' ');             // Multiple spaces to single
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');         // Max 2 newlines
  
  // 10. Remove partial/broken lines at start
  const lines = cleaned.split('\n');
  let startIdx = 0;
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    // Skip lines that are just fragments or artifacts
    if (line.length < 5 || 
        /^[ਰਤਪਹਭਟਜਸਨਕਗਲਮ]੍?[\s।॥]*$/.test(line) ||
        /^[\s।॥\d]+$/.test(line)) {
      startIdx = i + 1;
    } else {
      break;
    }
  }
  
  if (startIdx > 0) {
    cleaned = lines.slice(startIdx).join('\n');
  }
  
  // 11. Clean up footnote markers (keep simple ones)
  cleaned = cleaned.replace(/\d+\.\s*[""].*?[""]?\s*$/gm, '');
  
  // 12. Remove isolated consonant modifiers
  cleaned = cleaned.replace(/\s*੍[‌ਹ੍ਰਯਵ]?\s+/g, ' ');
  
  // 13. Final cleanup
  cleaned = cleaned.trim();
  cleaned = cleaned.replace(/^\n+/, '');
  cleaned = cleaned.replace(/\n+$/, '');
  
  return cleaned;
}

// Process all chapters
let totalCleaned = 0;
let totalOriginal = 0;

data.chapters.forEach((chapter, index) => {
  const originalLength = chapter.content.length;
  const originalWords = chapter.wordCount;
  
  // Apply enhanced cleanup
  chapter.content = enhancedCleanup(chapter.content);
  
  // Recalculate word count
  const newWords = chapter.content.split(/\s+/).filter(w => w.length > 0).length;
  chapter.wordCount = newWords;
  
  const reduction = originalLength - chapter.content.length;
  totalCleaned += reduction;
  totalOriginal += originalLength;
  
  console.log(`✓ Chapter ${chapter.chapterNumber}: ${chapter.titleGurmukhi}`);
  console.log(`  Cleaned ${reduction} chars | ${originalWords} → ${newWords} words`);
});

console.log('');
console.log('='.repeat(70));
console.log(`✅ Cleaned ${totalCleaned.toLocaleString()} characters (${((totalCleaned/totalOriginal)*100).toFixed(1)}% reduction)`);
console.log(`📊 Total words after cleanup: ${data.chapters.reduce((sum, ch) => sum + ch.wordCount, 0).toLocaleString()}`);
console.log('='.repeat(70));
console.log('');

// Update metadata
data.metadata.totalWords = data.chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
data.metadata.cleanedAt = new Date().toISOString();
data.metadata.cleanupNote = "Enhanced OCR error correction applied";

// Save cleaned version
const cleanedPath = path.join(__dirname, 'extracted-history', 'cleaned-chapters.json');
fs.writeFileSync(cleanedPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`💾 Saved cleaned data: ${cleanedPath}`);

// Regenerate TypeScript with cleaned content
const tsCode = `// Auto-generated from cleaned-chapters.json
// Source: Jeevan Katha Sri Guru Nanak Dev Ji
// Author: Prof. Kartar Singh M.A.
// Publisher: Lahore Book Shop, Ludhiana
// Website: www.DiscoverSikhism.com
// OCR extracted and cleaned: ${new Date().toLocaleDateString()}

import { HistoryArticle } from '@/types/history';

export const guruNanakJeevanKatha: HistoryArticle = {
  id: 'guru-nanak-dev-ji-jeevan-katha',
  title: 'Jeevan Katha Sri Guru Nanak Dev Ji',
  titleGurmukhi: 'ਜੀਵਨ ਕਥਾ ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
  subtitle: 'Complete Biography - From Birth to Joti Jot',
  subtitleGurmukhi: 'ਸੰਪੂਰਣ ਜੀਵਨੀ - ਜਨਮ ਤੋਂ ਜੋਤੀ ਜੋਤਿ',
  author: 'Prof. Kartar Singh M.A.',
  category: 'sikh-gurus',
  tags: ['Guru Nanak Dev Ji', 'Biography', 'Jeevan Katha', 'Gurmukhi', 'Sikh History', 'Four Udasis'],
  readingTime: ${Math.ceil(data.metadata.totalWords / 200)},
  sections: [
${data.chapters.map(section => `    {
      id: '${section.id}',
      title: '${section.title.replace(/'/g, "\\'")}',
      titleGurmukhi: '${section.titleGurmukhi}',
      content: \`${section.content.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
    }`).join(',\n')}
  ],
  sources: [
    {
      type: 'book',
      title: 'Jeevan Katha Sri Guru Nanak Dev Ji',
      titleGurmukhi: 'ਜੀਵਨ ਕਥਾ ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
      author: 'Prof. Kartar Singh M.A.',
      publisher: 'Lahore Book Shop, Ludhiana',
      url: 'https://www.DiscoverSikhism.com',
      note: 'Complete 412-page biography in Gurmukhi, extracted via OCR and restructured by actual chapters'
    }
  ],
  relatedArticles: [
    'guru-nanak-dev-ji-life',
    'guru-nanak-teachings',
    'four-udasis'
  ]
};
`;

const tsCleanedPath = path.join(__dirname, 'extracted-history', 'guru-nanak-jeevan-katha-cleaned.ts');
fs.writeFileSync(tsCleanedPath, tsCode, 'utf8');
console.log(`💾 Saved cleaned TypeScript: ${tsCleanedPath}`);

// Generate final summary
const summaryLines = [
  '='.repeat(70),
  'FINAL CLEANED CHAPTER SUMMARY',
  '='.repeat(70),
  '',
  `Title: Jeevan Katha Sri Guru Nanak Dev Ji`,
  `Title (Gurmukhi): ਜੀਵਨ ਕਥਾ ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ`,
  `Author: Prof. Kartar Singh M.A.`,
  `Publisher: Lahore Book Shop, Ludhiana`,
  `Source: www.DiscoverSikhism.com`,
  '',
  `Total Chapters: ${data.metadata.totalChapters}`,
  `Total Pages: 412`,
  `Total Words: ${data.metadata.totalWords.toLocaleString()}`,
  `Average Words/Chapter: ${Math.round(data.metadata.totalWords / data.metadata.totalChapters).toLocaleString()}`,
  `Characters Cleaned: ${totalCleaned.toLocaleString()}`,
  `Cleanup Rate: ${((totalCleaned/totalOriginal)*100).toFixed(1)}%`,
  '',
  'CHAPTER ORGANIZATION:',
  '-'.repeat(70),
  '',
  '📖 PART 1: HISTORICAL CONTEXT',
  '   Ch 1-2: Historical context of the era',
  '',
  '👶 PART 2: EARLY LIFE (Birth to Youth)',
  '   Ch 3-10: Birth, childhood, education, sacred thread, true bargain',
  '',
  '🕌 PART 3: SULTANPUR PERIOD',
  '   Ch 11-12: Sultanpur stay, divine call',
  '',
  '🚶 PART 4: FIRST UDASI (Eastern Journey)',
  '   Ch 13-24: Kurukshetra, Delhi, Haridwar, Banaras, Gaya, Patna, Kamrup, Puri',
  '',
  '🏠 PART 5: RETURN TO PUNJAB',
  '   Ch 25-32: Return, discourses, Kartarpur',
  '',
  '🧭 PART 6: SECOND UDASI (Southern Journey)',
  '   Ch 33-37: South India travels',
  '',
  '⛰️  PART 7: THIRD UDASI (Northern Journey)',
  '   Ch 38-40: Northern travels',
  '',
  '🌅 PART 8: FOURTH UDASI (Western Journey)',
  '   Ch 41-44: Western travels, Panja Sahib',
  '',
  '⚔️  PART 9: BABUR\'S INVASION',
  '   Ch 45: Babur\'s invasion period',
  '',
  '🏡 PART 10: KARTARPUR PERIOD',
  '   Ch 46-49: Final years at Kartarpur, Joti Jot',
  '',
  '📚 PART 11: LEGACY & TEACHINGS',
  '   Ch 50-52: Reflections, personality, dharma',
  '',
  '📎 APPENDICES',
  '   Ch 53-54: Birth date discussion, miracles',
  '',
  '='.repeat(70),
  'OCR CORRECTIONS APPLIED:',
  '='.repeat(70),
  '',
  '✓ Removed page numbers (182੯, 1826, etc.)',
  '✓ Cleaned formatting artifacts',
  '✓ Removed duplicate publisher info',
  '✓ Fixed Devanagari/Gurmukhi mixing',
  '✓ Normalized spacing and line breaks',
  '✓ Removed standalone punctuation',
  '✓ Cleaned footnote markers',
  '✓ Removed broken character sequences',
  '',
  '⚠️  REMAINING CONSIDERATIONS:',
  '',
  '- Some diacritical marks may need manual verification',
  '- Proper names may have OCR variations',
  '- Technical terms should be cross-referenced',
  '- Chapter transitions may need paragraph formatting',
  '',
  '='.repeat(70),
  'INTEGRATION READY FILES:',
  '='.repeat(70),
  '',
  '📄 cleaned-chapters.json',
  '   - 54 chapters with cleaned Gurmukhi text',
  '   - Proper chapter titles and metadata',
  '   - Word counts and page ranges',
  '',
  '📄 guru-nanak-jeevan-katha-cleaned.ts',
  '   - TypeScript export ready for src/data/history.ts',
  '   - All 54 chapters with cleaned content',
  '   - Proper source attribution',
  '   - Related articles links',
  '',
  '='.repeat(70),
  'NEXT STEPS FOR INTEGRATION:',
  '='.repeat(70),
  '',
  '1. Copy content from guru-nanak-jeevan-katha-cleaned.ts',
  '2. Add to src/data/history.ts historyArticles array',
  '3. Verify TypeScript compilation',
  '4. Test TOC navigation in app',
  '5. Verify Gurmukhi font rendering',
  '6. Test search functionality with Gurmukhi text',
  '7. Add to category filters',
  '8. Create related article links',
  '',
  'SUGGESTED APP ENHANCEMENTS:',
  '',
  '- Add "Gurmukhi/English" toggle for titles',
  '- Add chapter bookmarking feature',
  '- Add text size adjustment for Gurmukhi',
  '- Add sharing feature for individual chapters',
  '- Add notes/highlights capability',
  '',
  '='.repeat(70),
  `Generated: ${new Date().toLocaleString()}`,
  '='.repeat(70)
];

const summaryPath = path.join(__dirname, 'extracted-history', 'FINAL_SUMMARY.txt');
fs.writeFileSync(summaryPath, summaryLines.join('\n'), 'utf8');
console.log(`📝 Saved final summary: ${summaryPath}\n`);

console.log('='.repeat(70));
console.log('✨ ENHANCED CLEANUP COMPLETE!');
console.log('='.repeat(70));
console.log('');
console.log('📂 Generated files:');
console.log('   ✓ cleaned-chapters.json');
console.log('   ✓ guru-nanak-jeevan-katha-cleaned.ts');
console.log('   ✓ FINAL_SUMMARY.txt');
console.log('');
console.log('🎉 Ready for app integration!');
console.log('');
