const fs = require('fs');
const path = require('path');

// Load the extracted sections
const sectionsPath = path.join(__dirname, 'extracted-history', 'extracted-sections.json');
const data = JSON.parse(fs.readFileSync(sectionsPath, 'utf8'));

// Table of Contents with actual chapters from the book
const chapters = [
  { num: 1, titleGurmukhi: "ਸਮੇਂ ਦੀ ਹਾਲਤ-1", titleEnglish: "Historical Context - Part 1", startPage: 5, endPage: 14 },
  { num: 2, titleGurmukhi: "ਸਮੇਂ ਦੀ ਹਾਲਤ-2", titleEnglish: "Historical Context - Part 2", startPage: 15, endPage: 21 },
  { num: 3, titleGurmukhi: "ਜਨਮ ਤੇ ਬਾਲ-ਲੀਲਾ", titleEnglish: "Birth and Childhood", startPage: 22, endPage: 30 },
  { num: 4, titleGurmukhi: "ਆਪਣੇ ਉਸਤਾਦਾਂ ਦੇ ਉਸਤਾਦ-1", titleEnglish: "Teacher of Teachers - Part 1", startPage: 31, endPage: 36 },
  { num: 5, titleGurmukhi: "ਆਪਣੇ ਉਸਤਾਦਾਂ ਦੇ ਉਸਤਾਦ-2", titleEnglish: "Teacher of Teachers - Part 2", startPage: 37, endPage: 41 },
  { num: 6, titleGurmukhi: "ਮੱਝਾਂ ਦਾ ਵਾਗੀ", titleEnglish: "Buffalo Herding", startPage: 42, endPage: 44 },
  { num: 7, titleGurmukhi: "ਜਨੇਊ", titleEnglish: "Sacred Thread", startPage: 45, endPage: 51 },
  { num: 8, titleGurmukhi: "ਅਨੋਖੇ ਦੁਨਿਆਵੀ ਕਿੱਤੇ", titleEnglish: "Unique Worldly Activities", startPage: 52, endPage: 57 },
  { num: 9, titleGurmukhi: "ਵੈਦ ਦਾ ਰੋਗ ਦੂਰ ਕੀਤਾ", titleEnglish: "Cured the Physician's Disease", startPage: 58, endPage: 63 },
  { num: 10, titleGurmukhi: "ਖਰਾ (ਸੱਚਾ) ਸੌਦਾ", titleEnglish: "The True Bargain", startPage: 64, endPage: 72 },
  { num: 11, titleGurmukhi: "ਸੁਲਤਾਨਪੁਰ ਵਾਸ", titleEnglish: "Stay at Sultanpur", startPage: 73, endPage: 80 },
  { num: 12, titleGurmukhi: "ਰੱਬੀ ਸੱਦੜਾ", titleEnglish: "Divine Call", startPage: 81, endPage: 87 },
  { num: 13, titleGurmukhi: "ਚੜ੍ਹਿਆ ਸੋਧਣ ਧਰਤ ਲੁਕਾਈ", titleEnglish: "Rising to Purify Humanity", startPage: 88, endPage: 99 },
  { num: 14, titleGurmukhi: "ਨੀਚੋਂ ਊਚ ਕੀਤੋ ਨੇ", titleEnglish: "Raised from Low to High", startPage: 100, endPage: 110 },
  { num: 15, titleGurmukhi: "ਤਲਵੇਡੀ, ਤੁਲੰਬਾ (ਸੱਜਣ ਠੱਗ)", titleEnglish: "Talwandi, Tulamba (Sajjan the Thug)", startPage: 111, endPage: 119 },
  { num: 16, titleGurmukhi: "ਪਾਕ ਪਟਨ ਫੇਰੀ", titleEnglish: "Visit to Pak Patan", startPage: 120, endPage: 125 },
  { num: 17, titleGurmukhi: "ਪਹਿਲੀ ਉਦਾਸੀ: ਕੁਰਕਸ਼ੇਤਰ", titleEnglish: "First Udasi: Kurukshetra", startPage: 126, endPage: 133 },
  { num: 18, titleGurmukhi: "ਪਾਨੀਪਤ ਤੇ ਦਿੱਲੀ", titleEnglish: "Panipat and Delhi", startPage: 134, endPage: 141 },
  { num: 19, titleGurmukhi: "ਹਰਿਦਵਾਰ", titleEnglish: "Haridwar", startPage: 142, endPage: 148 },
  { num: 20, titleGurmukhi: "ਬਨਾਰਸ (ਪੰਡਿਤ ਚਤੁਰਦਾਸ)", titleEnglish: "Banaras (Pandit Chaturdas)", startPage: 149, endPage: 152 },
  { num: 21, titleGurmukhi: "ਗਯਾ ਠੱਗਾਂ ਦਾ ਨਿਸਤਾਰਾ", titleEnglish: "Gaya - Salvation of Thugs", startPage: 153, endPage: 156 },
  { num: 22, titleGurmukhi: "ਪਟਨੇ ਦਾ ਸਾਲਿਸ ਰਾਇ ਜੌਹਰੀ", titleEnglish: "Salis Rai Jauhari of Patna", startPage: 157, endPage: 162 },
  { num: 23, titleGurmukhi: "ਕਾਮਰੂਪ ਨੂਰਸ਼ਾਹ ਨਿਸਤਾਰਾ", titleEnglish: "Kamrup - Nurshah's Salvation", startPage: 163, endPage: 173 },
  { num: 24, titleGurmukhi: "ਪੁਰੀ ਜਗਨਨਾਥ", titleEnglish: "Puri Jagannath", startPage: 174, endPage: 180 },
  { num: 25, titleGurmukhi: "ਪੰਜਾਬ ਨੂੰ ਵਾਪਸੀ", titleEnglish: "Return to Punjab", startPage: 181, endPage: 187 },
  { num: 26, titleGurmukhi: "ਸ਼ੇਖ਼ ਬ੍ਰਹਮ ਨਾਲ ਫੇਰ ਗੋਸ਼ਟ", titleEnglish: "Again Discourse with Sheikh Brahm", startPage: 188, endPage: 194 },
  { num: 27, titleGurmukhi: "ਕੋੜ੍ਹਾ ਤਾਰਿਆ", titleEnglish: "Cured the Leper", startPage: 195, endPage: 198 },
  { num: 28, titleGurmukhi: "ਸੁਲਤਾਨਪੁਰ, ਕਿੜੀ ਪਠਾਣਾ, ਸੈਦਪੁਰ", titleEnglish: "Sultanpur, Kiri Pathana, Saidpur", startPage: 199, endPage: 201 },
  { num: 29, titleGurmukhi: "ਹਮਜ਼ਾ ਗੌਸ ਤੇ ਮੂਲਾ ਕਿਰਾੜ", titleEnglish: "Hamza Gaus and Mulla Qirad", startPage: 202, endPage: 208 },
  { num: 30, titleGurmukhi: "ਮੀਆਂ ਮਿਠੇ ਨਾਲ ਗੋਸ਼ਟ", titleEnglish: "Discourse with Mian Mithe", startPage: 209, endPage: 215 },
  { num: 31, titleGurmukhi: "ਦੁਨੀ ਚੰਦ ਤੇ ਕਰੋੜੀਆ", titleEnglish: "Duni Chand and the Crorepati", startPage: 216, endPage: 223 },
  { num: 32, titleGurmukhi: "ਕਰਤਾਰਪੁਰ", titleEnglish: "Kartarpur", startPage: 224, endPage: 228 },
  { num: 33, titleGurmukhi: "ਦੂਜੀ ਉਦਾਸੀ ਦੱਖਣ ਦੀ-1", titleEnglish: "Second Udasi (South) - Part 1", startPage: 229, endPage: 233 },
  { num: 34, titleGurmukhi: "ਜੈਨੀ ਸਾਧੂ, ਪੀਰ ਮਖ਼ਦੂਮ", titleEnglish: "Jain Sadhus and Pir Makhdum", startPage: 234, endPage: 239 },
  { num: 35, titleGurmukhi: "ਆਦਮ-ਖਾਣਾ ਕੌਡਾ", titleEnglish: "Adam Khana Kauda", startPage: 240, endPage: 242 },
  { num: 36, titleGurmukhi: "ਦੂਜੀ ਉਦਾਸੀ ਦੱਖਣ ਦੀ-2", titleEnglish: "Second Udasi (South) - Part 2", startPage: 243, endPage: 251 },
  { num: 37, titleGurmukhi: "ਦੱਖਣ ਤੋਂ ਵਾਪਸੀ", titleEnglish: "Return from South", startPage: 252, endPage: 258 },
  { num: 38, titleGurmukhi: "ਤੀਜੀ ਉਦਾਸੀ ਉੱਤਰ ਦੀ-1", titleEnglish: "Third Udasi (North) - Part 1", startPage: 259, endPage: 263 },
  { num: 39, titleGurmukhi: "ਤੀਜੀ ਉਦਾਸੀ ਉੱਤਰ ਦੀ-2", titleEnglish: "Third Udasi (North) - Part 2", startPage: 264, endPage: 271 },
  { num: 40, titleGurmukhi: "ਤੀਜੀ ਉਦਾਸੀ ਉੱਤਰ ਦੀ-3", titleEnglish: "Third Udasi (North) - Part 3", startPage: 272, endPage: 278 },
  { num: 41, titleGurmukhi: "ਚੌਥੀ ਉਦਾਸੀ ਪੱਛਮ ਦੀ-1", titleEnglish: "Fourth Udasi (West) - Part 1", startPage: 279, endPage: 286 },
  { num: 42, titleGurmukhi: "ਚੌਥੀ ਉਦਾਸੀ ਪੱਛਮ ਦੀ-2", titleEnglish: "Fourth Udasi (West) - Part 2", startPage: 287, endPage: 295 },
  { num: 43, titleGurmukhi: "ਚੌਥੀ ਉਦਾਸੀ ਪੱਛਮ ਦੀ-3", titleEnglish: "Fourth Udasi (West) - Part 3", startPage: 296, endPage: 299 },
  { num: 44, titleGurmukhi: "ਸ੍ਰੀ ਪੰਜਾ ਸਾਹਿਬ", titleEnglish: "Sri Panja Sahib", startPage: 300, endPage: 304 },
  { num: 45, titleGurmukhi: "ਬਾਬਰ ਦਾ ਹਮਲਾ", titleEnglish: "Babur's Invasion", startPage: 305, endPage: 317 },
  { num: 46, titleGurmukhi: "ਕਰਤਾਰਪੁਰ ਵਾਸ", titleEnglish: "Stay at Kartarpur", startPage: 318, endPage: 326 },
  { num: 47, titleGurmukhi: "ਕਰਤਾਰਪੁਰ ਵਿੱਚ ਇਲਾਹੀ ਦਰਬਾਰ", titleEnglish: "Divine Court at Kartarpur", startPage: 327, endPage: 332 },
  { num: 48, titleGurmukhi: "ਹੋਰ ਪ੍ਰੇਮ ਜਿੱਤਾਂ", titleEnglish: "More Victories of Love", startPage: 333, endPage: 338 },
  { num: 49, titleGurmukhi: "ਸੱਚ ਖੰਡ ਵਾਪਸੀ", titleEnglish: "Return to Sach Khand", startPage: 339, endPage: 349 },
  { num: 50, titleGurmukhi: "ਸੰਖੇਪ ਵਿਚਾਰ", titleEnglish: "Summary Reflections", startPage: 350, endPage: 358 },
  { num: 51, titleGurmukhi: "ਗੁਰੂ ਜੀ ਦੀ ਸ਼ਖ਼ਸੀਅਤ", titleEnglish: "Guru Ji's Personality", startPage: 359, endPage: 376 },
  { num: 52, titleGurmukhi: "ਗੁਰੂ ਨਾਨਕ ਜੀ ਦਾ ਥਰਮ", titleEnglish: "Guru Nanak Ji's Dharma", startPage: 377, endPage: 389 },
  { num: 53, titleGurmukhi: "ਅੰਤਕਾ-1: ਕੱਤਕ ਕਿ ਵਿਸਾਖ", titleEnglish: "Appendix 1: Kattak or Vaisakh", startPage: 390, endPage: 391 },
  { num: 54, titleGurmukhi: "ਅੰਤਕਾ-2: ਕਰਾਮਾਤਾਂ ਬਾਰੇ", titleEnglish: "Appendix 2: About Miracles", startPage: 392, endPage: 412 }
];

// Function to extract content from sections based on page range
function extractContentFromPages(sections, startPage, endPage) {
  let content = '';
  
  // Calculate which sections contain our pages
  const startSection = Math.ceil(startPage / 10) - 1; // 0-indexed
  const endSection = Math.ceil(endPage / 10) - 1;
  
  for (let i = startSection; i <= endSection && i < sections.length; i++) {
    const section = sections[i];
    const sectionStartPage = i * 10 + 1;
    const sectionEndPage = (i + 1) * 10;
    
    // If this is the only section we need
    if (startSection === endSection) {
      content += section.content;
    }
    // If this is the first section
    else if (i === startSection) {
      content += section.content;
    }
    // If this is the last section
    else if (i === endSection) {
      content += '\n\n' + section.content;
    }
    // Middle sections
    else {
      content += '\n\n' + section.content;
    }
  }
  
  return content.trim();
}

// Function to clean OCR errors
function cleanOCRErrors(text) {
  let cleaned = text;
  
  // Remove common OCR artifacts and page numbers
  cleaned = cleaned.replace(/182੯\s*\d+/g, ''); // Page numbers like "182੯ 2"
  cleaned = cleaned.replace(/॥0੩\d+[੯€]\s*\d+/g, ''); // Formatted page numbers
  cleaned = cleaned.replace(/7੩\d+[੯€]\s*\d+/g, ''); // Another page number format
  cleaned = cleaned.replace(/1826\s*\d+/g, ''); // Plain page numbers
  cleaned = cleaned.replace(/0੩2੯\s*\d+/g, ''); // More page numbers
  
  // Remove formatting artifacts at line starts
  cleaned = cleaned.replace(/^[॥।1]+\d+\([%\d]+\)॥[ਖਗ]/gm, '');
  cleaned = cleaned.replace(/^[।॥]+\s*$/gm, '');
  
  // Clean up excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Max 2 newlines
  cleaned = cleaned.replace(/ {2,}/g, ' '); // Max 1 space
  
  // Remove standalone page markers
  cleaned = cleaned.replace(/^\d+\s*$/gm, '');
  
  // Remove common artifacts
  cleaned = cleaned.replace(/[॥।]{3,}/g, '॥'); // Multiple punctuation marks
  cleaned = cleaned.replace(/ਰ੍\s+ਕਿ\s+/g, ''); // Common OCR error pattern
  
  // Clean mixed Devanagari/Gurmukhi artifacts
  cleaned = cleaned.replace(/॥॥\[.*?\]/g, '');
  
  return cleaned.trim();
}

// Create restructured sections based on actual chapters
console.log('🔄 Restructuring content based on actual chapter organization...\n');

const restructuredSections = [];
let totalWords = 0;

chapters.forEach((chapter, index) => {
  console.log(`Processing Chapter ${chapter.num}: ${chapter.titleGurmukhi} (pages ${chapter.startPage}-${chapter.endPage})`);
  
  // Extract content for this chapter
  let content = extractContentFromPages(data.sections, chapter.startPage, chapter.endPage);
  
  // Clean OCR errors
  content = cleanOCRErrors(content);
  
  // Count words
  const words = content.split(/\s+/).filter(w => w.length > 0).length;
  totalWords += words;
  
  restructuredSections.push({
    id: `chapter_${chapter.num}`,
    chapterNumber: chapter.num,
    title: chapter.titleEnglish,
    titleGurmukhi: chapter.titleGurmukhi,
    content: content,
    pageRange: `${chapter.startPage}-${chapter.endPage}`,
    wordCount: words
  });
  
  console.log(`  ✓ ${words} words extracted`);
});

console.log(`\n✅ Restructured ${chapters.length} chapters`);
console.log(`📊 Total words: ${totalWords.toLocaleString()}\n`);

// Create output object with metadata
const output = {
  metadata: {
    title: "Jeevan Katha Sri Guru Nanak Dev Ji",
    titleGurmukhi: "ਜੀਵਨ ਕਥਾ ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ",
    author: "Prof. Kartar Singh M.A.",
    publisher: "Lahore Book Shop, 2-Lajpat Rai Market, Ludhiana",
    source: "www.DiscoverSikhism.com",
    totalChapters: chapters.length,
    totalPages: 412,
    totalWords: totalWords,
    extractionMethod: "OCR (Tesseract.js with Punjabi)",
    restructuredAt: new Date().toISOString(),
    note: "Content extracted from scanned EPUB, organized by actual book chapters"
  },
  chapters: restructuredSections
};

// Save restructured JSON
const outputPath = path.join(__dirname, 'extracted-history', 'restructured-chapters.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`💾 Saved restructured data: ${outputPath}\n`);

// Generate TypeScript code for the app
const tsCode = `// Auto-generated from restructured-chapters.json
// Source: Jeevan Katha Sri Guru Nanak Dev Ji
// Publisher: www.DiscoverSikhism.com

import { HistoryArticle } from '@/types/history';

export const guruNanakJeevanKatha: HistoryArticle = {
  id: 'guru-nanak-dev-ji-jeevan-katha',
  title: 'Jeevan Katha Sri Guru Nanak Dev Ji',
  titleGurmukhi: 'ਜੀਵਨ ਕਥਾ ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
  subtitle: 'Complete Biography of Guru Nanak Dev Ji',
  subtitleGurmukhi: 'ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ ਦੀ ਪੂਰੀ ਜੀਵਨ ਕਥਾ',
  author: 'Prof. Kartar Singh M.A.',
  category: 'sikh-gurus',
  tags: ['Guru Nanak Dev Ji', 'Biography', 'Jeevan Katha', 'Gurmukhi', 'Sikh History'],
  readingTime: ${Math.ceil(totalWords / 200)},
  sections: [
${restructuredSections.map(section => `    {
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
      note: 'Complete biography in Gurmukhi, extracted via OCR from scanned EPUB'
    }
  ]
};
`;

const tsOutputPath = path.join(__dirname, 'extracted-history', 'guru-nanak-jeevan-katha.ts');
fs.writeFileSync(tsOutputPath, tsCode, 'utf8');
console.log(`💾 Saved TypeScript code: ${tsOutputPath}\n`);

// Generate summary
const summaryLines = [
  '=' .repeat(70),
  'RESTRUCTURED CHAPTER SUMMARY',
  '='.repeat(70),
  '',
  `Title: Jeevan Katha Sri Guru Nanak Dev Ji`,
  `Author: Prof. Kartar Singh M.A.`,
  `Publisher: Lahore Book Shop, Ludhiana`,
  `Source: www.DiscoverSikhism.com`,
  '',
  `Total Chapters: ${chapters.length}`,
  `Total Pages: 412`,
  `Total Words: ${totalWords.toLocaleString()}`,
  `Average Words per Chapter: ${Math.round(totalWords / chapters.length).toLocaleString()}`,
  '',
  'CHAPTER BREAKDOWN:',
  '-'.repeat(70),
  ''
];

restructuredSections.forEach(section => {
  summaryLines.push(
    `${section.chapterNumber.toString().padStart(2, ' ')}. ${section.titleGurmukhi}`,
    `    ${section.title}`,
    `    Pages ${section.pageRange} | ${section.wordCount.toLocaleString()} words`,
    ''
  );
});

summaryLines.push(
  '='.repeat(70),
  'NEXT STEPS:',
  '='.repeat(70),
  '',
  '1. Review restructured-chapters.json for accuracy',
  '2. Check chapter boundaries and content alignment',
  '3. Review cleaned OCR text for remaining errors',
  '4. Copy guru-nanak-jeevan-katha.ts to src/data/history.ts',
  '5. Add to historyArticles array',
  '6. Test in app - verify TOC displays correctly',
  '7. Verify Gurmukhi text renders properly',
  '8. Check source attribution displays',
  '',
  'FILES GENERATED:',
  '  - restructured-chapters.json (restructured data)',
  '  - guru-nanak-jeevan-katha.ts (ready for app)',
  '  - RESTRUCTURED_SUMMARY.txt (this file)',
  ''
);

const summaryPath = path.join(__dirname, 'extracted-history', 'RESTRUCTURED_SUMMARY.txt');
fs.writeFileSync(summaryPath, summaryLines.join('\n'), 'utf8');
console.log(`📝 Saved summary: ${summaryPath}\n`);

console.log('='.repeat(70));
console.log('✨ RESTRUCTURING COMPLETE!');
console.log('='.repeat(70));
console.log(`\n📂 Output files:`);
console.log(`   - restructured-chapters.json`);
console.log(`   - guru-nanak-jeevan-katha.ts`);
console.log(`   - RESTRUCTURED_SUMMARY.txt`);
console.log(`\n✅ Ready to integrate into your app!`);
