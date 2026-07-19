const fs = require('fs');

console.log('Loading corrected chapters...');
const correctedData = JSON.parse(fs.readFileSync('extracted-history/corrected-chapters.json', 'utf8'));

// Enhanced OCR cleanup function
function enhancedOCRCleanup(text) {
    if (!text) return '';
    
    let cleaned = text;
    
    // Step 1: Remove page number patterns (they appear at start/end of sections)
    // Patterns: 182€9, 7੧2੯, ॥0੨2€, etc.
    cleaned = cleaned.replace(/[0-9੦-੯०-९]+[€₹]?[0-9੦-੯०-९]+/g, '');
    cleaned = cleaned.replace(/॥+[0-9੦-੯०-९€₹]+/g, '');
    cleaned = cleaned.replace(/[0-9]+€[0-9]+/g, '');
    
    // Step 2: Remove scattered single characters at line boundaries
    // Pattern: standalone punctuation, numbers, mixed scripts
    cleaned = cleaned.replace(/\s+[੍੍॥।॥|][.\s]/g, ' ');
    cleaned = cleaned.replace(/\s+[0-9]\s+/g, ' ');
    cleaned = cleaned.replace(/\s+[०-९]\s+/g, ' ');
    
    // Step 3: Remove TOC-style page references (Chapter Title ... Page#)
    // Pattern: "ਸਮੇਂ ਦੀ ਹਾਲਤ-1 5"
    cleaned = cleaned.replace(/([ਅ-ੌ\s]+[-–—]\d+)\s+\d+\s*/g, '');
    
    // Step 4: Remove book metadata patterns
    cleaned = cleaned.replace(/ਜੀਵਨ ਕਥਾ\s*ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ/g, '');
    cleaned = cleaned.replace(/ਲਾਹੌਰ ਬੁੱਕ ਸ਼ਾਪ/g, '');
    cleaned = cleaned.replace(/ਪਰੋ\.\s*ਕਰਤਾਰਸਿੰਘ\s*ਐੱਮ\.\s*ਏਈ/g, '');
    cleaned = cleaned.replace(/ਲਾਜਪਤ ਰਾਏ ਮਾਰਕਿਟ,?\s*ਲੁਧਿਆਣਾ/g, '');
    
    // Step 5: Remove "ਸਚੀ" (content index marker)
    cleaned = cleaned.replace(/\bਸਚੀ\b\s*/g, '');
    
    // Step 6: Remove English mixed in (like "www.DiscoverSikhism.com")
    cleaned = cleaned.replace(/www\.[a-zA-Z0-9.]+/g, '');
    cleaned = cleaned.replace(/[a-zA-Z]{10,}/g, ''); // Long English words
    
    // Step 7: Fix spacing around punctuation
    cleaned = cleaned.replace(/\s+([।॥,;?!])/g, '$1');
    cleaned = cleaned.replace(/([।॥])\s+/g, '$1 ');
    
    // Step 8: Remove excessive whitespace
    cleaned = cleaned.replace(/[ \t]+/g, ' ');
    cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n');
    
    // Step 9: Remove isolated punctuation marks
    cleaned = cleaned.replace(/\s+[।॥]\s+([।॥])\s+/g, ' ');
    
    // Step 10: Remove scattered Devanagari numbers (०-९) when surrounded by Gurmukhi
    cleaned = cleaned.replace(/([ਅ-ੌ])\s*[०-९]+\s*([ਅ-ੌ])/g, '$1 $2');
    
    // Step 11: Clean up formatting artifacts
    cleaned = cleaned.replace(/[__\-\.\s]{3,}/g, ' ');
    cleaned = cleaned.replace(/੍\s+੍/g, '');
    
    // Step 12: Remove TOC section headers that appear at chapter starts
    // Pattern: full TOC listing (numbered list with page numbers)
    const tocPattern = /(?:\d+\.\s+[ਅ-ੌ\s\-–—]+\d+\s*)+/g;
    const tocMatches = cleaned.match(tocPattern);
    if (tocMatches) {
        tocMatches.forEach(toc => {
            // Only remove if it's a large TOC block (> 200 chars) at the start
            if (toc.length > 200 && cleaned.indexOf(toc) < 500) {
                cleaned = cleaned.replace(toc, '');
            }
        });
    }
    
    // Step 13: Trim and normalize
    cleaned = cleaned.trim();
    cleaned = cleaned.replace(/^\s+/gm, '');
    
    return cleaned;
}

// Function to detect and remove TOC/frontmatter from chapter start
function removeTOCFromChapterStart(content, chapterTitle) {
    if (!content || !chapterTitle) return content;
    
    // Find the chapter title in content
    const titleIndex = content.indexOf(chapterTitle);
    
    if (titleIndex > 0 && titleIndex < 3000) {
        // Found the title within first 3000 chars
        // Check if there's substantial content before it (likely TOC)
        const beforeTitle = content.substring(0, titleIndex);
        const tocIndicators = (beforeTitle.match(/\d+\./g) || []).length;
        
        // If there are many numbered items before title (likely TOC), remove them
        if (tocIndicators > 5) {
            console.log(`  Removing TOC section (${beforeTitle.length} chars) before chapter title`);
            return content.substring(titleIndex);
        }
    }
    
    return content;
}

console.log('\nApplying enhanced OCR cleanup to all chapters...\n');

const cleanedChapters = correctedData.chapters.map((chapter, index) => {
    console.log(`Processing Chapter ${chapter.number}: ${chapter.titleGurmukhi}`);
    
    // Apply OCR cleanup
    let cleanedContent = enhancedOCRCleanup(chapter.content);
    
    // Remove TOC from chapter start if present
    cleanedContent = removeTOCFromChapterStart(cleanedContent, chapter.titleGurmukhi);
    
    // Recount words
    const words = cleanedContent.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    const beforeCount = chapter.wordCount;
    const removed = beforeCount - wordCount;
    const percentRemoved = ((removed / beforeCount) * 100).toFixed(1);
    
    console.log(`  Cleaned: ${beforeCount} → ${wordCount} words (removed ${removed} words, ${percentRemoved}%)`);
    
    return {
        ...chapter,
        content: cleanedContent,
        wordCount: wordCount
    };
});

// Calculate totals
const totalWords = cleanedChapters.reduce((sum, ch) => sum + ch.wordCount, 0);
const originalWords = correctedData.metadata.totalWords;
const wordsRemoved = originalWords - totalWords;
const percentRemoved = ((wordsRemoved / originalWords) * 100).toFixed(1);

console.log(`\n${'='.repeat(60)}`);
console.log('CLEANUP SUMMARY');
console.log(`${'='.repeat(60)}`);
console.log(`Original total: ${originalWords.toLocaleString()} words`);
console.log(`Cleaned total: ${totalWords.toLocaleString()} words`);
console.log(`Removed: ${wordsRemoved.toLocaleString()} words (${percentRemoved}%)`);
console.log(`Average per chapter: ${Math.round(totalWords / cleanedChapters.length).toLocaleString()} words`);

// Show sample from first chapter
console.log(`\n${'='.repeat(60)}`);
console.log('SAMPLE: Chapter 1 (first 500 chars after cleanup)');
console.log(`${'='.repeat(60)}`);
console.log(cleanedChapters[0].content.substring(0, 500));

// Show sample from Chapter 7 (Janeu)
console.log(`\n${'='.repeat(60)}`);
console.log('SAMPLE: Chapter 7 - ਜਨੇਊ (first 500 chars)');
console.log(`${'='.repeat(60)}`);
console.log(cleanedChapters[6].content.substring(0, 500));

// Create final output
const finalData = {
    metadata: {
        ...correctedData.metadata,
        cleanupDate: new Date().toISOString(),
        cleanupNote: "Applied enhanced OCR cleanup: removed page numbers, TOC fragments, formatting artifacts, and normalized whitespace",
        totalWords: totalWords,
        wordsRemovedInCleanup: wordsRemoved
    },
    chapters: cleanedChapters
};

// Save cleaned version
const outputPath = 'extracted-history/final-cleaned-chapters.json';
fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf8');

console.log(`\n✅ Saved cleaned chapters to: ${outputPath}`);
console.log(`\nReady to generate TypeScript file!`);
