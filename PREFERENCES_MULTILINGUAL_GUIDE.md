# Multilingual Support & Preferences Implementation

## ✅ What's Been Implemented

### 1. **PreferencesContext** (`src/contexts/PreferencesContext.tsx`)
Global state management for user preferences:
- **Font Size**: 14, 16, 18, 20px options
- **Language**: English (en) / Punjabi (pa)
- **Dark Mode**: UI ready (implementation pending)
- **Auto-play Audio**: Boolean toggle
- **Download on WiFi**: Boolean toggle
- **Local Storage**: Works for guest users
- **Supabase Sync**: Saves to database for logged-in users

### 2. **Translation System** (`src/i18n/translations.ts`)
Complete bilingual support:
- **200+ translated strings** in English & Punjabi
- Navigation labels, screen titles, common actions
- Bani names, calendar events, messages
- Easily extensible for more languages

### 3. **AppText Component** (`src/components/AppText.tsx`)
Smart text component that respects font size:
- **Variants**: default, title, subtitle, caption, body
- **Auto-scales**: Based on user's font size preference
- **Drop-in replacement** for React Native Text

### 4. **useApp Hook** (`src/hooks/useApp.ts`)
Convenient hook combining preferences and translations:
```typescript
const { t, fontSize, language, darkMode } = useApp();
```

## 🔧 Usage Examples

### Using Translations
```typescript
import { useApp } from '../hooks/useApp';

const MyScreen = () => {
  const { t } = useApp();
  
  return (
    <View>
      <Text>{t.home}</Text>
      <Text>{t.nitnem}</Text>
      <Text>{t.dailyHukamnama}</Text>
    </View>
  );
};
```

### Using AppText with Font Size
```typescript
import { AppText } from '../components/AppText';

const MyScreen = () => {
  return (
    <View>
      <AppText variant="title">This is a title</AppText>
      <AppText variant="body">This is body text</AppText>
      <AppText variant="caption">Small caption text</AppText>
    </View>
  );
};
```

### Accessing Preferences Directly
```typescript
import { usePreferences } from '../contexts/PreferencesContext';

const MyScreen = () => {
  const { preferences, updatePreference } = usePreferences();
  
  // Change font size
  updatePreference('fontSize', 18);
  
  // Change language
  updatePreference('language', 'pa');
  
  // Current values
  console.log(preferences.fontSize); // 16
  console.log(preferences.language); // 'en'
};
```

## 📱 How It Works

### 1. **Context Providers Wrap App**
```typescript
// App.tsx
<AuthProvider>
  <PreferencesProvider>  {/* ← Loads user preferences */}
    <BookmarksProvider>
      <ReadingHistoryProvider>
        <PaperProvider>
          <AppNavigator />
        </PaperProvider>
      </ReadingHistoryProvider>
    </BookmarksProvider>
  </PreferencesProvider>
</AuthProvider>
```

### 2. **Preferences Load Automatically**
- **Guest Users**: Loads from localStorage
- **Logged-in Users**: Loads from Supabase `user_preferences` table
- **Auto-sync**: Changes save to both local and database

### 3. **Language Switching**
When user changes language in Preferences:
1. `updatePreference('language', 'pa')` called
2. Context updates state
3. All screens using `useApp()` re-render with new translations
4. Preference saved to database (if logged in)

### 4. **Font Size Scaling**
When user changes font size:
1. `updatePreference('fontSize', 18)` called
2. All `<AppText>` components auto-scale
3. Variants adjust relative to base size:
   - `title`: baseFontSize + 8
   - `subtitle`: baseFontSize + 4
   - `caption`: baseFontSize - 2
   - `body`: baseFontSize (with lineHeight)

## 🌍 Available Translations

### Navigation
- `home`, `nitnem`, `dasamGranth`, `history`, `more`, `profile`

### Common Actions
- `loading`, `save`, `cancel`, `delete`, `edit`, `back`, `search`, `close`
- `yes`, `no`, `ok`

### Screen Labels
- `dailyHukamnama`, `liveKirtan`, `sikhCalendar`, `gurpurab`
- `readingHistoryTitle`, `bookmarksTitle`, `notificationsTitle`

### Banis
- `japjiSahib`, `jaapSahib`, `tavPrasadSavaiye`, `chaupaiSahib`
- `anandSahib`, `rehrasSahib`, `kirtanSohila`

### Settings
- `fontSize`, `small`, `medium`, `large`, `extraLarge`
- `darkMode`, `language`, `primaryLanguage`
- `autoPlay`, `wifiOnly`, `resetToDefault`

### Messages
- `signInRequired`, `comingSoon`, `error`, `success`
- `noHistory`, `noBookmarks`, `startReading`

## 🔄 Migration Guide

### Updating Existing Screens

**Before:**
```typescript
<Text style={styles.title}>Daily Hukamnama</Text>
<Text style={styles.body}>This is some text</Text>
```

**After (with translation):**
```typescript
import { useApp } from '../hooks/useApp';

const { t } = useApp();
<Text style={styles.title}>{t.dailyHukamnama}</Text>
<Text style={styles.body}>This is some text</Text>
```

**After (with AppText + translation):**
```typescript
import { AppText } from '../components/AppText';
import { useApp } from '../hooks/useApp';

const { t } = useApp();
<AppText variant="title">{t.dailyHukamnama}</AppText>
<AppText variant="body">This is some text</AppText>
```

## 🎯 Currently Applied To

✅ **PreferencesScreen**: Fully translated with working font size and language toggle  
✅ **ProfileScreen**: Menu items translated  
⏳ **HomeScreen**: Ready for translation  
⏳ **NitnemScreen**: Ready for translation  
⏳ **Other screens**: Can be updated incrementally

## 🚀 Next Steps

1. **Test Both Languages**: Switch between English/Punjabi in Preferences
2. **Test Font Sizes**: Try all 4 font size options
3. **Update More Screens**: Gradually migrate screens to use translations
4. **Add More Translations**: Extend `translations.ts` as needed
5. **Implement Dark Mode**: When ready, hook up to theme system

## 📝 Adding New Translations

```typescript
// src/i18n/translations.ts

export interface Translations {
  // ... existing
  myNewLabel: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // ... existing
    myNewLabel: 'My New Label',
  },
  pa: {
    // ... existing
    myNewLabel: 'ਮੇਰਾ ਨਵਾਂ ਲੇਬਲ',
  },
};
```

## 🐛 Troubleshooting

**Preferences not saving:**
- Check user is logged in (guest users use localStorage only)
- Verify RLS is disabled on `user_preferences` table
- Check console for errors

**Language not changing:**
- Make sure screen uses `useApp()` hook
- Verify translation key exists in `translations.ts`
- Check PreferencesProvider is wrapping app properly

**Font size not applying:**
- Use `<AppText>` component instead of `<Text>`
- Or manually read `fontSize` from `useApp()` hook
- Verify PreferencesProvider is loaded

## 📊 Database Schema

Preferences saved to `user_preferences` table:
```sql
- user_id (text, primary key)
- font_size (integer, default 16)
- dark_mode (boolean, default false)
- language (text, default 'en')
- notifications (boolean, default true)
- auto_play (boolean, default false)
- download_on_wifi (boolean, default true)
- created_at, updated_at (timestamps)
```

## 🎉 Result

Users can now:
- ✅ Choose font size (Small/Medium/Large/Extra Large)
- ✅ Switch language (English/Punjabi)
- ✅ Toggle audio auto-play
- ✅ Control download behavior (WiFi only)
- ✅ See preferences persist across app restarts
- ✅ Works for both guests and logged-in users
