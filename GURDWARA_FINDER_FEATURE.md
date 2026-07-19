# Worldwide Gurdwara Finder Feature

## What's New

✅ **Comprehensive worldwide Gurdwara database**
✅ **Real-time data from OpenStreetMap**
✅ **Search functionality**
✅ **Location-based discovery**

## Features

### 1. **OpenStreetMap Integration**
- Fetches ALL Gurdwaras from OpenStreetMap's global database
- Real-time, up-to-date information
- Community-maintained data
- Covers every continent

### 2. **Famous Gurdwaras Pre-loaded**
- All 5 Takhts (Sikh religious seats)
  - Akal Takht Sahib (Amritsar)
  - Sri Harmandir Sahib - Golden Temple (Amritsar)
  - Takht Sri Keshgarh Sahib (Anandpur Sahib)
  - Takht Sri Damdama Sahib (Bathinda)
  - Takht Sri Patna Sahib (Patna)
- Major historical Gurdwaras
- Important pilgrimage sites

### 3. **Smart Search**
- Search by name
- Search by location
- Worldwide coverage
- Instant results

### 4. **Location Features**
- Shows nearby Gurdwaras within 100km
- User location on map
- Distance calculation
- Navigation integration

### 5. **Rich Information**
- Gurdwara name (English & Gurmukhi)
- Full address with city & country
- Phone numbers (when available)
- Website links
- Historical information
- Special badges for Takhts

## Data Sources

1. **OpenStreetMap Overpass API**
   - Query: `amenity=place_of_worship` + `religion=sikh`
   - Global coverage
   - Constantly updated by community

2. **Curated Famous Gurdwaras**
   - Hand-picked important sites
   - Verified information
   - Historical significance

## How It Works

### On App Launch:
1. Requests location permission
2. Gets user's current location
3. Fetches nearby Gurdwaras from OpenStreetMap (100km radius)
4. Combines with famous Gurdwaras list
5. Removes duplicates
6. Displays on map and list

### Search:
1. User types search query
2. Queries OpenStreetMap for matching Gurdwaras worldwide
3. Returns up to 50 results
4. Updates map and list

### Map Markers:
- 🟠 Orange marker = Regular Gurdwara
- 🟡 Gold marker = Takht Sahib (special badge)

## Technical Details

### API Endpoint
```
https://overpass-api.de/api/interpreter
```

### Query Example
```
[out:json];
(
  node["amenity"="place_of_worship"]["religion"="sikh"](around:50000,lat,lon);
  way["amenity"="place_of_worship"]["religion"="sikh"](around:50000,lat,lon);
);
out center;
```

### Coverage
- **Worldwide**: All continents
- **Countries**: 50+ countries with Gurdwaras
- **Total Gurdwaras**: Thousands (depends on OSM data)

## Countries Covered

### Major Concentrations:
- 🇮🇳 India (Punjab, Delhi, Haryana, etc.)
- 🇵🇰 Pakistan (Nankana Sahib, Lahore, etc.)
- 🇬🇧 United Kingdom
- 🇨🇦 Canada
- 🇺🇸 United States
- 🇦🇺 Australia
- 🇸🇬 Singapore
- 🇲🇾 Malaysia
- 🇹🇭 Thailand
- 🇰🇪 Kenya
- And many more...

## Future Enhancements

- [ ] Add Gurdwara photos
- [ ] Add Gurdwara timings
- [ ] Add nearby facilities (parking, accommodation)
- [ ] Add user reviews/ratings
- [ ] Add events calendar
- [ ] Add audio guides
- [ ] Offline mode with cached data

## Files Modified

1. ✅ `src/services/gurdwara.ts` - NEW - Gurdwara database service
2. ✅ `src/screens/GurdwaraFinderScreen.tsx` - UPDATED - Enhanced UI with search

---

**Note**: Data quality depends on OpenStreetMap community contributions. Users can contribute to OSM to improve data accuracy.
