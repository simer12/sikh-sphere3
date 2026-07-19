import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzmFgpLsOY4cfsau4U1AnMFSfa-_cl-fo",
  authDomain: "akaalseva-4839d.firebaseapp.com",
  projectId: "akaalseva-4839d",
  storageBucket: "akaalseva-4839d.firebasestorage.app",
  messagingSenderId: "736447515274",
  appId: "1:736447515274:web:9b9af8037611f6a60e3b73",
  measurementId: "G-LNLLHNTH8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use AsyncStorage persistence on mobile, default (indexedDB) on web
let auth: ReturnType<typeof getAuth>;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth, app };
