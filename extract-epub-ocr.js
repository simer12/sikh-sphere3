/**
 * Enhanced EPUB to History Sections Extractor with OCR Support
 * 
 * This tool can extract content from:
 * 1. Text-based EPUBs (direct text extraction)
 * 2. Image-based EPUBs (using Tesseract.js OCR)
 * 
 * Automatically detects EPUB type and uses appropriate extraction method.
 * Supports Gurmukhi/Punjabi text recognition with pan (Punjabi script).
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { createWorker } = require('tesseract.js');

// Output directory
const OUTPUT_DIR = path.join(__dirname, 'extracted-history');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Extract EPUB with OCR support
 */
async function extractEpubWithOCR(epubPath, options = {}) {
  console.log(`\n🚀 Starting EPUB extraction with OCR support...\n`);
  console.log(`📚 File: ${epubPath}`);
  console.log(`🆔 Article ID: ${options.articleId || 'auto-generated'}\n`);
  
  try {
    // Unzip EPUB
    console.log('📦 Extracting EPUB archive...');
    const zip = new AdmZip(epubPath);
    const zipEntries = zip.getEntries();
    
    // Find all image files
    const imageFiles = zipEntries.filter(entry => {
      const ext = path.extname(entry.entryName).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'].includes(ext) &&
             !entry.entryName.includes('cover') &&
             !entry.entryName.includes('thumb');
    });
    
    console.log(`📄 Found ${imageFiles.length} image pages\n`);
    
    if (imageFiles.length === 0) {
      throw new Error('No images found in EPUB. This might be a text-based EPUB. Use extract-epub-history.js instead.');
    }
    
    // Sort images by filename (page_0, page_1, etc.)
    imageFiles.sort((a, b) => {
      const aNum = parseInt(a.entryName.match(/\d+/)?.[0] || 0);
      const bNum = parseInt(b.entryName.match(/\d+/)?.[0] || 0);
      return aNum - bNum;
    });
    
    // Initialize Tesseract worker with Punjabi language
    console.log('🔧 Initializing OCR engine (Tesseract.js)...');
    console.log('📥 Downloading Punjabi language data (this may take a moment)...\n');
    
    const worker = await createWorker('pan', 1, {
      logger: m => {
        if (m.status === 'downloading') {
          console.log(`   📥 ${m.status}: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    
    console.log('✅ OCR engine ready!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const sections = [];
    const pageTexts = [];
    let processedPages = 0;
    
    // Process images in batches (every 10-20 pages = 1 section)
    const PAGES_PER_SECTION = 10;
    
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      const pageNum = i + 1;
      
      console.log(`📄 [${pageNum}/${imageFiles.length}] Processing: ${imageFile.entryName}`);
      
      try {
        // Extract image data
        const imageBuffer = imageFile.getData();
        
        // Perform OCR
        const { data: { text, confidence } } = await worker.recognize(imageBuffer);
        
        if (text.trim().length > 20) {
          pageTexts.push(text.trim());
          console.log(`   ✓ Extracted: ${text.trim().split(/\s+/).length} words (confidence: ${Math.round(confidence)}%)`);
          processedPages++;
          
          // Create section every PAGES_PER_SECTION pages
          if (pageTexts.length === PAGES_PER_SECTION || i === imageFiles.length - 1) {
            const sectionContent = pageTexts.join('\n\n');
            const sectionNum = sections.length + 1;
            
            sections.push({
              id: `section_${sectionNum}`,
              title: `Section ${sectionNum} (Pages ${i - pageTexts.length + 2}-${pageNum})`,
              titleGurmukhi: '',
              content: sectionContent
            });
            
            console.log(`   📚 Created section ${sectionNum} with ${pageTexts.length} pages\n`);
            pageTexts.length = 0; // Clear array
          }
        } else {
          console.log(`   ⚠️  Skipped: No text detected or page too short`);
        }
      } catch (err) {
        console.error(`   ❌ Error processing page: ${err.message}`);
      }
    }
    
    // Terminate worker
    await worker.terminate();
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`✅ Successfully processed ${processedPages}/${imageFiles.length} pages`);
    console.log(`📚 Created ${sections.length} sections\n`);
    
    // Get book metadata from EPUB
    let metadata = {
      source: 'Unknown',
      author: 'Unknown',
      publisher: 'Unknown',
      date: 'Unknown',
      description: ''
    };
    
    // Try to read content.opf for metadata
    const contentOpf = zipEntries.find(e => e.entryName.includes('content.opf'));
    if (contentOpf) {
      const opfContent = contentOpf.getData().toString('utf8');
      metadata.source = opfContent.match(/<dc:title[^>]*>(.*?)<\/dc:title>/)?.[1] || metadata.source;
      metadata.author = opfContent.match(/<dc:creator[^>]*>(.*?)<\/dc:creator>/)?.[1] || metadata.author;
      metadata.publisher = opfContent.match(/<dc:publisher[^>]*>(.*?)<\/dc:publisher>/)?.[1] || metadata.publisher;
      metadata.date = opfContent.match(/<dc:date[^>]*>(.*?)<\/dc:date>/)?.[1] || metadata.date;
      metadata.description = opfContent.match(/<dc:description[^>]*>(.*?)<\/dc:description>/)?.[1] || metadata.description;
    }
    
    const output = {
      metadata: {
        ...metadata,
        extractedAt: new Date().toISOString(),
        totalSections: sections.length,
        totalPages: imageFiles.length,
        processedPages: processedPages,
        extractionMethod: 'OCR (Tesseract.js with Punjabi)',
        epubPath: epubPath
      },
      sections: sections
    };
    
    // Save JSON
    const jsonPath = path.join(OUTPUT_DIR, 'extracted-sections.json');
    fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2), 'utf8');
    console.log(`💾 Saved JSON data: ${jsonPath}`);
    
    // Generate TypeScript code
    const articleId = options.articleId || generateId(metadata.source);
    generateTypeScriptCode(output, articleId);
    
    // Generate summary
    generateFullSummary(output);
    
    return output;
    
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    throw error;
  }
}

/**
 * Generate a URL-friendly ID from title
 */
function generateId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Generate TypeScript code ready to paste into history.ts
 */
function generateTypeScriptCode(data, articleId) {
  const tsPath = path.join(OUTPUT_DIR, 'history-article-code.ts');
  
  let code = `// ═══════════════════════════════════════════════════════════════\n`;
  code += `// Extracted from: ${data.metadata.source}\n`;
  code += `// Author: ${data.metadata.author}\n`;
  code += `// Extraction method: OCR (Tesseract.js with Punjabi language)\n`;
  code += `// Extraction date: ${new Date().toLocaleDateString()}\n`;
  code += `// Total sections: ${data.metadata.totalSections}\n`;
  code += `// Pages processed: ${data.metadata.processedPages}/${data.metadata.totalPages}\n`;
  code += `// ═══════════════════════════════════════════════════════════════\n\n`;
  
  code += `// ⚠️  IMPORTANT NOTES:\n`;
  code += `// - This content was extracted using OCR (Optical Character Recognition)\n`;
  code += `// - OCR may have errors, especially with Gurmukhi text\n`;
  code += `// - Please review and correct any mistakes before using\n`;
  code += `// - Consider adding proper formatting and paragraph breaks\n\n`;
  
  code += `// 📋 INSTRUCTIONS:\n`;
  code += `// 1. Copy the entire object below\n`;
  code += `// 2. Open src/data/history.ts\n`;
  code += `// 3. Find the historyArticles array\n`;
  code += `// 4. Replace the existing article with ID "${articleId}" OR add as new\n`;
  code += `// 5. Review OCR text for errors and correct them\n`;
  code += `// 6. Add better section titles (currently just "Section 1", "Section 2", etc.)\n`;
  code += `// 7. Add Gurmukhi translations for section titles\n\n`;
  
  code += `{\n`;
  code += `  id: '${articleId}',\n`;
  code += `  title: '${escapeString(data.metadata.source)}',\n`;
  code += `  titleGurmukhi: '', // TODO: Add Gurmukhi title\n`;
  code += `  period: '1469-1539', // TODO: Adjust the period\n`;
  code += `  era: 'gurus', // TODO: Change if needed (gurus/warriors/modern/1984)\n`;
  code += `  summary: 'Biography of Guru Nanak Dev Ji extracted from EPUB using OCR. Please review for accuracy.',\n`;
  code += `  content: 'This content was extracted from ${data.metadata.totalPages} pages using OCR. Explore sections below.',\n`;
  code += `  sources: [historicalSources.DISCOVER_SIKHISM], // TODO: Add proper source\n`;
  code += `  sections: [\n`;
  
  data.sections.forEach((section, index) => {
    const content = section.content.substring(0, 3000); // Limit for readability
    code += `    {\n`;
    code += `      id: '${section.id}',\n`;
    code += `      title: '${escapeString(section.title)}', // TODO: Give meaningful title\n`;
    code += `      titleGurmukhi: '', // TODO: Add Gurmukhi\n`;
    code += `      content: \`${escapeBackticks(content)}${section.content.length > 3000 ? '...' : ''}\`\n`;
    code += `    }${index < data.sections.length - 1 ? ',' : ''}\n`;
  });
  
  code += `  ]\n`;
  code += `}\n`;
  
  fs.writeFileSync(tsPath, code, 'utf8');
  console.log(`💾 Saved TypeScript code: ${tsPath}`);
  console.log(`\n📝 READY TO REVIEW! Open ${tsPath} and review OCR output before using`);
}

/**
 * Generate a full summary report
 */
function generateFullSummary(data) {
  const summaryPath = path.join(OUTPUT_DIR, 'EXTRACTION_SUMMARY.txt');
  
  let summary = `═══════════════════════════════════════════════════════════════\n`;
  summary += `         EPUB OCR EXTRACTION SUMMARY\n`;
  summary += `═══════════════════════════════════════════════════════════════\n\n`;
  
  summary += `📚 Book Information:\n`;
  summary += `   Title: ${data.metadata.source}\n`;
  summary += `   Author: ${data.metadata.author}\n`;
  summary += `   Publisher: ${data.metadata.publisher}\n`;
  summary += `   Date: ${data.metadata.date}\n`;
  summary += `   Extracted: ${new Date(data.metadata.extractedAt).toLocaleString()}\n\n`;
  
  summary += `🔧 Extraction Method:\n`;
  summary += `   ${data.metadata.extractionMethod}\n`;
  summary += `   Total Pages: ${data.metadata.totalPages}\n`;
  summary += `   Processed: ${data.metadata.processedPages}\n`;
  summary += `   Success Rate: ${Math.round((data.metadata.processedPages / data.metadata.totalPages) * 100)}%\n\n`;
  
  summary += `📊 Content Statistics:\n`;
  summary += `   Total Sections: ${data.metadata.totalSections}\n`;
  
  let totalWords = 0;
  let totalChars = 0;
  data.sections.forEach(section => {
    totalWords += section.content.split(/\s+/).length;
    totalChars += section.content.length;
  });
  
  summary += `   Total Words: ${totalWords.toLocaleString()}\n`;
  summary += `   Total Characters: ${totalChars.toLocaleString()}\n`;
  summary += `   Average Words/Section: ${Math.round(totalWords / data.sections.length)}\n\n`;
  
  summary += `📑 Sections:\n\n`;
  data.sections.forEach((section, index) => {
    const words = section.content.split(/\s+/).length;
    summary += `   ${String(index + 1).padStart(3, ' ')}. ${section.title}\n`;
    summary += `        ID: ${section.id}\n`;
    summary += `        Words: ${words}\n\n`;
  });
  
  summary += `\n⚠️  IMPORTANT - OCR ACCURACY NOTICE\n`;
  summary += `═══════════════════════════════════════════════════════════════\n\n`;
  summary += `This content was extracted using OCR (Optical Character Recognition).\n`;
  summary += `OCR may produce errors, especially with:\n`;
  summary += `   • Gurmukhi script characters\n`;
  summary += `   • Special diacritical marks\n`;
  summary += `   • Poor quality scans\n`;
  summary += `   • Complex page layouts\n\n`;
  summary += `REQUIRED ACTIONS:\n`;
  summary += `   1. ✅ Review all extracted text carefully\n`;
  summary += `   2. 🔍 Correct OCR errors and typos\n`;
  summary += `   3. 📝 Add proper formatting and paragraph breaks\n`;
  summary += `   4. 🏷️  Give meaningful titles to sections (not just "Section 1")\n`;
  summary += `   5. 🔤 Add Gurmukhi translations for titles\n`;
  summary += `   6. 📚 Add proper source attribution\n\n`;
  
  summary += `\n═══════════════════════════════════════════════════════════════\n`;
  summary += `                    NEXT STEPS\n`;
  summary += `═══════════════════════════════════════════════════════════════\n\n`;
  
  summary += `1. 📝 Open: extracted-history/history-article-code.ts\n`;
  summary += `2. 🔍 REVIEW OCR text for errors (IMPORTANT!)\n`;
  summary += `3. ✏️  Correct any mistakes in the Gurmukhi text\n`;
  summary += `4. 🏷️  Add meaningful section titles\n`;
  summary += `5. 📋 Copy the corrected article object\n`;
  summary += `6. 📂 Paste into src/data/history.ts\n`;
  summary += `7. 🔤 Add Gurmukhi translations for titles\n`;
  summary += `8. 💾 Save and test in your app\n\n`;
  
  summary += `📱 After review, the article will show as a table of contents\n`;
  summary += `   with ${data.sections.length} clickable sections!\n\n`;
  
  fs.writeFileSync(summaryPath, summary, 'utf8');
  console.log(`📊 Saved summary: ${summaryPath}`);
}

/**
 * Escape special characters for TypeScript strings
 */
function escapeString(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Escape backticks for template literals
 */
function escapeBackticks(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║        EPUB to History Sections with OCR Support              ║
║     Extract Text from Image-Based EPUBs (Gurmukhi/Punjabi)   ║
╚════════════════════════════════════════════════════════════════╝

📖 USAGE:
   node extract-epub-ocr.js <epub-file> [article-id]

📝 EXAMPLES:
   node extract-epub-ocr.js "JeevanKatha.epub"
   node extract-epub-ocr.js "GuruNanakJi.epub" "guru-nanak-jeevan-katha"

🔧 WHAT IT DOES:
   • Extracts images from EPUB file
   • Performs OCR on each image using Tesseract.js
   • Recognizes Gurmukhi/Punjabi text
   • Groups pages into sections (10 pages per section)
   • Generates ready-to-use TypeScript code

⚠️  IMPORTANT:
   • OCR may have errors - REVIEW before using!
   • First run downloads Punjabi language data (~50MB)
   • Processing can take several minutes for large books
   • Best for scanned books in Gurmukhi script

📤 OUTPUT FILES:
   extracted-history/
   ├── extracted-sections.json      (Raw OCR data)
   ├── history-article-code.ts      (TypeScript code)
   └── EXTRACTION_SUMMARY.txt       (Statistics & instructions)

💡 WORKFLOW:
   1. Run script on image-based EPUB
   2. Wait for OCR processing (can take time)
   3. Review extracted text for errors
   4. Correct any OCR mistakes
   5. Add meaningful section titles
   6. Copy to src/data/history.ts
   7. Test in app

════════════════════════════════════════════════════════════════
`);
    process.exit(0);
  }
  
  const epubPath = args[0];
  const articleId = args[1] || null;
  
  if (!fs.existsSync(epubPath)) {
    console.error(`❌ ERROR: File not found: ${epubPath}`);
    process.exit(1);
  }
  
  try {
    await extractEpubWithOCR(epubPath, { articleId });
    
    console.log(`\n✨ ═══════════════════════════════════════════════════════════════`);
    console.log(`✨  OCR EXTRACTION COMPLETE!`);
    console.log(`✨ ═══════════════════════════════════════════════════════════════\n`);
    
    console.log(`⚠️  IMPORTANT: Review OCR output for errors before using!\n`);
    console.log(`📂 Next steps:`);
    console.log(`   1. Open: extracted-history/history-article-code.ts`);
    console.log(`   2. Review and correct OCR errors`);
    console.log(`   3. Add meaningful section titles`);
    console.log(`   4. Copy corrected code to src/data/history.ts`);
    console.log(`   5. Test in your app!\n`);
    
  } catch (error) {
    console.error(`\n❌ EXTRACTION FAILED:`, error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { extractEpubWithOCR };
