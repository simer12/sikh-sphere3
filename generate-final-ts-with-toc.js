const fs = require('fs');

// Load data
const cleanedData = JSON.parse(fs.readFileSync('extracted-history/cleaned-chapters.json', 'utf8'));
const tocData = JSON.parse(fs.readFileSync('extracted-history/proper-toc-structure.json', 'utf8'));

// Start building TypeScript file
let tsContent = `// Generated from Jeevan Katha Sri Guru Nanak Dev Ji EPUB
// Source: www.DiscoverSikhism.com
// OCR Extraction Date: ${new Date().toLocaleDateString()}

import { HistoryArticle } from '../types';

/**
 * Complete biography of Guru Nanak Dev Ji
 * Extracted from scanned EPUB using OCR
 * Total: 54 chapters, 412 pages, ${cleanedData.metadata.totalWords.toLocaleString()} words
 */
export const guruNanakJeevanKatha: HistoryArticle = {
  id: 'guru-nanak-dev-ji-jeevan-katha',
  title: 'Jeevan Katha Sri Guru Nanak Dev Ji',
  titleGurmukhi: 'ਜੀਵਨ ਕਥਾ ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
  subtitle: 'Complete Biography - From Birth to Joti Jot (54 Chapters)',
  author: '${cleanedData.metadata.author}',
  category: 'sikh-gurus',
  tags: [
    'guru-nanak-dev-ji',
    'sikh-history',
    'guru-biography',
    'udasis',
    'kartarpur',
    'sultanpur',
    'gurmukhi',
    'spiritual-journey',
    'sikh-gurus',
    'punjab-history'
  ],
  readingTime: ${Math.ceil(cleanedData.metadata.totalWords / 200)}, // minutes (based on 200 words/min)
  
  // Hierarchical Table of Contents (from actual book structure)
  tableOfContents: ${JSON.stringify(tocData.parts.map(part => ({
    id: part.id,
    titleGurmukhi: part.titleGurmukhi,
    titleEnglish: part.titleEnglish,
    chapters: part.chapterDetails.map(ch => ({
      id: ch.id,
      number: ch.number,
      titleGurmukhi: ch.titleGurmukhi,
      titleEnglish: ch.titleEnglish,
      pageRange: ch.pageRange
    }))
  })), null, 2)},
  
  sections: [\n`;

// Add all chapters as sections
cleanedData.chapters.forEach((chapter, index) => {
  const escapedContent = chapter.content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  
  tsContent += `    {
      id: '${chapter.id}',
      title: '${chapter.titleGurmukhi}',
      titleEnglish: '${chapter.title.replace(/'/g, "\\'")}',
      content: \`${escapedContent}\`,
      metadata: {
        chapterNumber: ${chapter.chapterNumber},
        pageRange: '${chapter.pageRange}',
        wordCount: ${chapter.wordCount}
      }
    }${index < cleanedData.chapters.length - 1 ? ',' : ''}\n`;
});

tsContent += `  ],
  
  sources: [
    {
      title: 'Jeevan Katha Sri Guru Nanak Dev Ji',
      author: '${cleanedData.metadata.author}',
      publisher: '${cleanedData.metadata.publisher}',
      url: 'https://www.DiscoverSikhism.com',
      type: 'book'
    }
  ],
  
  relatedArticles: [
    'sikh-gurus-overview',
    'guru-angad-dev-ji',
    'kartarpur-sahib',
    'udasi-tradition',
    'guru-granth-sahib'
  ]
};
`;

// Write the TypeScript file
fs.writeFileSync(
  'extracted-history/guru-nanak-jeevan-katha-with-toc.ts',
  tsContent,
  'utf8'
);

console.log('✅ Generated TypeScript file with hierarchical TOC');
console.log('\n📄 File: guru-nanak-jeevan-katha-with-toc.ts');
console.log(`   Size: ${(tsContent.length / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Chapters: ${cleanedData.chapters.length}`);
console.log(`   TOC Parts: ${tocData.parts.length}`);
console.log(`   Total Words: ${cleanedData.metadata.totalWords.toLocaleString()}`);

console.log('\n📖 TOC Structure:');
tocData.parts.forEach(part => {
  console.log(`   ✓ ${part.titleEnglish}: ${part.totalChapters} chapters, ${part.totalWords.toLocaleString()} words`);
});

console.log('\n🎯 Ready to copy to src/data/history.ts');
