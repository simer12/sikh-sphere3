const fs = require('fs');

console.log('Loading final-cleaned-chapters.json...');
const data = JSON.parse(fs.readFileSync('extracted-history/final-cleaned-chapters.json', 'utf8'));

// For Chapter 1 specifically, remove the TOC garbage (first 1268 chars)
console.log('\nCleaning Chapter 1 - removing TOC/garbage from start...');
const ch1 = data.chapters[0];
const ch1Before = ch1.content;
const ch1After = ch1.content.substring(1268).trim(); // Start from where actual content begins
const ch1WordsBefore = ch1.wordCount;
const ch1WordsAfter = ch1After.split(/\s+/).filter(w => w.length > 0).length;

console.log(`Chapter 1: Removed ${ch1Before.substring(0, 1268).length} chars of TOC/garbage`);
console.log(`  Before: ${ch1WordsBefore} words`);
console.log(`  After: ${ch1WordsAfter} words`);
console.log(`  Removed: ${ch1WordsBefore - ch1WordsAfter} words`);

// Update Chapter 1
data.chapters[0] = {
    ...ch1,
    content: ch1After,
    wordCount: ch1WordsAfter
};

// Recalculate totals
const totalWords = data.chapters.reduce((sum, ch) => sum + ch.wordCount, 0);

console.log(`\nNew total word count: ${totalWords.toLocaleString()}`);
console.log(`Average per chapter: ${Math.round(totalWords / data.chapters.length).toLocaleString()}`);

// Show clean Chapter 1 start
console.log(`\n${'='.repeat(70)}`);
console.log('CLEANED Chapter 1 - First 800 characters:');
console.log(`${'='.repeat(70)}`);
console.log(ch1After.substring(0, 800));

// Update metadata
data.metadata.totalWords = totalWords;
data.metadata.tocRemovalDate = new Date().toISOString();
data.metadata.tocRemovalNote = "Removed complete TOC listing (1268 chars) from Chapter 1 start. Content now begins with actual historical context.";

// Save
fs.writeFileSync('extracted-history/final-cleaned-chapters.json', JSON.stringify(data, null, 2), 'utf8');

console.log(`\n✅ Updated final-cleaned-chapters.json`);
console.log(`✅ Ready to generate TypeScript file!`);
