/**
 * EPUB to Sikh History Extractor
 * 
 * This script extracts content from EPUB files and converts them
 * to the format used in src/data/history.ts
 * 
 * EPUB files are ZIP archives containing HTML/XHTML files
 * 
 * Features:
 * - Automatically detects book's table of contents
 * - Extracts each chapter as a separate section
 * - Generates TypeScript code ready to paste into history.ts
 * - Cleans HTML and formats content properly
 * - Creates both JSON and TypeScript output
 * 
 * Usage:
 *   node extract-epub-history.js path/to/book.epub
 *   node extract-epub-history.js path/to/book.epub --article-id="guru_nanak_dev_ji"
 */

const EPub = require('epub');
const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = './extracted-history';
const OUTPUT_FILE = './extracted-history/history-data.json';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Extract content from EPUB file
 */
function extractEpub(epubPath, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n📖 Opening EPUB: ${epubPath}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const epub = new EPub(epubPath);
    
    epub.on('error', (err) => {
      console.error('❌ Error parsing EPUB:', err);
      reject(err);
    });
    
    epub.on('end', async () => {
      console.log('✅ EPUB metadata loaded\n');
      console.log('📚 Book Information:');
      console.log(`   Title: ${epub.metadata.title}`);
      console.log(`   Author: ${epub.metadata.creator}`);
      console.log(`   Publisher: ${epub.metadata.publisher || 'N/A'}`);
      console.log(`   Date: ${epub.metadata.date || 'N/A'}`);
      console.log(`   Language: ${epub.metadata.language || 'N/A'}`);
      console.log(`   Description: ${epub.metadata.description ? epub.metadata.description.substring(0, 100) + '...' : 'N/A'}`);
      
      const sections = [];
      
      try {
        // Get table of contents
        const toc = epub.toc;
        console.log(`\n📑 Found ${toc.length} chapters in Table of Contents\n`);
        
        // If no TOC, extract all content files directly
        if (toc.length === 0) {
          console.log('⚠️  No TOC found. Extracting all content files instead...\n');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          
          const manifest = epub.manifest;
          const contentFiles = Object.keys(manifest)
            .filter(key => {
              const item = manifest[key];
              return item['media-type'] === 'application/xhtml+xml' || 
                     item['media-type'] === 'text/html';
            })
            .map(key => ({ id: key, title: manifest[key].href }));
          
          console.log(`📄 Found ${contentFiles.length} content files\n`);
          
          for (let i = 0; i < contentFiles.length; i++) {
            const file = contentFiles[i];
            console.log(`📄 [${i + 1}/${contentFiles.length}] Processing: "${file.title}"`);
            
            try {
              const fileContent = await getChapterContent(epub, file.id);
              
              if (fileContent && fileContent.trim().length > 100) {
                const cleanedContent = cleanContent(fileContent);
                const wordCount = cleanedContent.split(/\s+/).length;
                
                // Try to extract title from first heading or use filename
                let title = file.title.replace(/\.x?html?$/i, '').replace(/[_-]/g, ' ');
                const titleMatch = fileContent.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
                if (titleMatch) {
                  title = cleanContent(titleMatch[1]).substring(0, 100);
                }
                
                const section = {
                  id: generateId(title + '_' + (i + 1)),
                  title: title.trim() || `Section ${i + 1}`,
                  titleGurmukhi: '',
                  content: cleanedContent
                };
                
                sections.push(section);
                console.log(`   ✓ Extracted: ${wordCount} words, ${cleanedContent.length} characters`);
              } else {
                console.log(`   ⚠️  Skipped: Content too short or empty`);
              }
            } catch (err) {
              console.error(`   ❌ Error: ${err.message}`);
            }
          }
        } else {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          
          // Process each chapter from TOC
          for (let i = 0; i < toc.length; i++) {
            const chapter = toc[i];
            console.log(`📄 [${i + 1}/${toc.length}] Processing: "${chapter.title}"`);
            
            try {
              const chapterContent = await getChapterContent(epub, chapter.id);
              
              if (chapterContent && chapterContent.trim().length > 50) {
                const cleanedContent = cleanContent(chapterContent);
                const wordCount = cleanedContent.split(/\s+/).length;
                
                const section = {
                  id: generateId(chapter.title),
                  title: chapter.title.trim(),
                  titleGurmukhi: '',
                  content: cleanedContent
                };
                
                sections.push(section);
                console.log(`   ✓ Extracted: ${wordCount} words, ${cleanedContent.length} characters`);
              } else {
                console.log(`   ⚠️  Skipped: Content too short or empty`);
              }
            } catch (err) {
              console.error(`   ❌ Error: ${err.message}`);
            }
          }
        }
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log(`✅ Successfully extracted ${sections.length} sections`);
        
        // Create output
        const output = {
          metadata: {
            source: epub.metadata.title || 'Unknown',
            author: epub.metadata.creator || 'Unknown',
            publisher: epub.metadata.publisher || 'Unknown',
            date: epub.metadata.date || 'Unknown',
            description: epub.metadata.description || '',
            extractedAt: new Date().toISOString(),
            totalSections: sections.length,
            epubPath: epubPath
          },
          sections: sections
        };
        
        // Save JSON
        const jsonPath = path.join(OUTPUT_DIR, 'extracted-sections.json');
        fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2), 'utf8');
        console.log(`\n💾 Saved JSON: ${jsonPath}`);
        
        // Generate TypeScript code
        const articleId = options.articleId || generateId(epub.metadata.title);
        generateTypeScriptCode(output, articleId);
        
        // Generate summary
        generateFullSummary(output);
        
        resolve(output);
      } catch (err) {
        reject(err);
      }
    });
    
    epub.parse();
  });
}

/**
 * Get chapter content by ID
 */
function getChapterContent(epub, chapterId) {
  return new Promise((resolve, reject) => {
    epub.getChapter(chapterId, (err, text) => {
      if (err) {
        reject(err);
      } else {
        resolve(text);
      }
    });
  });
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
 * Try to detect the historical period from title/content
 */
function detectPeriod(title) {
  const lowerTitle = title.toLowerCase();
  
  // Guru period patterns
  if (lowerTitle.includes('guru nanak') || lowerTitle.includes('1469')) return '1469-1539';
  if (lowerTitle.includes('guru gobind') || lowerTitle.includes('khalsa')) return '1675-1708';
  if (lowerTitle.includes('ten gurus') || lowerTitle.includes('gurus')) return '1469-1708';
  
  // Warrior period patterns
  if (lowerTitle.includes('banda singh') || lowerTitle.includes('1710')) return '1708-1716';
  if (lowerTitle.includes('misl') || lowerTitle.includes('1716')) return '1716-1799';
  if (lowerTitle.includes('ranjit singh') || lowerTitle.includes('sikh empire')) return '1799-1849';
  if (lowerTitle.includes('anglo-sikh') || lowerTitle.includes('1845')) return '1845-1849';
  
  // Modern period
  if (lowerTitle.includes('british') || lowerTitle.includes('colonial')) return '1849-1947';
  if (lowerTitle.includes('independence') || lowerTitle.includes('partition')) return '1947-1984';
  
  // 1984
  if (lowerTitle.includes('1984') || lowerTitle.includes('blue star')) return '1984';
  
  return 'Unknown';
}

/**
 * Detect the era category
 */
function detectEra(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('guru') && !lowerTitle.includes('1984')) return 'gurus';
  if (lowerTitle.includes('banda') || lowerTitle.includes('misl') || 
      lowerTitle.includes('ranjit') || lowerTitle.includes('empire') ||
      lowerTitle.includes('warrior') || lowerTitle.includes('anglo')) return 'warriors';
  if (lowerTitle.includes('1984') || lowerTitle.includes('blue star') || 
      lowerTitle.includes('riots')) return '1984';
  
  return 'modern';
}

/**
 * Generate a brief summary from content (first 200 words)
 */
function generateBriefSummary(content) {
  const cleanText = cleanContent(content);
  const words = cleanText.split(/\s+/).slice(0, 200);
  let summary = words.join(' ');
  
  // Try to end at a sentence
  const lastPeriod = summary.lastIndexOf('.');
  if (lastPeriod > 100) {
    summary = summary.substring(0, lastPeriod + 1);
  } else {
    summary += '...';
  }
  
  return summary;
}

/**
 * Clean HTML content and convert to plain text
 */
function cleanContent(html) {
  if (!html) return '';
  
  // Remove HTML tags
  let text = html.replace(/<style[^>]*>.*?<\/style>/gi, '');
  text = text.replace(/<script[^>]*>.*?<\/script>/gi, '');
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/\n\s*\n/g, '\n\n');
  text = text.trim();
  
  return text;
}

/**
 * Generate TypeScript code ready to paste into history.ts
 */
function generateTypeScriptCode(data, articleId) {
  const tsPath = path.join(OUTPUT_DIR, 'history-article-code.ts');
  
  let code = `// ═══════════════════════════════════════════════════════════════\n`;
  code += `// Extracted from: ${data.metadata.source}\n`;
  code += `// Author: ${data.metadata.author}\n`;
  code += `// Extraction date: ${new Date().toLocaleDateString()}\n`;
  code += `// Total sections: ${data.metadata.totalSections}\n`;
  code += `// ═══════════════════════════════════════════════════════════════\n\n`;
  
  code += `// 📋 INSTRUCTIONS:\n`;
  code += `// 1. Copy the entire object below\n`;
  code += `// 2. Open src/data/history.ts\n`;
  code += `// 3. Find the historyArticles array\n`;
  code += `// 4. Replace the existing article with ID "${articleId}" OR add as new\n`;
  code += `// 5. Add Gurmukhi translations manually where needed\n`;
  code += `// 6. Adjust period, era, and summary as needed\n\n`;
  
  code += `{\n`;
  code += `  id: '${articleId}',\n`;
  code += `  title: '${escapeString(data.metadata.source)}',\n`;
  code += `  titleGurmukhi: '', // TODO: Add Gurmukhi title\n`;
  code += `  period: '1469-1539', // TODO: Adjust the period\n`;
  code += `  era: 'gurus', // TODO: Change if needed (gurus/warriors/modern/1984)\n`;
  code += `  summary: '${escapeString(data.metadata.description || 'Comprehensive history extracted from ' + data.metadata.source)}',\n`;
  code += `  content: 'Explore detailed sections below. Each section contains comprehensive information.',\n`;
  code += `  sources: [historicalSources.YOUR_SOURCE], // TODO: Add to historicalSources first\n`;
  code += `  sections: [\n`;
  
  data.sections.forEach((section, index) => {
    code += `    {\n`;
    code += `      id: '${section.id}',\n`;
    code += `      title: '${escapeString(section.title)}',\n`;
    code += `      titleGurmukhi: '', // TODO: Add Gurmukhi\n`;
    code += `      content: \`${escapeBackticks(section.content.substring(0, 5000))}${section.content.length > 5000 ? '...' : ''}\`\n`;
    code += `    }${index < data.sections.length - 1 ? ',' : ''}\n`;
  });
  
  code += `  ]\n`;
  code += `}\n`;
  
  fs.writeFileSync(tsPath, code, 'utf8');
  console.log(`💾 Saved TypeScript code: ${tsPath}`);
  console.log(`\n📝 READY TO USE! Copy the code from ${tsPath} and paste into history.ts`);
}

/**
 * Generate a full summary report
 */
function generateFullSummary(data) {
  const summaryPath = path.join(OUTPUT_DIR, 'EXTRACTION_SUMMARY.txt');
  
  let summary = `═══════════════════════════════════════════════════════════════\n`;
  summary += `              EPUB EXTRACTION SUMMARY\n`;
  summary += `═══════════════════════════════════════════════════════════════\n\n`;
  
  summary += `📚 Book Information:\n`;
  summary += `   Title: ${data.metadata.source}\n`;
  summary += `   Author: ${data.metadata.author}\n`;
  summary += `   Publisher: ${data.metadata.publisher}\n`;
  summary += `   Date: ${data.metadata.date}\n`;
  summary += `   Extracted: ${new Date(data.metadata.extractedAt).toLocaleString()}\n\n`;
  
  summary += `📊 Extraction Statistics:\n`;
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
  
  summary += `📑 Table of Contents:\n\n`;
  data.sections.forEach((section, index) => {
    const words = section.content.split(/\s+/).length;
    summary += `   ${String(index + 1).padStart(3, ' ')}. ${section.title}\n`;
    summary += `        ID: ${section.id}\n`;
    summary += `        Words: ${words}\n\n`;
  });
  
  summary += `\n═══════════════════════════════════════════════════════════════\n`;
  summary += `                    NEXT STEPS\n`;
  summary += `═══════════════════════════════════════════════════════════════\n\n`;
  
  summary += `1. ✅ Review extracted sections in: extracted-history/extracted-sections.json\n`;
  summary += `2. 📝 Open: extracted-history/history-article-code.ts\n`;
  summary += `3. 📋 Copy the entire article object\n`;
  summary += `4. 📂 Open: src/data/history.ts\n`;
  summary += `5. ✏️  Paste into historyArticles array\n`;
  summary += `6. 🔤 Add Gurmukhi translations (titleGurmukhi fields)\n`;
  summary += `7. 🔍 Review content and adjust as needed\n`;
  summary += `8. 💾 Save and test in your app\n\n`;
  
  summary += `📱 The article will show as a table of contents with ${data.sections.length} clickable sections!\n\n`;
  
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
║          EPUB to History Sections Extractor                   ║
║       Automatically Extract TOC Chapters for Your App         ║
╚════════════════════════════════════════════════════════════════╝

📖 USAGE:
   node extract-epub-history.js <epub-file> [article-id]

📝 EXAMPLES:
   node extract-epub-history.js "history-of-sikhs.epub"
   node extract-epub-history.js "sikh-history.epub" guru-nanak-dev-ji

🔧 WHAT IT DOES:
   • Reads EPUB table of contents
   • Extracts each chapter as a separate section
   • Cleans HTML and formats text
   • Generates ready-to-use TypeScript code
   • Creates sections[] array for history.ts

📤 OUTPUT FILES:
   extracted-history/
   ├── extracted-sections.json      (Raw data)
   ├── history-article-code.ts      (Ready to copy/paste!)
   └── EXTRACTION_SUMMARY.txt       (Overview & instructions)

💡 WORKFLOW:
   1. Download EPUB book of Sikh history
   2. Run this script on the EPUB file
   3. Open history-article-code.ts
   4. Copy the article object
   5. Paste into src/data/history.ts
   6. Add Gurmukhi translations
   7. Test in app - clickable TOC appears!

📚 RECOMMENDED SOURCES:
   • Archive.org: "History of the Sikhs" by Cunningham
   • Archive.org: "The Sikhs" by Dorothy Field
   • Convert PDFs to EPUB using Calibre if needed

════════════════════════════════════════════════════════════════
`);
    process.exit(0);
  }
  
  const epubPath = args[0];
  const articleId = args[1] || path.basename(epubPath, '.epub').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  if (!fs.existsSync(epubPath)) {
    console.error(`❌ ERROR: File not found: ${epubPath}`);
    process.exit(1);
  }
  
  console.log(`\n🚀 Starting EPUB extraction...\n`);
  console.log(`📚 File: ${epubPath}`);
  console.log(`🆔 Article ID: ${articleId}\n`);
  
  try {
    const data = await extractEpub(epubPath);
    
    // Save JSON data
    const jsonPath = path.join(OUTPUT_DIR, 'extracted-sections.json');
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`\n💾 Saved JSON data: ${jsonPath}`);
    
    // Generate TypeScript code
    generateTypeScriptCode(data, articleId);
    
    // Generate summary
    generateFullSummary(data);
    
    console.log(`\n✨ ═══════════════════════════════════════════════════════════════`);
    console.log(`✨  EXTRACTION COMPLETE! ${data.metadata.totalSections} sections ready!`);
    console.log(`✨ ═══════════════════════════════════════════════════════════════\n`);
    
    console.log(`📂 Next steps:`);
    console.log(`   1. Open: extracted-history/history-article-code.ts`);
    console.log(`   2. Copy the entire article object`);
    console.log(`   3. Paste into src/data/history.ts`);
    console.log(`   4. Add Gurmukhi translations`);
    console.log(`   5. Test in your app!\n`);
    
  } catch (error) {
    console.error(`\n❌ ERROR during extraction:`, error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { extractEpub, cleanContent, generateId };
