# SikhSphere - Complete Sikh Religious App

A comprehensive React Native Expo app for the Sikh community.

## Features

### 📖 Daily Banis (Nitnem)
- Japji Sahib, Jaap Sahib, Chaupai Sahib, Anand Sahib, Rehras Sahib, Kirtan Sohila
- Complete Gurmukhi text with English translations

### 📅 Nanakshahi Calendar
- **104 Complete Events** for Nanakshahi Year 557 (2025-2026)
- All Sangrand, Masia, Puranmasi
- All 10 Guru Parkash/Gurgaddi/Joti Jot dates
- Major Shaheedi, Festivals, Historical events

### 📜 Daily Hukamnama
- Live from Sri Harmandir Sahib (SGPC official)
- Gurmukhi, Punjabi, and English translations

### 🕌 Gurdwara Finder
- Google Places API with 130+ locations
- All 5 Takhts with priority coverage
- Map view with auto-load

### 📚 Learn Sikhism & History
- 10 Gurus, Core beliefs, 5 Takhts
- Complete timeline from 1469 to present

## Tech Stack
- React Native + Expo SDK 54
- TypeScript
- Google Places API
- SGPC & SikhNet APIs

## Installation

```bash
npm install
npx expo start
```

## Credits
- **Developer**: Harsimer Singh (harsimerramgharia@gmail.com)
- **GitHub**: [@simer12](https://github.com/simer12)

**Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh** 🙏

# SikhSphere - Complete Sikh Spiritual Companion App

**ੴ Ik Onkar**

A comprehensive cross-platform (Android & iOS) mobile application for Sikhs worldwide, connecting spirituality, community, learning, and service.

## 🌟 Features (Phase 1)

### 1. **Nitnem & Gurbani Section** 📖
- Complete daily prayers (Nitnem Banis) including:
  - Japji Sahib
  - Jaap Sahib
  - Tav-Prasad Savaiye
  - Chaupai Sahib
  - Anand Sahib
  - Rehras Sahib
  - Kirtan Sohila
- Original Gurmukhi text with transliteration
- Multiple translations (English, Hindi, Punjabi)
- Audio playback with synchronized text
- Offline access & bookmarking
- Track completion of daily prayers

### 2. **Live Gurbani & Kirtan** 🎧
- Live stream from Sri Harmandir Sahib (Golden Temple)
- Live streams from other prominent Gurdwaras
- Kirtan playlists by Raag and artist
- Background audio playback
- Sleep timer functionality

### 3. **Daily Hukamnama** 📰
- Live Hukamnama from Sri Harmandir Sahib
- Complete translations (English, Hindi, Punjabi)
- Detailed Teeka (explanation)
- Share on social media (WhatsApp, Facebook, etc.)

### 4. **Sikh Calendar (Nanakshahi)** 📅
- All Gurpurabs (birth anniversaries of Gurus)
- Martyrdom days
- Historical Sikh dates
- Event notifications
- Local Gurdwara events integration

### 5. **Gurdwara Finder** 📍
- GPS-based map of nearby Gurdwaras
- Get directions to any Gurdwara
- Contact information and timings
- Event schedules

### 6. **Daily Motivation/Quote** 💬
- Daily Gurbani quote with translation
- Share quotes on social media
- Random verse generator

### 7. **Learn Punjabi/Gurmukhi** 🎓
- Interactive Gurmukhi alphabet lessons
- Pronunciation guides with audio
- Vocabulary building exercises
- Quizzes and gamified learning
- Progress tracking

### 8. **About Sikhism Section** 📚
- Life stories of all Ten Gurus
- Major historical events
- Sikh concepts explained:
  - Ik Onkar
  - Seva
  - Langar
  - Rehat Maryada
- Children's corner with simplified stories

## 🎨 Design Features

- **Colors**: Saffron (#FF9933) and Navy Blue (#000080) theme
- **Typography**: Gurmukhi-friendly fonts
- **Dark Mode**: Full dark theme support
- **Bilingual**: English and Gurmukhi toggle
- **Clean UI**: Minimal, serene aesthetic
- **Accessibility**: Large fonts, high contrast

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Library**: React Native Paper
- **Navigation**: React Navigation
- **Maps**: React Native Maps
- **Audio**: Expo AV
- **Storage**: AsyncStorage for offline data
- **Icons**: Ionicons

## 📱 Platforms Supported

- ✅ Android (6.0+)
- ✅ iOS (12.0+)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- For Android: Android Studio or physical device
- For iOS: Xcode (macOS only) or physical device

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on Android:**
   ```bash
   npm run android
   ```

4. **Run on iOS (macOS only):**
   ```bash
   npm run ios
   ```

5. **Scan QR code with Expo Go app (easiest method):**
   - Install "Expo Go" from Play Store (Android) or App Store (iOS)
   - Scan the QR code shown in terminal or browser
   - App will load on your device

### Building for Production

**Android APK:**
```bash
eas build --platform android --profile preview
```

**iOS IPA:**
```bash
eas build --platform ios --profile preview
```

## 📂 Project Structure

```
sikhsphere/
├── App.tsx                 # Main app entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
└── src/
    ├── theme.ts           # App theme (colors, styling)
    ├── data/
    │   └── banis.ts       # Gurbani data, Gurus info, quotes
    └── screens/
        ├── HomeScreen.tsx              # Home dashboard
        ├── NitnemScreen.tsx            # List of daily prayers
        ├── BaniDetailScreen.tsx        # Individual Bani reader
        ├── LiveKirtanScreen.tsx        # Live Kirtan streams
        ├── HukamnamaScreen.tsx         # Daily Hukamnama
        ├── CalendarScreen.tsx          # Sikh calendar
        ├── GurdwaraFinderScreen.tsx    # Find nearby Gurdwaras
        ├── LearnScreen.tsx             # Learn Gurmukhi
        ├── AboutSikhismScreen.tsx      # About Sikhism
        └── GuruDetailScreen.tsx        # Individual Guru details
```

## 🔮 Future Enhancements (Phase 2 & 3)

- Community & Seva features
- Virtual Gurdwara 360° tours
- AI Chatbot (Granthi) for Q&A
- Youth & Kids zone with games
- Health integration with Seva camps
- Virtual Akhand Paath booking
- Global Sikh directory
- Offline audio packs
- Push notifications for prayer times
- Multi-language support (Spanish, French, etc.)

## 📖 Content Sources

All Gurbani content is sourced from:
- Sri Guru Granth Sahib Ji
- SGPC (Shiromani Gurdwara Parbandhak Committee)
- SikhNet
- SearchGurbani.com

## 🙏 Credits

- **Concept & Development**: Built with love for the Sikh community
- **Gurbani Source**: SGPC, SikhNet
- **Icons**: Ionicons
- **Fonts**: System fonts with Gurmukhi support

## 📄 License

This project is created for educational and community service purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📧 Support

For support, please open an issue in the repository.

---

**ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ, ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਹਿ**

*Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh*
