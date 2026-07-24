import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { supabase } from '../config/supabase';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin?: boolean;
  preferences?: {
    fontSize: number;
    darkMode: boolean;
    language: 'en' | 'pa';
    notifications: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from Supabase with detailed error status
  const loadUserData = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', uid)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // User profile explicitly not found in database (safe to create default)
          return { notFound: true };
        }
        console.error('Error loading user data from Supabase:', error);
        return { dbError: true, message: error.message };
      }
      
      if (data) {
        return {
          uid: data.user_id,
          email: data.email,
          displayName: data.name,
          photoURL: null,
          isAdmin: data.is_admin || false,
          preferences: {
            fontSize: 16,
            darkMode: false,
            language: 'en' as const,
            notifications: true,
          },
        };
      }
      return { notFound: true };
    } catch (error: any) {
      console.error('Exception loading user data:', error);
      return { dbError: true, message: error.message };
    }
  };

  // Save user data to Supabase and update local cache
  const saveUserData = async (uid: string, data: UserData) => {
    try {
      // Always write to local storage first for offline usability
      await AsyncStorage.setItem(`cached_user_data_${uid}`, JSON.stringify(data));
      
      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: uid,
          name: data.displayName,
          email: data.email,
          is_admin: data.isAdmin || false,
          bani_reading_streak: 0,
          banis_read: [],
          bookmarked_banis: [],
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });
      
      if (error) {
        console.error('Error syncing user data to Supabase:', error);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Load cached user session immediately on mount
  useEffect(() => {
    const loadCachedSession = async () => {
      try {
        const cachedUser = await AsyncStorage.getItem('cached_auth_user');
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          // Set user and userData from cache immediately
          setUser(parsed.user);
          setUserData(parsed.userData);
          setLoading(false);
          console.log('Restored authenticated session from local cache (sub-300ms boot).');
        }
      } catch (err) {
        console.error('Error loading cached session:', err);
      }
    };
    loadCachedSession();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Create a serializable user representation for local storage
        const serializableUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        } as any;
        setUser(user);
        
        // Load user data in the background from Supabase
        const result = await loadUserData(user.uid);
        let finalUserData: UserData | null = null;
        
        if (result && 'dbError' in result) {
          // Database connection failed. Load from local cache.
          console.log('Database error. Attempting local cache fallback...');
          const cached = await AsyncStorage.getItem(`cached_user_data_${user.uid}`);
          if (cached) {
            finalUserData = JSON.parse(cached);
          }
        } else if (result && 'notFound' in result) {
          // Safe to create default user data (actually new user)
          const defaultData: UserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAdmin: false,
            preferences: {
              fontSize: 16,
              darkMode: false,
              language: 'en',
              notifications: true,
            },
          };
          await saveUserData(user.uid, defaultData);
          finalUserData = defaultData;
        } else if (result) {
          finalUserData = result as UserData;
          // Sync successful retrieval to local cache
          await AsyncStorage.setItem(`cached_user_data_${user.uid}`, JSON.stringify(finalUserData));
        }

        if (finalUserData) {
          setUserData(finalUserData);
          // Persist the combined session cache
          await AsyncStorage.setItem('cached_auth_user', JSON.stringify({
            user: serializableUser,
            userData: finalUserData,
          }));
        }
      } else {
        setUser(null);
        setUserData(null);
        await AsyncStorage.removeItem('cached_auth_user');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const trimmedEmail = email.trim();
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document
      const newUserData: UserData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName,
        photoURL: null,
        isAdmin: false,
        preferences: {
          fontSize: 16,
          darkMode: false,
          language: 'en',
          notifications: true,
        },
      };
      
      await saveUserData(userCredential.user.uid, newUserData);
      setUserData(newUserData);
      
      // Persist locally
      await AsyncStorage.setItem('cached_auth_user', JSON.stringify({
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName,
          photoURL: null,
        },
        userData: newUserData,
      }));
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const trimmedEmail = email.trim();
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('cached_auth_user');
      await signOut(auth);
      // Reload page on web to clear state
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!user) return;
    
    try {
      const updatedData = { ...userData, ...data } as UserData;
      setUserData(updatedData);
      
      // Save locally first
      await AsyncStorage.setItem(`cached_user_data_${user.uid}`, JSON.stringify(updatedData));
      
      // Try to sync to cloud database
      await saveUserData(user.uid, updatedData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
