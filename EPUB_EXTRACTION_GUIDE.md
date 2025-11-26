# EPUB to History Sections Extractor - Complete Guide

## 🎯 Purpose

Automatically extract chapters from EPUB books about Sikh History and convert them into ready-to-use sections for your React Native app. This tool reads the EPUB table of contents, extracts each chapter, cleans the HTML, and generates TypeScript code you can directly paste into your app.

## 📚 Complete Workflow (5 Simple Steps)

### Step 1: Find and Download EPUB Books

**🌟 Recommended Sources:**

**Archive.org (Best Option):**
- Visit: https://archive.org
- Search: "History of Sikhs", "Sikh History", "Punjab History"
- **Recommended books:**
  - **"History of the Sikhs" by J.D. Cunningham (1849)** - Classic comprehensive history
  - **"The Sikhs" by Dorothy Field** - Well-structured chapters
  - **"A History of the Sikh People" by Dr. Gopal Singh**
  - **"Sikh Religion and Philosophy" by Teja Singh**

**How to download from Archive.org:**
1. Find the book you want
2. Look for "DOWNLOAD OPTIONS" on the right side
3. Choose **"EPUB"** format (if available)
4. If only PDF available, see Step 2 below

### Step 2: Convert PDF to EPUB (If Needed)

**If the book is only available as PDF:**

**Using Calibre (Free & Recommended):**
1. Download Calibre: https://calibre-ebook.com/download
2. Install and open Calibre
3. Click **"Add books"** and select your PDF
4. Select the book in Calibre's library
5. Click **"Convert books"**
6. Set Output format to **"EPUB"**
7. Click **"OK"** and wait for conversion
8. Right-click the book → **"Open containing folder"** to find the EPUB

### Step 3: Run the Extractor

```powershell
# Make sure epub package is installed (only needed once)
npm install --save-dev epub --legacy-peer-deps

# Extract the book
node extract-epub-history.js "path/to/your-book.epub"

# Or specify a custom article ID
node extract-epub-history.js "history-of-sikhs.epub" "history-sikhs-cunningham"
```

**What happens:**
- ✅ Reads EPUB table of contents
- ✅ Extracts each chapter as a section
- ✅ Cleans HTML and formats text
- ✅ Generates 3 files in `extracted-history/` folder

### Step 4: Review Generated Files

The script creates **3 files** in `extracted-history/`:

**1. extracted-sections.json**
- Raw JSON data with all extracted sections
- Good for reviewing what was extracted
- Check if content looks clean

**2. history-article-code.ts** ⭐ **MOST IMPORTANT FILE**
- Ready-to-paste TypeScript code
- Contains complete article object with sections array
- **Just copy this entire file content!**

**3. EXTRACTION_SUMMARY.txt**
- Overview of extraction statistics
- Table of contents with word counts per section
- Next steps checklist

### Step 5: Add to Your App

**Quick Steps:**
1. **Open** `extracted-history/history-article-code.ts`
2. **Copy** the entire article object (everything in the file)
3. **Open** `src/data/history.ts` in your app
4. **Find** the `historyArticles` array
5. **Paste** the copied object into the array
6. **Add** Gurmukhi translations for titles (optional)
7. **Adjust** the period, era, and summary if needed
8. **Add source** to `historicalSources` first

**Example:**
```typescript
// First, add to historicalSources object:
const historicalSources = {
  // ... existing sources
  CUNNINGHAM_HISTORY: {
    title: 'A History of the Sikhs',
    author: 'J.D. Cunningham',
    year: '1849',
    link: 'https://archive.org/details/historyofsikhs00cunnuoft',
    license: 'Public Domain'
  },
};

// Then, in historyArticles array, paste the extracted object:
export const historyArticles: HistoryArticle[] = [
  // ... existing articles
  {
    id: 'history-sikhs-cunningham',
    title: 'A History of the Sikhs',
    titleGurmukhi: 'ਸਿੱਖਾਂ ਦਾ ਇਤਿਹਾਸ', // Add Gurmukhi
    period: '1469-1849',
    era: 'gurus',
    summary: 'Comprehensive history by J.D. Cunningham covering the origin and development of Sikhism from Guru Nanak Dev Ji to the British period.',
    content: 'Explore detailed sections below. Each section contains comprehensive information.',
    sources: [historicalSources.CUNNINGHAM_HISTORY],
    sections: [
      // All the extracted sections (already done by the tool!)
      {
        id: 'chapter_1',
        title: 'Origin and Early History',
        titleGurmukhi: '', // Add if you want
        content: `Detailed content from Chapter 1...`
      },
      // ... more sections
    ]
  }
];
```

**Then test:**
1. Save `history.ts`
2. Run your app: `npm start`
3. Navigate to History section
4. Find your new article
5. Tap it - you'll see a **beautiful table of contents**! 📖
6. Tap any section to read the detailed content

## 🔧 What the Tool Does Automatically

✅ **Reads EPUB table of contents**
✅ **Extracts each chapter as a separate section**
✅ **Cleans HTML tags and formatting**
✅ **Removes style and script tags**
✅ **Converts HTML entities** (&nbsp;, &amp;, etc.)
✅ **Generates proper data structure**
✅ **Creates TypeScript code** ready to paste
✅ **Limits content size** (5000 chars per section for reasonable app size)
✅ **Generates statistics** (word count, section count)

## 📝 What You Need to Do Manually

📝 **Add Gurmukhi translations** (optional but recommended)
🔍 **Review content quality** (check for any formatting issues)
⚙️ **Adjust period, era, summary** (update if needed)
📚 **Add source to historicalSources** (with proper attribution)
🔗 **Link related articles** (optional - connect to other history articles)

## 📖 Example Books to Extract

### 1. History of the Sikhs (Cunningham)
- **URL:** https://archive.org/details/historyofsikhs00cunnuoft
- **Chapters:** ~20 comprehensive chapters
- **Period:** 1469-1849
- **Era:** gurus/warriors
- **Why:** Classic reference, well-structured, public domain, comprehensive

### 2. The Sikhs (Dorothy Field)
- **Search:** Archive.org for "Dorothy Field Sikhs"
- **Chapters:** ~15 chapters
- **Period:** 1469-1900s
- **Era:** gurus/warriors/modern
- **Why:** Clear writing style, good for beginners, easy to understand

### 3. Sikh Religion and Philosophy (Teja Singh)
- **Search:** Archive.org for "Teja Singh Sikh"
- **Chapters:** ~12 chapters
- **Period:** Historical and philosophical overview
- **Era:** gurus
- **Why:** Deep philosophical content, focus on teachings and values

## 🎨 Output Format

The extractor creates sections in this exact format:

```typescript
{
  id: 'article-id',
  title: 'Book Title',
  titleGurmukhi: '', // You add this
  period: '1469-1539', // Adjust as needed
  era: 'gurus', // Adjust as needed
  summary: 'Brief description...',
  content: 'Explore detailed sections below...',
  sources: [historicalSources.YOUR_SOURCE],
  sections: [
    {
      id: 'chapter_1',
      title: 'Chapter Title from TOC',
      titleGurmukhi: '', // You add this
      content: `Clean, formatted text content from the chapter...`
    },
    {
      id: 'chapter_2',
      title: 'Another Chapter',
      titleGurmukhi: '',
      content: `More content...`
    }
    // ... all chapters as sections
  ]
}
```

## ⚙️ Customization Options

**Custom Article ID:**
```powershell
node extract-epub-history.js "book.epub" "my-custom-id"
```
This creates an article with `id: 'my-custom-id'` instead of auto-generated.

**Default behavior:**
- Auto-generates ID from filename
- Example: "history-of-sikhs.epub" → `id: 'history-of-sikhs'`

## ⚠️ Important Notes

### Copyright Considerations

**✅ Safe to use:**
- Books published before 1928 (public domain in USA)
- Books with expired copyrights
- Government publications
- Books explicitly marked as public domain on Archive.org

**📋 Always do:**
- Check the book's copyright page
- Look at Archive.org's license information
- Verify publication date
- Give proper attribution in your app
- Add source information in `historicalSources`

**❌ Do not use:**
- Recently published books without permission
- Copyrighted material
- Books with "All Rights Reserved"

### Technical Notes

**EPUB Package:**
- Installed with `--legacy-peer-deps` due to React Native conflicts
- This is **normal** and doesn't affect functionality
- The epub package is only used for extraction (dev dependency)
- **Not included** in your production app bundle

**Content Quality:**
- Some EPUBs have better formatting than others
- PDF-to-EPUB conversions may have some artifacts
- Always **review extracted content** before publishing
- Edit content if needed - it's your app, your content!

## 🚀 Advanced Tips

### Multiple Books Strategy

Extract multiple books and create rich content:

```powershell
node extract-epub-history.js "cunningham.epub" "history-sikhs-1"
node extract-epub-history.js "dorothy-field.epub" "history-sikhs-2"
node extract-epub-history.js "gopal-singh.epub" "history-sikhs-3"
```

Now you have **3 different articles** with different perspectives!

### Splitting Large Books

If a book has **too many chapters** (>30), consider splitting:

- **Article 1:** "History of Guru Nanak Dev Ji" (chapters 1-10)
- **Article 2:** "History of Later Gurus" (chapters 11-20)
- **Article 3:** "Sikh Empire Period" (chapters 21-30)

Just manually divide the sections array into multiple articles.

### Combining Similar Sections

You can manually merge sections after extraction:

```typescript
// Instead of 2 small sections:
{ id: 'chapter_1', title: 'Early Life', content: '...' },
{ id: 'chapter_2', title: 'Childhood', content: '...' },

// Combine into 1:
{ id: 'early_life', title: 'Early Life and Childhood', content: '... combined ...' }
```

### Adding Gurmukhi Efficiently

**For titles:**
- Use Google Translate: English → Punjabi
- Copy Gurmukhi text
- Paste into `titleGurmukhi` field

**Online Gurmukhi Keyboard:**
- https://www.lexilogos.com/keyboard/punjabi.htm
- Type phonetically, get Gurmukhi

## 🆘 Troubleshooting

### Problem: "Cannot find module 'epub'"

**Solution:**
```powershell
npm install --save-dev epub --legacy-peer-deps
```

### Problem: "File not found" error

**Solution:**
- Use full path: `"C:\Users\LENOVO\Documents\book.epub"`
- Or relative path from project root
- Put quotes around paths with spaces
- Check file actually exists

### Problem: Empty or Garbled Content

**Cause:** Poor EPUB formatting or bad conversion

**Solutions:**
1. Try a different EPUB source
2. Re-convert PDF with Calibre (adjust settings)
3. Download different edition of the book
4. Manually edit extracted content

### Problem: Missing Chapters

**Cause:** EPUB's table of contents is incomplete

**Solutions:**
1. Open EPUB in an EPUB reader app to verify TOC
2. Try a different edition of the book
3. Download from different source
4. Manually add missing chapters to sections array

### Problem: Script Hangs or Takes Too Long

**Cause:** Very large EPUB file

**Solution:**
- Wait patiently (large books take time)
- Check console for progress messages
- Try smaller book first to test
- Break large books into parts

## 📊 Understanding the Output

**Console Output Explanation:**

```
🚀 Starting EPUB extraction...
📚 File: history-of-sikhs.epub
🆔 Article ID: history-of-sikhs

📖 Opening EPUB...
✅ EPUB opened successfully!
📑 Found 20 items in table of contents

⏳ Extracting sections... [1/20]
   📄 Chapter 1: Origin and Early History (2,456 words)
⏳ Extracting sections... [2/20]
   📄 Chapter 2: Guru Nanak Dev Ji (3,123 words)
...

💾 Saved JSON data: extracted-history/extracted-sections.json
💾 Saved TypeScript code: extracted-history/history-article-code.ts
📊 Saved summary: extracted-history/EXTRACTION_SUMMARY.txt

✨ ═══════════════════════════════════════════
✨  EXTRACTION COMPLETE! 20 sections ready!
✨ ═══════════════════════════════════════════

📂 Next steps:
   1. Open: extracted-history/history-article-code.ts
   2. Copy the entire article object
   3. Paste into src/data/history.ts
   4. Add Gurmukhi translations
   5. Test in your app!
```

## ✅ Quick Checklist

Before starting:
- [ ] Node.js installed
- [ ] epub package installed
- [ ] EPUB file downloaded

During extraction:
- [ ] Script runs without errors
- [ ] Console shows progress
- [ ] 3 files created in extracted-history/

After extraction:
- [ ] Review extracted-sections.json
- [ ] Open history-article-code.ts
- [ ] Copy article object
- [ ] Paste into history.ts
- [ ] Add source to historicalSources
- [ ] Add Gurmukhi translations (optional)
- [ ] Adjust period and era
- [ ] Test in app

Final verification:
- [ ] Article appears in History list
- [ ] Table of contents displays correctly
- [ ] Sections are clickable
- [ ] Content displays properly
- [ ] Back button works
- [ ] No formatting issues
- [ ] Gurmukhi text displays (if added)

## 🎉 Success!

Once you complete these steps, you'll have:

✨ **Professional history content** in your app
✨ **Beautiful table of contents** with clickable sections
✨ **Rich, detailed information** from authentic sources
✨ **Proper attribution** to historical works
✨ **Scalable approach** - extract more books anytime!

**Your users will love having comprehensive Sikh History at their fingertips!** 📱🙏

---

## Need Help?

If you encounter any issues not covered here:
1. Check the console output for specific error messages
2. Verify the EPUB file in an EPUB reader app
3. Try the extraction with a different book
4. Review the generated JSON file for data quality

Happy extracting! 🎉📚✨
