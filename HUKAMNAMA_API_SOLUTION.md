# Hukamnama API Solution

## Summary

✅ **Created a custom Hukamnama service** that fetches data directly from the official SGPC website (https://hs.sgpc.net/)

## What Was Done

### 1. API Research
- ❌ `hukamnama-json` package - **NOT WORKING** (deprecated, SGPC website changed)
- ❌ `api.sikhjs.com` - **NOT WORKING** (domain doesn't exist)
- ❌ Most third-party APIs are either down or unreliable

### 2. Custom Solution Created
Created a new service file: `src/services/hukamnama.ts`

**Features:**
- Fetches HTML directly from official SGPC website
- Parses the HTML to extract:
  - Date
  - Gurmukhi text
  - Punjabi translation (ਪੰਜਾਬੀ ਵਿਆਖਿਆ)
  - English translation
  - Ang (page number)
  - Raag information
- Error handling with fallback messages
- TypeScript interfaces for type safety

### 3. Updated HukamnamaScreen
- Integrated the new SGPC scraper service
- Added Raag display
- Conditional rendering for optional fields (transliteration, Hindi)
- Better error messages
- Pull-to-refresh functionality

## How It Works

```typescript
// Fetch Hukamnama
const data = await fetchHukamnamaFromSGPC();

// Returns:
{
  date: "Monday, November 11, 2025",
  gurmukhi: "ਸੂਖ ਮੰਗਲ ਕਲਿਆਣ...",
  punjabi: "(ਹੇ ਭਾਈ! ਜੇਹੜਾ ਭੀ...",
  english: "I have been blessed with peace...",
  reference: "Guru Granth Sahib Ji, Ang 619",
  ang: "619",
  raag: "ਸੋਰਠਿ ਮਹਲਾ ੫"
}
```

## Advantages

✅ Uses **official SGPC source** - most reliable
✅ **No third-party API dependency** - won't break if APIs go down
✅ **Always up-to-date** - fetches directly from Golden Temple's website
✅ **Free** - no API keys or rate limits
✅ **TypeScript** - type-safe implementation

## Limitations

⚠️ **Web scraping** - If SGPC changes their HTML structure, the parser may need updates
⚠️ **No transliteration** - SGPC doesn't provide transliteration
⚠️ **Requires internet** - Must fetch fresh data each time (consider adding caching)

## Future Improvements

1. **Add caching** - Store today's Hukamnama locally to reduce network calls
2. **Historical data** - Add ability to view previous days' Hukamnama
3. **Offline support** - Cache the last successfully fetched Hukamnama
4. **Audio playback** - SGPC provides audio URLs that could be integrated
5. **PDF download** - SGPC offers PDF versions

## Testing

Run your app with:
```bash
npm start
```

Then navigate to the Hukamnama screen to see the live data from SGPC.

## Files Modified

1. ✅ `src/services/hukamnama.ts` - NEW - Custom scraper service
2. ✅ `src/screens/HukamnamaScreen.tsx` - UPDATED - Uses new service
3. ✅ Added Raag display and conditional rendering

---

**Note:** This solution directly scrapes the SGPC website which is legal for personal/educational use. If you plan to serve this data to many users, consider caching it on your own backend to reduce load on SGPC's servers.
