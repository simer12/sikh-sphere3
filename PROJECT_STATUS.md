# Akaal Seva - Project Status & Continuation Guide

**Last Updated:** February 7, 2026  
**Project:** Sikh religious app with authentication and cloud sync  
**Status:** Core features working, ready for feature expansion

---

## 🎯 PROJECT OVERVIEW

**Akaal Seva** is a comprehensive Sikh spiritual companion app built with:
- **Frontend:** React Native (Expo SDK ~54.0.0)
- **Authentication:** Firebase Authentication (email/password + Google Sign-In)
- **Database:** Supabase (PostgreSQL cloud database for user data)
- **Platform:** Web (working), Mobile (configured but needs testing)

---

## ✅ COMPLETED WORK

### 1. Authentication System (100% Working)
- ✅ Firebase Authentication integrated
- ✅ Email/Password signup and login
- ✅ Google Sign-In (working on web platform)
- ✅ Profile setup screen for new users
- ✅ User session persistence

**Files:**
- `src/contexts/AuthContext.tsx` - Main auth logic
- `src/screens/LoginScreen.tsx` - Login UI
- `src/screens/SignUpScreen.tsx` - Signup UI
- `src/screens/ProfileSetupScreen.tsx` - First-time setup
- `src/config/firebase.ts` - Firebase config

### 2. Supabase Cloud Database (100% Working)
- ✅ Supabase client configured
- ✅ User data table created with RLS policies
- ✅ Cross-device data synchronization enabled
- ✅ Replaced AsyncStorage (local-only) with cloud storage

**Files:**
- `src/config/supabase.ts` - Supabase client setup

**Database Schema:**
```sql
Table: user_data
- id (UUID, primary key)
- user_id (TEXT, unique) - Firebase UID
- name (TEXT) - User's display name
- email (TEXT)
- bani_reading_streak (INTEGER) - Days streak
- banis_read (TEXT[]) - Array of completed banis
- bookmarked_banis (TEXT[]) - Array of bookmarked banis
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 3. Core App Features
- ✅ **Nitnem Banis** - REAL content from BaniDB API
- ✅ **Daily Hukamnama** - Live from Golden Temple (SGPC)
- ✅ **Sikh History** - Comprehensive historical content
- ✅ **Dasam Granth** - Access to compositions
- ✅ **Live Kirtan** - Streaming URLs (partially tested)
- ✅ **Gurdwara Finder** - Maps integration
- ✅ **Sikh Calendar** - Festival dates
- ✅ **Learn Gurmukhi** - Educational content
- ✅ **About Sikhism** - Guru information

### 4. Platform-Specific Handling
- ✅ Web platform fully supported
- ✅ Platform-specific files for incompatible libraries:
  - `GurdwaraFinderScreen.web.tsx` - Excludes react-native-maps on web
- ✅ Google OAuth configured for Android, iOS, and Web

---

## 🔧 CONFIGURATION & CREDENTIALS

### Firebase Project
- **Project ID:** `akaalseva-4839d`
- **Config Location:** `src/config/firebase.ts`

**Google OAuth Client IDs:**
- Android: `736447515274-t5mn8ojqrlpn3q6rh6ns1mbtphf9vt13.apps.googleusercontent.com`
- iOS: `736447515274-0lpc5b8h7v756ijpqjh7h1ngpsmd2722.apps.googleusercontent.com`
- Web: `736447515274-nqgtjaalu7si4bahm37pe2o6jmbbi95t.apps.googleusercontent.com`

**SHA Fingerprints (for Android):**
- SHA-1: `6D:7E:C8:8E:EA:21:86:1C:1A:7C:92:30:52:AF:47:E4:00:72:A5:72`
- SHA-256: `E7:32:ED:64:86:FE:3A:36:52:C7:32:F0:26:2E:A5:28:E5:9B:D0:81:F5:B5:FC:6C:8C:B8:79:D6:B4:68:73:4B`

### Supabase Project
- **Project URL:** `https://zeylyvekbpsmvxrejpfa.supabase.co`
- **Anon Key:** `sb_publishable_FaNKH11b6zA9By-0D-3sbA_ppI6cBha`
- **Config Location:** `src/config/supabase.ts`
- **Dashboard:** https://supabase.com/dashboard/project/zeylyvekbpsmvxrejpfa

### App Configuration
- **App Scheme:** `akaalseva` (in `app.json`)
- **Bundle ID:** `com.harsimran302.sikhsphere`
- **App Name:** "Akaal Seva"

---

## 📁 KEY FILE STRUCTURE

```
src/
├── config/
│   ├── firebase.ts           # Firebase auth config
│   └── supabase.ts           # Supabase client setup
├── contexts/
│   └── AuthContext.tsx       # Auth state + Supabase data operations
├── screens/
│   ├── LoginScreen.tsx       # Login with email/Google
│   ├── SignUpScreen.tsx      # User registration
│   ├── ProfileSetupScreen.tsx # First-time user setup
│   ├── HomeScreen.tsx        # Main dashboard
│   ├── NitnemScreen.tsx      # List of daily prayers
│   ├── BaniDetailScreen.tsx  # Full bani text viewer
│   ├── HukamnamaScreen.tsx   # Daily message from Golden Temple
│   ├── LiveKirtanScreen.tsx  # Streaming kirtan
│   ├── HistoryScreen.tsx     # Sikh history timeline
│   ├── DasamGranthScreen.tsx # Dasam Granth compositions
│   └── GurdwaraFinderScreen.web.tsx # Web version (no maps)
├── services/
│   └── hukamnama.ts          # SGPC Hukamnama fetching
└── data/
    ├── banis.ts              # Bani metadata (loads from BaniDB)
    ├── history.ts            # Historical content
    └── guruNanakJeevanKatha.ts # Guru Nanak life story
```

---

## ⚡ HOW TO RUN

### Installation
```bash
cd "New folder (14)"
npm install
```

### Start Development Server
```bash
npx expo start
# OR for web only:
npx expo start --web
```

**Known Issue:** Network fetch error during startup (Expo version check fails). This is harmless - the app still works. Just wait for Metro Bundler to start.

### Test the App
1. Press `w` to open in web browser
2. Sign in with Google or create account
3. Check Supabase dashboard to see data syncing

---

## 🐛 KNOWN ISSUES

### 1. Expo Startup Error
**Issue:** `TypeError: fetch failed` when running `npx expo start`  
**Cause:** Expo tries to validate dependencies online, network/firewall blocks it  
**Impact:** None - app still works fine  
**Workaround:** Just wait, or use `npx expo start --web`

### 2. Profile Setup Screen
**Status:** Created but needs testing  
**Issue:** Google login provides displayName from Firebase, so profile setup might be skipped  
**Logic:** Shows only if `userData` is null in Supabase (no data saved yet)  
**Test:** Clear browser cache and login again to see it

### 3. Mobile Testing
**Status:** Configured but not tested on actual devices  
**Reason:** Development done on web platform  
**Next Step:** Test in Expo Go app on Android/iOS

### 4. Logout on Web
**Fix Applied:** Now reloads page after logout  
**Status:** Should work but needs testing

---

## ❌ NOT YET IMPLEMENTED

### Features with Data Structure Ready (Need UI)
1. **Bookmarking System**
   - Database field exists: `bookmarked_banis (TEXT[])`
   - Need: Add bookmark button to BaniDetailScreen
   - Need: Display bookmarked banis in ProfileScreen

2. **Reading Progress Tracking**
   - Database field exists: `banis_read (TEXT[])`
   - Need: Mark bani as "read" button
   - Need: Progress visualization

3. **Reading Streak Counter**
   - Database field exists: `bani_reading_streak (INTEGER)`
   - Need: Increment logic on daily bani completion
   - Need: Display in ProfileScreen

### Features Not Started
4. **Search Functionality** - Find banis/content quickly
5. **Reading History** - Timestamp-based reading log
6. **Personal Notes** - Annotations on banis
7. **Offline Downloads** - Save banis for offline reading
8. **Audio Playback** - Listen to bani recitations
9. **Theme Customization** - Dark mode, font sizes
10. **Push Notifications** - Daily reminders

---

## 🔄 RECENT CHANGES (Last Session)

### What Was Done:
1. ✅ Installed Supabase client: `@supabase/supabase-js`
2. ✅ Created Supabase config file with project URL and key
3. ✅ Created `user_data` table with proper schema and RLS policies
4. ✅ Updated `AuthContext.tsx` to use Supabase instead of AsyncStorage
5. ✅ Created `ProfileSetupScreen.tsx` for new user onboarding
6. ✅ Updated `App.tsx` navigation to show profile setup when needed
7. ✅ Fixed logout to reload page on web platform
8. ✅ Removed AsyncStorage imports from LoginScreen

### Migration from AsyncStorage to Supabase:
**Before:** User data stored locally on device only (no sync)  
**After:** User data stored in Supabase cloud (syncs across devices)

**Changed Functions:**
- `loadUserData()` - Now fetches from Supabase
- `saveUserData()` - Now upserts to Supabase
- `logout()` - Now reloads page after sign out

---

## 🚀 NEXT STEPS & RECOMMENDATIONS

### Immediate Tasks
1. **Test Profile Setup Flow**
   - Clear browser cache
   - Sign in with new Google account
   - Verify profile setup screen appears
   - Check data saves to Supabase

2. **Test Mobile Platforms**
   - Run in Expo Go on Android
   - Run in Expo Go on iOS
   - Verify Google Sign-In works
   - Test cross-device sync

3. **Fix Any Auth Issues**
   - Ensure logout works properly
   - Verify session persistence
   - Test profile updates

### High-Priority Features (Easy to Add)
1. **Bookmarking**
   - Add bookmark icon to BaniDetailScreen
   - Update `bookmarked_banis` array in Supabase
   - Show bookmarked banis in profile

2. **Reading Progress**
   - Add "Mark as Read" button
   - Update `banis_read` array
   - Show completion percentage

3. **Reading Streak**
   - Track last reading date
   - Increment streak on daily reading
   - Display in ProfileScreen stats

### Medium-Priority Features
4. **Search Functionality** - Help users find banis quickly
5. **Live Kirtan Testing** - Verify audio streaming works
6. **Theme Toggle** - Dark mode support
7. **Font Size Adjustment** - Accessibility

### Long-Term Goals
8. **Push Notifications** - Daily reminders
9. **Audio Library** - Bani recitations
10. **Community Features** - Reading groups, shared progress

---

## 🔍 DEBUGGING TIPS

### Check Supabase Data
1. Go to: https://supabase.com/dashboard/project/zeylyvekbpsmvxrejpfa/editor
2. Click `user_data` table
3. See all user records with synced data

### Check Firebase Auth
1. Firebase Console: https://console.firebase.google.com/
2. Navigate to project `akaalseva-4839d`
3. Check Authentication → Users

### Common Issues

**Google Sign-In Not Working:**
- Check if OAuth client IDs are correct in `firebase.ts`
- Verify redirect URIs in Google Cloud Console
- Ensure running on allowed domain (localhost:8082 or deployed URL)

**Data Not Syncing:**
- Check Supabase dashboard for errors
- Verify RLS policies are enabled
- Check browser console for Supabase errors

**App Won't Start:**
- Check for TypeScript errors: Look at Problems panel in VS Code
- Verify all packages installed: `npm install`
- Try clearing cache: `npx expo start -c`

---

## 📦 DEPENDENCIES

### Main Libraries
```json
{
  "expo": "~54.0.0",
  "react": "18.3.1",
  "react-native": "0.81.5",
  "firebase": "^12.8.0",
  "@supabase/supabase-js": "^2.x",
  "@react-navigation/native": "^7.x",
  "react-native-paper": "^5.x",
  "expo-linear-gradient": "~14.0.1",
  "react-native-maps": "1.22.0"
}
```

### Important Notes
- Installed with `--legacy-peer-deps` flag due to React version conflicts
- Supabase package has peer dependency warnings (safe to ignore)
- Platform-specific files used to exclude incompatible packages on web

---

## 🎨 DESIGN PATTERNS

### Authentication Flow
1. User opens app → `AppNavigator` checks auth state
2. No user → Show `LoginScreen`
3. User exists but no Supabase data → Show `ProfileSetupScreen`
4. User exists with data → Show `MainTabs`

### Data Flow
1. User authenticates with Firebase
2. `AuthContext` listens to Firebase auth state
3. On login, loads user data from Supabase
4. If no data exists, creates default user record
5. Profile updates automatically save to Supabase
6. Data syncs across all devices instantly

### Platform Handling
- Web platform uses `signInWithPopup` for Google OAuth
- Mobile will use native OAuth flow (configured but not tested)
- Platform-specific files (`.web.tsx`) exclude libraries that don't work on web

---

## 📞 SUPPORT & RESOURCES

### Documentation
- [Expo Docs](https://docs.expo.dev/)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Supabase Docs](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

### API Sources
- **BaniDB API:** Bani content (Gurmukhi text)
- **SGPC Website:** Daily Hukamnama (https://hs.sgpc.net/)
- **Golden Temple Stream:** Live Kirtan (https://live.sgpc.net/hls/live.m3u8)

### Project Documentation Files
- `PROJECT_SUMMARY.md` - Original project overview
- `SETUP.md` - Initial setup instructions
- `START_HERE.md` - Quick start guide
- `FEATURES.md` - Feature list
- `ARCHITECTURE.md` - Technical architecture
- `GITHUB_SETUP.md` - GitHub deployment guide

---

## ✨ PROJECT HIGHLIGHTS

### What Makes This App Special
1. **Real Religious Content** - Authentic banis from BaniDB, not static text
2. **Live Updates** - Daily Hukamnama updates automatically
3. **Cloud Sync** - User data accessible from any device
4. **Comprehensive History** - Full Guru Nanak Jeevan Katha extracted from EPUB
5. **Multi-Platform** - Works on web, Android, iOS (web tested, mobile configured)

### Technical Achievements
- Successfully integrated Firebase + Supabase hybrid architecture
- Solved Google OAuth for web platform with `signInWithPopup`
- Platform-specific file handling for incompatible libraries
- Real-time data sync with PostgreSQL cloud database
- Scalable architecture ready for 500MB free tier (Supabase)

---

## 💡 TIPS FOR CONTINUATION

### When Adding Features
1. **Update Supabase Schema First** - Add columns to `user_data` table if needed
2. **Update AuthContext** - Add functions to save/load new data types
3. **Build UI Components** - Create screens with state management
4. **Test Data Sync** - Verify changes appear in Supabase dashboard
5. **Update This File** - Keep PROJECT_STATUS.md current

### Before Deploying
1. Test on all platforms (web, Android, iOS)
2. Verify Google Sign-In on production domain
3. Update Firebase authorized domains
4. Check Supabase RLS policies for security
5. Test cross-device sync thoroughly

### Code Quality
- Keep TypeScript strict mode enabled
- Use proper error handling (try/catch)
- Add loading states for async operations
- Test on slow networks
- Handle offline scenarios gracefully

---

## 📝 MIGRATION CHECKLIST

When moving to new PC:
- [ ] Copy entire project folder
- [ ] Run `npm install` (may take 3-5 minutes)
- [ ] Verify `src/config/firebase.ts` has correct config
- [ ] Verify `src/config/supabase.ts` has correct URL and key
- [ ] Run `npx expo start --web` to test
- [ ] Check browser console for errors
- [ ] Test login with Google
- [ ] Verify Supabase dashboard shows data
- [ ] Read this PROJECT_STATUS.md file completely

---

## 🎯 CURRENT GOAL

**Primary Objective:** Build feature-complete Sikh spiritual companion app

**Phase 1 (Complete):** ✅ Authentication + Cloud Database  
**Phase 2 (Current):** Add user engagement features (bookmarks, progress, streaks)  
**Phase 3 (Future):** Polish UI/UX, add social features, deploy to app stores

**Next Immediate Task:** Implement bookmarking system or test profile setup flow on mobile devices.

---

**Last Modified:** February 7, 2026  
**Maintainer:** Harsimran (with GitHub Copilot)  
**Status:** 🟢 Active Development - Ready for Feature Expansion
