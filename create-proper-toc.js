const fs = require('fs');

// Load cleaned chapters
const cleanedData = JSON.parse(fs.readFileSync('extracted-history/cleaned-chapters.json', 'utf8'));

// Define the hierarchical TOC structure based on the actual book
const tableOfContents = [
  {
    id: 'part-1-historical-context',
    titleGurmukhi: 'ਸਮੇਂ ਦੀ ਹਾਲਤ',
    titleEnglish: 'Historical Context',
    chapters: [1, 2],
    subsections: []
  },
  {
    id: 'part-2-early-life',
    titleGurmukhi: 'ਸ਼ੁਰੂਆਤੀ ਜੀਵਨ',
    titleEnglish: 'Early Life',
    chapters: [3, 4, 5, 6, 7, 8, 9, 10],
    subsections: []
  },
  {
    id: 'part-3-sultanpur',
    titleGurmukhi: 'ਸੁਲਤਾਨਪੁਰ ਕਾਲ',
    titleEnglish: 'Sultanpur Period',
    chapters: [11, 12],
    subsections: []
  },
  {
    id: 'part-4-first-udasi',
    titleGurmukhi: 'ਪਹਿਲੀ ਉਦਾਸੀ - ਪੂਰਬ',
    titleEnglish: 'First Udasi (Eastern Journey)',
    chapters: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    subsections: []
  },
  {
    id: 'part-5-return-punjab',
    titleGurmukhi: 'ਪੰਜਾਬ ਵਾਪਸੀ',
    titleEnglish: 'Return to Punjab',
    chapters: [25, 26, 27, 28, 29, 30, 31, 32],
    subsections: []
  },
  {
    id: 'part-6-second-udasi',
    titleGurmukhi: 'ਦੂਜੀ ਉਦਾਸੀ - ਦੱਖਣ',
    titleEnglish: 'Second Udasi (Southern Journey)',
    chapters: [33, 34, 35, 36, 37],
    subsections: []
  },
  {
    id: 'part-7-third-udasi',
    titleGurmukhi: 'ਤੀਜੀ ਉਦਾਸੀ - ਉੱਤਰ',
    titleEnglish: 'Third Udasi (Northern Journey)',
    chapters: [38, 39, 40],
    subsections: []
  },
  {
    id: 'part-8-fourth-udasi',
    titleGurmukhi: 'ਚੌਥੀ ਉਦਾਸੀ - ਪੱਛਮ',
    titleEnglish: 'Fourth Udasi (Western Journey)',
    chapters: [41, 42, 43, 44],
    subsections: []
  },
  {
    id: 'part-9-babur',
    titleGurmukhi: 'ਬਾਬਰ ਦਾ ਹਮਲਾ',
    titleEnglish: "Babur's Invasion",
    chapters: [45],
    subsections: []
  },
  {
    id: 'part-10-kartarpur',
    titleGurmukhi: 'ਕਰਤਾਰਪੁਰ ਅਵਸਥਾ',
    titleEnglish: 'Kartarpur Period',
    chapters: [46, 47, 48, 49],
    subsections: []
  },
  {
    id: 'part-11-legacy',
    titleGurmukhi: 'ਵਿਰਾਸਤ ਤੇ ਸਿੱਖਿਆਵਾਂ',
    titleEnglish: 'Legacy and Teachings',
    chapters: [50, 51, 52],
    subsections: []
  },
  {
    id: 'part-12-appendices',
    titleGurmukhi: 'ਅੰਤਕਾ',
    titleEnglish: 'Appendices',
    chapters: [53, 54],
    subsections: []
  }
];

// Create detailed TOC with all chapter information
const detailedTOC = tableOfContents.map(part => {
  const partChapters = part.chapters.map(chNum => {
    const chapter = cleanedData.chapters.find(ch => ch.chapterNumber === chNum);
    return {
      id: chapter.id,
      number: chapter.chapterNumber,
      titleGurmukhi: chapter.titleGurmukhi,
      titleEnglish: chapter.title,
      pageRange: chapter.pageRange,
      wordCount: chapter.wordCount
    };
  });

  return {
    ...part,
    chapterDetails: partChapters,
    totalChapters: part.chapters.length,
    totalWords: partChapters.reduce((sum, ch) => sum + ch.wordCount, 0)
  };
});

// Generate the TOC for TypeScript export
const tocForTS = {
  metadata: {
    title: 'Jeevan Katha Sri Guru Nanak Dev Ji',
    titleGurmukhi: 'ਜੀਵਨ ਕਥਾ ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
    totalParts: tableOfContents.length,
    totalChapters: 54,
    totalPages: 412,
    totalWords: cleanedData.metadata.totalWords
  },
  parts: detailedTOC
};

// Save the TOC
fs.writeFileSync(
  'extracted-history/proper-toc-structure.json',
  JSON.stringify(tocForTS, null, 2),
  'utf8'
);

console.log('✅ Created hierarchical TOC structure');
console.log(`\n📊 TOC Summary:`);
console.log(`   Parts: ${tocForTS.metadata.totalParts}`);
console.log(`   Chapters: ${tocForTS.metadata.totalChapters}`);
console.log(`   Pages: ${tocForTS.metadata.totalPages}`);
console.log(`   Words: ${tocForTS.metadata.totalWords.toLocaleString()}`);

console.log(`\n📖 Part Breakdown:`);
tocForTS.parts.forEach(part => {
  console.log(`\n${part.titleEnglish} (${part.titleGurmukhi})`);
  console.log(`   Chapters: ${part.totalChapters} | Words: ${part.totalWords.toLocaleString()}`);
  part.chapterDetails.forEach(ch => {
    console.log(`   ${ch.number}. ${ch.titleGurmukhi} (pages ${ch.pageRange})`);
  });
});

console.log(`\n✨ Saved to: extracted-history/proper-toc-structure.json`);
