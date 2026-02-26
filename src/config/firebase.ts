import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

// Initialize Auth (Firebase handles persistence automatically)
const auth = getAuth(app);

export { auth, app };
