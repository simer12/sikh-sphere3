const fs = require('fs');

console.log('Loading cleaned chapters...');
const cleanedData = JSON.parse(fs.readFileSync('extracted-history/final-cleaned-chapters.json', 'utf8'));

// Function to remove TOC listing from chapter content
function removeTOCListing(content) {
    if (!content) return '';
    
    // The TOC appears as numbered list at the beginning
    // Pattern: "1. Chapter Title 5\n2. Chapter Title 15\n" etc.
    // We need to find where actual content starts
    
    // Look for the pattern of consecutive numbered lines
    const lines = content.split('\n');
    let tocEndIndex = 0;
    let consecutiveTOCLines = 0;
    
    for (let i = 0; i < Math.min(lines.length, 100); i++) {
        const line = lines[i].trim();
        
        // Check if line matches TOC pattern: number. text number
        if (/^\d+\.\s+[ਅ-ੌ\s\-–—()\[\]]+\d+\s*$/.test(line)) {
            consecutiveTOCLines++;
            tocEndIndex = i + 1;
        } else if (line.length > 30 && consecutiveTOCLines > 0) {
            // Found substantial content after TOC
            break;
        } else if (line.length < 10) {
            // Empty or very short line, continue
            continue;
        }
    }
    
    // If we found more than 10 TOC lines, remove them
    if (consecutiveTOCLines > 10) {
        console.log(`  Found TOC listing: ${consecutiveTOCLines} entries, removing first ${tocEndIndex} lines`);
        return lines.slice(tocEndIndex).join('\n').trim();
    }
    
    return content;
}

// Function to remove book title/metadata from start
function removeBookMetadata(content) {
    if (!content) return '';
    
    let cleaned = content;
    
    // Remove common book metadata patterns that appear at chapter starts
    const metadataPatterns = [
        /ਜੀਵਨ ਕਥਾ[\s\S]{0,50}ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ/g,
        /ਲਾਹੌਰ ਬੁੱਕ ਸ਼ਾਪ/g,
        /ਪਰੋ\.\s*ਕਰਤਾਰਸਿੰਘ[\s\S]{0,30}/g,
        /ਲਾਜਪਤ ਰਾਏ ਮਾਰਕਿਟ/g,
        /ਲੁਧਿਆਣਾ/g
    ];
    
    metadataPatterns.forEach(pattern => {
        cleaned = cleaned.replace(pattern, '');
    });
    
    return cleaned;
}

// Function to remove garbage characters at the very start
function removeLeadingGarbage(content, maxChars = 800) {
    if (!content) return '';
    
    // Check first maxChars for heavy OCR noise
    const start = content.substring(0, maxChars);
    const gurmkhiChars = (start.match(/[ਅ-ੌ]/g) || []).length;
    const garbageChars = (start.match(/[੍॥।|_\-\.]+/g) || []).length;
    
    // If first section has more than 30% garbage, try to find first clean paragraph
    if (garbageChars > gurmkhiChars * 0.3) {
        console.log(`  High garbage density at start (${garbageChars} garbage vs ${gurmkhiChars} Gurmukhi)`);
        
        // Find first paragraph with substantial Gurmukhi content
        const paragraphs = content.split(/\n\n+/);
        for (let i = 0; i < Math.min(paragraphs.length, 10); i++) {
            const para = paragraphs[i];
            const paraGurmukhi = (para.match(/[ਅ-ੌ]/g) || []).length;
            
            if (paraGurmukhi > 50) {
                console.log(`  Starting from paragraph ${i + 1} (skipping ${paragraphs.slice(0, i).join('').length} chars of garbage)`);
                return paragraphs.slice(i).join('\n\n');
            }
        }
    }
    
    return content;
}

console.log('\nRemoving TOC listings and metadata from chapters...\n');

const finalChapters = cleanedData.chapters.map((chapter, index) => {
    console.log(`Chapter ${chapter.number}: ${chapter.titleGurmukhi}`);
    
    let content = chapter.content;
    
    // Step 1: Remove TOC listing
    content = removeTOCListing(content);
    
    // Step 2: Remove book metadata
    content = removeBookMetadata(content);
    
    // Step 3: Remove leading garbage
    content = removeLeadingGarbage(content);
    
    // Step 4: Final trim and normalize whitespace
    content = content.trim();
    content = content.replace(/\n\s*\n\s*\n+/g, '\n\n');
    
    // Recount words
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    const beforeCount = chapter.wordCount;
    const removed = beforeCount - wordCount;
    
    if (removed > 0) {
        const percentRemoved = ((removed / beforeCount) * 100).toFixed(1);
        console.log(`  Removed TOC/metadata: ${beforeCount} → ${wordCount} words (-${removed}, -${percentRemoved}%)`);
    }
    
    return {
        ...chapter,
        content: content,
        wordCount: wordCount
    };
});

// Calculate final totals
const totalWords = finalChapters.reduce((sum, ch) => sum + ch.wordCount, 0);
const originalWords = cleanedData.metadata.totalWords;
const wordsRemoved = originalWords - totalWords;
const percentRemoved = ((wordsRemoved / originalWords) * 100).toFixed(1);

console.log(`\n${'='.repeat(60)}`);
console.log('FINAL CLEANUP SUMMARY');
console.log(`${'='.repeat(60)}`);
console.log(`Before TOC removal: ${originalWords.toLocaleString()} words`);
console.log(`After TOC removal: ${totalWords.toLocaleString()} words`);
console.log(`Total removed: ${wordsRemoved.toLocaleString()} words (${percentRemoved}%)`);
console.log(`Final average: ${Math.round(totalWords / finalChapters.length).toLocaleString()} words/chapter`);

// Show clean samples
console.log(`\n${'='.repeat(60)}`);
console.log('FINAL SAMPLE: Chapter 1 (first 600 chars)');
console.log(`${'='.repeat(60)}`);
console.log(finalChapters[0].content.substring(0, 600));

console.log(`\n${'='.repeat(60)}`);
console.log('FINAL SAMPLE: Chapter 3 - ਜਨਮ ਤੇ ਬਾਲ-ਲੀਲਾ (first 600 chars)');
console.log(`${'='.repeat(60)}`);
console.log(finalChapters[2].content.substring(0, 600));

console.log(`\n${'='.repeat(60)}`);
console.log('FINAL SAMPLE: Chapter 7 - ਜਨੇਊ (first 600 chars)');
console.log(`${'='.repeat(60)}`);
console.log(finalChapters[6].content.substring(0, 600));

// Create final output
const finalOutput = {
    metadata: {
        ...cleanedData.metadata,
        finalCleanupDate: new Date().toISOString(),
        finalCleanupNote: "Removed TOC listings, book metadata, and leading garbage from chapter starts",
        totalWords: totalWords,
        wordsRemovedInFinalCleanup: wordsRemoved
    },
    chapters: finalChapters
};

// Save final version
const outputPath = 'extracted-history/final-cleaned-chapters.json';
fs.writeFileSync(outputPath, JSON.stringify(finalOutput, null, 2), 'utf8');

console.log(`\n✅ Updated final-cleaned-chapters.json`);
console.log(`   Total size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
console.log(`\n✅ Ready to generate TypeScript file for app!`);
