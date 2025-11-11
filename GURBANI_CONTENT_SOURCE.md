# Complete & Accurate Gurbani Content Sources

## Current Status
The app now supports verse-by-verse Bani structure. A sample Japji Sahib with 5 Pauris is in `/src/data/banis/japji-sahib.json`.

## For Complete, Authentic Gurbani Content:

### ✅ Recommended Option 1: SikhNet API (Best)
```
API: https://api.sikhnet.com/
- Complete Nitnem Banis
- Authenticated by SGPC
- Real-time updates
- Free for non-commercial use
```

**Integration Steps:**
1. Sign up at https://www.sikhnet.com/api
2. Get API key
3. Use endpoints:
   - `/banis` - List all banis
   - `/banis/{id}` - Get complete bani with translations
   - `/hukamnama` - Daily Hukamnama

### ✅ Recommended Option 2: SearchGurbani.com API
```
API: https://www.searchgurbani.com/
- Complete SGGS database
- Multiple translations
- Free access
```

**Integration Steps:**
1. Use their public API
2. Endpoints available at: https://www.searchgurbani.com/api/
3. Returns JSON with Gurmukhi, transliteration, and translations

### ✅ Option 3: BaniDB.com
```
Website: https://www.banidb.com/
- Complete Sundar Gutka
- All Nitnem Banis
- Multiple formats (JSON available)
```

### ✅ Option 4: iGurbani.com Database
```
Website: https://www.igurbani.com/
- Comprehensive Gurbani database
- Download section available
- Can export to JSON
```

### ✅ Option 5: Manual from SGPC Sources
**Complete Japji Sahib** (38 Pauris):
- Source: SGPC official website
- Download: https://www.sgpc.net/prayers/
- Contains: Mool Mantar + 38 Pauris + Shalok

**Other Nitnem Banis:**
1. **Jaap Sahib** - 199 verses (from Dasam Granth)
2. **Tav-Prasad Savaiye** - 10 Savaiye
3. **Chaupai Sahib** - From Dasam Granth
4. **Anand Sahib** - 40 Pauris (from SGGS p.917)
5. **Rehras Sahib** - Evening prayer compilation
6. **Kirtan Sohila** - Bedtime prayer (5 Shabads)

## File Structure (Already Created)
```
/src/data/banis/
├── japji-sahib.json ✅ (partial - 5 Pauris)
├── jaap-sahib.json ⏳ (to be added)
├── tav-prasad-savaiye.json ⏳ (to be added)
├── chaupai-sahib.json ⏳ (to be added)
├── anand-sahib.json ⏳ (to be added)
├── rehras-sahib.json ⏳ (to be added)
└── kirtan-sohila.json ⏳ (to be added)
```

## JSON Format (Already Implemented)
```json
{
  "id": "1",
  "name": "Japji Sahib",
  "nameGurmukhi": "ਜਪੁਜੀ ਸਾਹਿਬ",
  "description": "Morning prayer",
  "time": "Morning (Amrit Vela)",
  "duration": "15-20 mins",
  "author": "Guru Nanak Dev Ji",
  "location": "SGGS Page 1-8",
  "verses": [
    {
      "id": "mool-mantar",
      "section": "Mool Mantar",
      "gurmukhi": "ੴ ਸਤਿ ਨਾਮੁ...",
      "transliteration": "Ik Oankaar...",
      "english": "One Universal Creator...",
      "hindi": "एक ओंकार...",
      "punjabi": "ੴ ਸਤਿ ਨਾਮੁ..."
    }
    // ... more verses
  ]
}
```

## Next Steps

### Option A: Use API (Recommended for Production)
1. Install axios: `npm install axios`
2. Create `/src/services/gurbaniAPI.ts`
3. Fetch banis dynamically from SikhNet/SearchGurbani
4. Cache in AsyncStorage for offline use

### Option B: Complete JSON Files Manually
1. Go to https://www.searchgurbani.com/ or https://www.banidb.com/
2. Copy complete Gurbani text with translations
3. Format into JSON following the structure in `japji-sahib.json`
4. Repeat for all 7 Nitnem banis
5. Total estimated lines: ~15,000-20,000 lines of JSON

### Option C: Hybrid Approach
1. Keep essential banis (Japji, Jaap, Chaupai) as local JSON
2. Load others from API with offline caching
3. Best of both worlds: fast startup + complete content

## Translations Quality
For accurate translations, use:
- **English**: Sant Singh Khalsa (SearchGurbani.com)
- **Punjabi**: Prof. Sahib Singh
- **Hindi**: SGPC official translations

## Copyright & Usage
- All Gurbani is public domain
- Translations may have copyright - verify source
- For commercial apps, credit sources properly
- SGPC guidelines: Use respectfully, maintain accuracy

## Contact for Help
- SGPC: info@sgpc.net
- SikhNet: info@sikhnet.com
- SearchGurbani: contact@searchgurbani.com

---

**Current Implementation:**
✅ Data structure ready
✅ Interface supports verse-by-verse
✅ Sample Japji Sahib (5 Pauris)
✅ BaniDetailScreen updated to handle verses
⏳ Need complete content for all 7 banis

**Recommended:** Use SikhNet API for authentic, maintained content.
