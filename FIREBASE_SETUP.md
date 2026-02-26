# Firebase Authentication Setup Guide (AsyncStorage Version)

## Overview

This version uses **Firebase Authentication** for user login and **AsyncStorage** for storing user data locally on the device. No Firestore database or billing is required!

**Features:**
- ✅ Email/Password authentication
- ✅ User data saved locally
- ✅ No billing required
- ✅ No credit card needed
- ❌ Data won't sync across devices
- ❌ Data lost if app is uninstalled

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Your project is already created: `akaalseva-4839d`

## Step 2: Firebase Config Already Set

✅ Your Firebase configuration is already updated in `src/config/firebase.ts`

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

That's it! No database or billing setup needed.

## Step 4: Test Your App

1. Start your app:
   ```bash
   npm start
   ```

2. Try creating an account
3. Try logging in
4. Check Firebase Console → Authentication → Users to see registered users

## How It Works

- **Authentication**: Handled by Firebase (free, no billing)
- **User Data**: Stored locally in AsyncStorage on the device
- **Preferences**: Saved locally (font size, dark mode, etc.)
- **Bookmarks**: Will be saved locally

## Data Storage

User data is stored in AsyncStorage with the key pattern: `userData_{userId}`

Example data structure:
```json
{
  "uid": "user123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": null,
  "preferences": {
    "fontSize": 16,
    "darkMode": false,
    "language": "en",
    "notifications": true
  }
}
```

## Limitations

⚠️ **Important to know:**
- Data is device-specific (no cloud sync)
- If user logs in on another device, preferences won't carry over
- Data is lost if app is uninstalled
- No backup/restore functionality

## Upgrade Path

Later, if you want cloud sync:
1. Enable billing on Firebase (still free for most usage)
2. I can update the code to use Firestore
3. Data will sync across devices

## Troubleshooting

**Error: "Invalid API key"**
- Firebase config is already set, should work

**Error: "Network request failed"**
- Check internet connection
- Verify Firebase project is active

**Can't create account:**
- Make sure Authentication is enabled in Firebase Console
- Password must be at least 6 characters

## Next Steps

- ✅ Authentication working
- ✅ Local data storage
- 🔄 Add email verification (optional)
- 🔄 Add password reset
- 🔄 Implement bookmarks
- 🔄 Add reading history

## Support

Everything is set up and ready to use! Just enable Email/Password authentication in Firebase Console and you're good to go.
