
'const fs = require('fs');

console.log('Loading final cleaned chapters and TOC structure...');
const chaptersData = JSON.parse(fs.readFileSync('extracted-history/final-cleaned-chapters.json', 'utf8'));
const tocData = JSON.parse(fs.readFileSync('extracted-history/proper-toc-structure.json', 'utf8'));

console.log(`\nGenerating TypeScript file from ${chaptersData.chapters.length} chapters...`);

// Build hierarchical TOC structure from the existing proper-toc-structure.json
const buildTOCStructure = () => {
    return tocData.parts.map(part => ({
        id: part.id,
        title: part.titleGurmukhi,
        titleEnglish: part.titleEnglish,
        chapters: part.chapterDetails.map(ch => ({
            id: ch.id,
            title: ch.titleGurmukhi,
            titleEnglish: ch.titleEnglish,
            pageRange: ch.pageRange
        }))
    }));
};

const tocStructure = buildTOCStructure();

// Generate TypeScript content
let tsContent = `/**
 * Guru Nanak Dev Ji - Jeevan Katha
 * Complete biography of Sri Guru Nanak Dev Ji
 * 
 * Source: Jeevan Katha Sri Guru Nanak Dev Ji
 * Author: Prof. Kartar Singh M.A.
 * Publisher: Lahore Book Shop
 * 
 * Extracted via OCR from EPUB (412 pages)
 * Total Chapters: 54
 * Organized in: 12 Parts
 * 
 * Extraction Info:
 * - OCR Engine: Tesseract.js with Punjabi language support
 * - Extraction Date: ${chaptersData.metadata.extractedAt}
 * - Correction Date: ${chaptersData.metadata.correctionDate}
 * - Cleanup Date: ${chaptersData.metadata.tocRemovalDate}
 * - Total Words: ${chaptersData.metadata.totalWords.toLocaleString()}
 * 
 * NOTE: This content has been properly mapped to match the book's actual structure.
 * Each chapter contains content from the correct page ranges as listed in the book's TOC.
 */

import { HistoryArticle } from './history';

`;

// Create the main article object
tsContent += `export const guruNanakJeevanKatha: HistoryArticle = {
  id: 'guru-nanak-jeevan-katha',
  title: 'ਜੀਵਨ ਕਥਾ ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
  titleEnglish: 'Life Story of Sri Guru Nanak Dev Ji',
  author: 'Prof. Kartar Singh M.A.',
  publisher: 'Lahore Book Shop',
  category: 'sikh_history',
  language: 'gurmukhi',
  description: 'ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ ਦੀ ਸੰਪੂਰਨ ਜੀਵਨ ਕਥਾ - ਜਨਮ ਤੋਂ ਲੈ ਕੇ ਜੋਤੀ ਜੋਤਿ ਸਮਾਉਣ ਤੱਕ ਦੇ ਸਾਰੇ ਪ੍ਰਸੰਗ',
  tableOfContents: ${JSON.stringify(tocStructure, null, 2).replace(/"([^"]+)":/g, '$1:')},
  chapters: [\n`;

// Add all chapters
chaptersData.chapters.forEach((chapter, index) => {
    // Escape content for TypeScript string
    const escapedContent = chapter.content
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$');
    
    tsContent += `    {
      id: '${chapter.id}',
      number: ${chapter.number},
      title: \`${chapter.titleGurmukhi}\`,
      titleEnglish: \`${chapter.titleEnglish}\`,
      pageRange: '${chapter.pageRange}',
      content: \`${escapedContent}\`,
      wordCount: ${chapter.wordCount}
    }${index < chaptersData.chapters.length - 1 ? ',' : ''}
`;
});

tsContent += `  ]
};\n`;

// Write the TypeScript file
const outputPath = 'guru-nanak-jeevan-katha-FINAL.ts';
fs.writeFileSync(outputPath, tsContent, 'utf8');

const fileSizeMB = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);

console.log(`\n${'='.repeat(70)}`);
console.log('✅ GENERATED TYPESCRIPT FILE');
console.log(`${'='.repeat(70)}`);
console.log(`File: ${outputPath}`);
console.log(`Size: ${fileSizeMB} MB`);
console.log(`Chapters: ${chaptersData.chapters.length}`);
console.log(`Total Words: ${chaptersData.metadata.totalWords.toLocaleString()}`);
console.log(`Average: ${Math.round(chaptersData.metadata.totalWords / chaptersData.chapters.length)} words/chapter`);

console.log(`\n${'='.repeat(70)}`);
console.log('NEXT STEPS:');
console.log(`${'='.repeat(70)}`);
console.log(`1. Copy to app: cp ${outputPath} src/data/guruNanakJeevanKatha.ts`);
console.log(`2. Verify structure in app`);
console.log(`3. Publish update: eas update --branch main --message "Fixed content alignment"`);
console.log(`\nContent is now properly aligned with TOC structure!`);
