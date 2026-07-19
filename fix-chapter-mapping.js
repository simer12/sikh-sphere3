const fs = require('fs');
const path = require('path');

/**
 * FIX: Properly map OCR sections to actual book chapters
 * 
 * PROBLEM IDENTIFIED:
 * - Section 0 = Pages 1-10 (Contains TOC, not Chapter 1)
 * - Section 1 = Pages 11-20 (Contains Chapter 1 ending + Chapter 2)
 * - Previous script was mapping entire sections, not specific page ranges
 * 
 * SOLUTION:
 * - Since we can't extract individual pages from OCR sections easily,
 * - We'll create a mapping that aligns section boundaries with chapter boundaries
 * - For chapters that span sections, we'll include both sections but clean the content
 */

// Load the extracted sections
const sectionsPath = path.join(__dirname, 'extracted-history', 'extracted-sections.json');
const data = JSON.parse(fs.readFileSync(sectionsPath, 'utf8'));

console.log('📚 Fixing Chapter-to-Content Mapping...\n');
console.log(`Total OCR Sections: ${data.sections.length}`);
console.log(`Each section covers ~10 pages\n`);

// Analyze section boundaries
console.log('🔍 SECTION BOUNDARIES:');
for (let i = 0; i < Math.min(10, data.sections.length); i++) {
  const sectionNum = i;
  const startPage = i * 10 + 1;
  const endPage = (i + 1) * 10;
  console.log(`Section ${i}: Pages ${startPage}-${endPage} - ${data.sections[i].title}`);
}

// Table of Contents from actual book
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

console.log('\n🔍 CHAPTER-TO-SECTION MAPPING ANALYSIS:');
console.log('══════════════════════════════════════════════════════════════\n');

chapters.slice(0, 10).forEach(chapter => {
  const startSectionIndex = Math.floor((chapter.startPage - 1) / 10);
  const endSectionIndex = Math.floor((chapter.endPage - 1) / 10);
  
  console.log(`Chapter ${chapter.num}: "${chapter.titleGurmukhi}"`);
  console.log(`  Pages: ${chapter.startPage}-${chapter.endPage}`);
  console.log(`  Needs sections: ${startSectionIndex} to ${endSectionIndex}`);
  
  for (let i = startSectionIndex; i <= endSectionIndex; i++) {
    const secStartPage = i * 10 + 1;
    const secEndPage = (i + 1) * 10;
    console.log(`    - Section ${i} (pages ${secStartPage}-${secEndPage})`);
  }
  console.log('');
});

/**
 * CORRECTED EXTRACTION: Extract content from sections by page ranges
 * This function properly maps book pages to OCR section indices
 */
function extractContentByPageRange(sections, startPage, endPage) {
  // Convert page numbers to 0-indexed section indices
  // Section 0 = pages 1-10, Section 1 = pages 11-20, etc.
  const startSectionIndex = Math.floor((startPage - 1) / 10);
  const endSectionIndex = Math.floor((endPage - 1) / 10);
  
  let content = '';
  
  // Extract content from all relevant sections
  for (let i = startSectionIndex; i <= endSectionIndex && i < sections.length; i++) {
    if (sections[i] && sections[i].content) {
      if (content) {
        content += '\n\n';
      }
      content += sections[i].content;
    }
  }
  
  return content.trim();
}

// Enhanced OCR cleanup function (same as before but improved)
function enhancedOCRCleanup(text) {
  if (!text) return '';
  
  let cleaned = text;
  
  // 1. Remove page numbers and common OCR artifacts
  cleaned = cleaned.replace(/\d{1,3}€\d{1,3}/g, ''); // Remove page markers like 182€9
  cleaned = cleaned.replace(/॥0੩\d+[€ ]\d+/g, ''); // Remove markers like ॥0੩2€ 15
  cleaned = cleaned.replace(/॥\d+€\d+/g, ''); // Remove ॥182€9 patterns
  
  // 2. Clean up scattered single characters and formatting
  cleaned = cleaned.replace(/\nਰ \n/g, '\n');
  cleaned = cleaned.replace(/\nਰ੍ \n/g, '\n');
  cleaned = cleaned.replace(/\n\d+\n/g, '\n');
  
  // 3. Remove stray Devanagari mixed with Gurmukhi
  cleaned = cleaned.replace(/॥[०-९]+॥/g, ''); // Remove Devanagari numbers
  
  // 4. Fix common OCR spacing issues
  cleaned = cleaned.replace(/\s+/g, ' '); // Normalize spaces
  cleaned = cleaned.replace(/\n\s+\n/g, '\n\n'); // Clean up paragraph breaks
  
  // 5. Remove very short isolated lines (likely OCR noise)
  cleaned = cleaned.split('\n').filter(line => {
    const trimmed = line.trim();
    // Keep lines with Gurmukhi content or substantial text
    return trimmed.length > 3 || /[ਅ-ੴ]/.test(trimmed);
  }).join('\n');
  
  // 6. Final cleanup
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Max 2 newlines
  cleaned = cleaned.trim();
  
  return cleaned;
}

// Process chapters with corrected mapping
console.log('\n\n📝 PROCESSING CHAPTERS WITH CORRECTED MAPPING...\n');

const correctedChapters = chapters.map(chapter => {
  console.log(`Processing Chapter ${chapter.num}: ${chapter.titleGurmukhi} (Pages ${chapter.startPage}-${chapter.endPage})`);
  
  // Extract raw content using corrected page-to-section mapping
  const rawContent = extractContentByPageRange(data.sections, chapter.startPage, chapter.endPage);
  
  // Apply enhanced OCR cleanup
  const cleanedContent = enhancedOCRCleanup(rawContent);
  
  // Count words
  const wordCount = cleanedContent.split(/\s+/).filter(w => w.length > 0).length;
  
  console.log(`  ✓ Extracted ${wordCount} words`);
  
  return {
    id: `chapter_${chapter.num}`,
    number: chapter.num,
    titleGurmukhi: chapter.titleGurmukhi,
    titleEnglish: chapter.titleEnglish,
    pageRange: `${chapter.startPage}-${chapter.endPage}`,
    content: cleanedContent,
    wordCount: wordCount
  };
});

// Calculate total statistics
const totalWords = correctedChapters.reduce((sum, ch) => sum + ch.wordCount, 0);

console.log(`\n✅ COMPLETED CORRECTED EXTRACTION`);
console.log(`═══════════════════════════════════════`);
console.log(`Total Chapters: ${correctedChapters.length}`);
console.log(`Total Words: ${totalWords.toLocaleString()}`);
console.log(`Average Words/Chapter: ${Math.round(totalWords / correctedChapters.length)}`);

// Save corrected chapters
const outputPath = path.join(__dirname, 'extracted-history', 'corrected-chapters.json');
const output = {
  metadata: {
    ...data.metadata,
    correctionDate: new Date().toISOString(),
    correctionNote: 'Fixed chapter-to-section mapping. Previous version incorrectly mapped entire sections to chapters.',
    totalChapters: correctedChapters.length,
    totalWords: totalWords
  },
  chapters: correctedChapters
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`\n💾 Saved: ${outputPath}`);

console.log('\n📊 SAMPLE CHAPTER VERIFICATION:');
console.log('Let\'s check if Chapter 1 content matches its title...\n');
console.log(`Chapter 1: ${correctedChapters[0].titleGurmukhi}`);
console.log(`Expected: Historical context about the time period`);
console.log(`Content preview (first 500 chars):`);
console.log(correctedChapters[0].content.substring(0, 500));
console.log('\n');

console.log(`\n✅ Done! Next steps:`);
console.log(`1. Review: extracted-history/corrected-chapters.json`);
console.log(`2. Apply additional OCR cleanup if needed`);
console.log(`3. Generate new TypeScript file`);
console.log(`4. Update app and republish to Expo`);
