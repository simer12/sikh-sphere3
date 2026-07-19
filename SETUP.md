# SikhSphere - Quick Setup Guide

## Installation Steps

### Option 1: Using Expo Go (Fastest - Recommended for beginners)

1. **Install Node.js** (if not installed):
   - Download from: https://nodejs.org/
   - Choose LTS version

2. **Open PowerShell in this folder** and run:
   ```powershell
   npm install
   ```

3. **Start the app:**
   ```powershell
   npm start
   ```

4. **Install Expo Go on your phone:**
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

5. **Scan the QR code** shown in the terminal or browser with:
   - Android: Expo Go app
   - iOS: Camera app (then open in Expo Go)

### Option 2: Run on Android Emulator

1. **Install Android Studio:**
   - Download from: https://developer.android.com/studio

2. **Create an Android Virtual Device (AVD)**

3. **Run:**
   ```powershell
   npm install
   npm run android
   ```

### Option 3: Run on Physical Android Device (No Android Studio needed)

1. **Enable Developer Mode** on your Android phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect phone via USB**

3. **Run:**
   ```powershell
   npm install
   npm run android
   ```

## Troubleshooting

### If `npm install` fails:
```powershell
npm cache clean --force
npm install
```

### If you get "Expo CLI not found":
```powershell
npm install -g expo-cli
```

### If port is already in use:
```powershell
npx expo start --port 8081
```

## Features to Test

1. **Home Screen**: See daily quote and feature cards
2. **Nitnem**: Browse daily prayers and read with translations
3. **Live Kirtan**: Check live streams (may need internet)
4. **Hukamnama**: Read today's Hukamnama
5. **More Tab**: Explore Calendar, Gurdwara Finder, Learn, and About sections

## Need Help?

- Check that Node.js is installed: `node --version`
- Check that npm is installed: `npm --version`
- Make sure you're in the correct folder
- Restart PowerShell if commands don't work

Enjoy the app! ੴ
