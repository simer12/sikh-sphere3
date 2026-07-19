# 🚀 QUICK START GUIDE - SikhSphere App

## ⚡ Start the App in 30 Seconds

### Step 1: Open PowerShell Here
- Right-click in this folder
- Select "Open in Terminal" or "Open PowerShell window here"

### Step 2: Run This Command
```powershell
npm start
```

### Step 3: Choose Your Platform

When you see the Expo menu, press:
- **`a`** - Open on Android emulator (if you have Android Studio)
- **`i`** - Open on iOS simulator (Mac only, requires Xcode)
- **Or scan QR code** with Expo Go app on your phone

---

## 📱 Easiest Method: Use Your Phone

### Android Users:
1. Install **Expo Go** from Play Store
2. Run `npm start` on your computer
3. Open Expo Go app
4. Tap "Scan QR Code"
5. Scan the QR from your computer screen
6. App loads instantly! 🎉

### iOS Users:
1. Install **Expo Go** from App Store  
2. Run `npm start` on your computer
3. Open Camera app (not Expo Go)
4. Point at the QR code
5. Tap the notification to open in Expo Go
6. App loads instantly! 🎉

---

## 🎯 What to Explore

### 1. Home Tab 🏠
- See today's Gurbani quote
- Quick access to all features
- Prayer timings

### 2. Nitnem Tab 📖
- Browse all 7 daily prayers
- Tap any Bani to read
- See Gurmukhi + translations
- Play audio (if available)
- Mark verses as completed

### 3. Live Kirtan Tab 🎧
- Live from Golden Temple
- Other Gurdwara streams
- Kirtan playlists
- Background playback

### 4. Hukamnama Tab 📰
- Today's Hukamnama
- Full translations
- Teeka (explanation)
- Share on WhatsApp/social

### 5. More Tab ⋮
- **Calendar**: Sikh dates & Gurpurabs
- **Find Gurdwara**: Map with locations
- **Learn Gurmukhi**: Interactive lessons
- **About Sikhism**: Gurus & concepts

---

## ✅ First-Time Setup Checklist

- [ ] Node.js installed? Check: `node --version`
- [ ] In correct folder? Check: Look for `package.json`
- [ ] Dependencies installed? Run: `npm install`
- [ ] Start server: `npm start`
- [ ] Expo Go installed on phone? Get it from app store
- [ ] Connected to same WiFi? (phone and computer)

---

## 🔧 Troubleshooting

### Problem: "npm not found"
**Solution**: Install Node.js from https://nodejs.org/

### Problem: "Port already in use"
**Solution**: 
```powershell
npx expo start --port 8081
```

### Problem: "Expo Go can't connect"
**Solution**: 
- Make sure phone and computer on same WiFi
- Try clicking "Tunnel" in Expo menu
- Or use QR code from expo.dev website

### Problem: "Module not found"
**Solution**: 
```powershell
rm -rf node_modules
npm install
```

### Problem: Can't see QR code
**Solution**: Look in the browser window that opens automatically

---

## 🎨 Customization Ideas

### Change Colors:
Edit `src/theme.ts` and change:
```typescript
primary: '#FF9933',  // Your color here
secondary: '#000080', // Your color here
```

### Add More Banis:
Edit `src/data/banis.ts` and add to the `nitnemBanis` array

### Add Gurdwara Locations:
Edit `src/screens/GurdwaraFinderScreen.tsx` and add to `gurdwaras` array

---

## 📦 Build for Production

### Create Android APK:
```powershell
npm install -g eas-cli
eas build --platform android
```

### Create iOS IPA:
```powershell
eas build --platform ios
```

---

## 🆘 Need Help?

1. Check `SETUP.md` for detailed instructions
2. Check `README.md` for full documentation
3. Check `PROJECT_SUMMARY.md` for what's included
4. Make sure all files are in the folder
5. Try restarting PowerShell

---

## 🎉 Enjoy the App!

**Remember**: First time might take 2-3 minutes to load as it downloads dependencies on your phone.

**Tip**: Keep `npm start` running in the terminal. Don't close it!

---

**ੴ Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh ੴ**

Made with ❤️ for the Sikh community
