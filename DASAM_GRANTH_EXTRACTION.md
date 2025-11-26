# Complete Dasam Granth Extraction Guide

## Option 1: ShabadOS Database (RECOMMENDED - MIT License)

### Step 1: Install ShabadOS Database
```powershell
npm install @shabados/database --save-dev
```

### Step 2: Run the extraction script
```powershell
node fetch-dasam-shabados.js
```

### What it will do:
- Connect to ShabadOS database
- Extract all 18 Dasam Granth compositions
- Save verse-by-verse JSON files with Gurmukhi Unicode
- Create an index file for easy integration

---

## Option 2: SikhiToTheMax/BaniDB Endpoints

### If ShabadOS doesn't have all compositions, try these endpoints:

#### Test endpoint availability:
```powershell
# Check if Dasam Granth is available
curl "https://api.banidb.com/v2/banis" | Select-String -Pattern "dasam"

# Or use SikhiToTheMax API
curl "https://api.sikhitothemax.org/banis"
```

#### Create a custom scraper:
```javascript
// fetch-sttm-dasam.js
const axios = require('axios');
const fs = require('fs');

async function fetchFromSTTM() {
  // Try to get Dasam Granth compositions
  const response = await axios.get('https://api.sikhitothemax.org/search', {
    params: {
      source: 'D', // D = Dasam Granth
      ang: 1,
    }
  });
  
  console.log('Available Dasam content:', response.data);
}

fetchFromSTTM();
```

---

## Option 3: Direct GitHub Repositories

### Clone and explore these repositories:

```powershell
# ShabadOS Database
git clone https://github.com/shabados/database.git
cd database
npm install
npm run build

# Explore the data
node -e "const db = require('./'); db.connect().then(() => console.log('Connected'))"
```

```powershell
# KhalisFoundation BaniDB
git clone https://github.com/KhalisFoundation/banidb-api.git
cd banidb-api
npm install
# Check their README for database setup
```

---

## Option 4: Archive.org Fallback (If APIs don't have all content)

### Download complete Dasam Granth PDFs with OCR:

1. Visit: https://archive.org/details/dasam_granth_patna_bir
2. Download the "Full Text" JSON or "DjVu" with text layer
3. Extract using a script:

```powershell
# Download the text file
curl "https://archive.org/download/dasam_granth_patna_bir/dasam_granth_patna_bir_djvu.txt" -o dasam-complete.txt
```

---

## Recommended Approach:

### Phase 1: Try ShabadOS (Easy + MIT License)
```powershell
npm install @shabados/database --save-dev
node fetch-dasam-shabados.js
```

### Phase 2: If missing compositions, use BaniDB API
Already done - you have 8 Banis from BaniDB

### Phase 3: For remaining (Charitropakhyan, Zafarnama, etc.)
- Contact KhalisFoundation for data export
- Or use Archive.org OCR + manual parsing

---

## Data Structure You'll Get:

```json
{
  "id": "bachittar-natak",
  "name": "Bachittar Natak",
  "nameGurmukhi": "ਬਚਿੱਤਰ ਨਾਟਕ",
  "source": "ShabadOS Database",
  "verses": [
    {
      "id": 1,
      "gurmukhi": "ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਹਿ ॥",
      "transliteration": "ik oankaar sree vaahiguroo jee kee fateh",
      "translation": "One Universal Creator God. Victory belongs to the Wonderful Lord.",
      "lineNumber": 1,
      "pageNumber": 1
    }
  ],
  "totalVerses": 500
}
```

---

## Next Steps After Extraction:

1. **Review the JSON files** - Check if all compositions are present
2. **Merge with existing data** - You already have 8 Banis from BaniDB
3. **Update your app** - Integrate the new JSON files into your service
4. **Test display** - Ensure Gurmukhi renders correctly
5. **Publish update** - Push to EAS

---

## License Notes:

- ✅ **ShabadOS** - MIT License (free to use)
- ⚠️ **BaniDB/STTM** - Check with KhalisFoundation
- ✅ **Archive.org** - Most items are public domain (verify each)

---

## Troubleshooting:

If `@shabados/database` installation fails:
```powershell
# Try with legacy peer deps
npm install @shabados/database --save-dev --legacy-peer-deps

# Or use yarn
yarn add @shabados/database --dev
```

If the API doesn't have some compositions:
- They might be stored separately
- Contact maintainers: https://github.com/shabados/database/issues
- Fall back to Archive.org OCR extraction

---

## Contact for Help:

- **ShabadOS**: https://github.com/shabados/database/issues
- **KhalisFoundation**: https://khalisfoundation.org/
- **SikhiToTheMax**: https://www.sikhitothemax.org/about

