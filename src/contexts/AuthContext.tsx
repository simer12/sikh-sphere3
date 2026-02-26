import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { supabase } from '../config/supabase';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
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

  // Load user data from Supabase
  const loadUserData = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', uid)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user data:', error);
        return null;
      }
      
      if (data) {
        return {
          uid: data.user_id,
          email: data.email,
          displayName: data.name,
          photoURL: null,
          preferences: {
            fontSize: 16,
            darkMode: false,
            language: 'en' as const,
            notifications: true,
          },
        };
      }
      return null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  };

  // Save user data to Supabase
  const saveUserData = async (uid: string, data: UserData) => {
    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: uid,
          name: data.displayName,
          email: data.email,
          bani_reading_streak: 0,
          banis_read: [],
          bookmarked_banis: [],
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });
      
      if (error) {
        console.error('Error saving user data:', error);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Load user data from AsyncStorage
        let storedData = await loadUserData(user.uid);
        
        if (!storedData) {
          // Create default user data
          storedData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            preferences: {
              fontSize: 16,
              darkMode: false,
              language: 'en',
              notifications: true,
            },
          };
          await saveUserData(user.uid, storedData);
        }
        setUserData(storedData);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document in AsyncStorage
      const newUserData: UserData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName,
        photoURL: null,
        preferences: {
          fontSize: 16,
          darkMode: false,
          language: 'en',
          notifications: true,
        },
      };
      
      await saveUserData(userCredential.user.uid, newUserData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
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
      await saveUserData(user.uid, updatedData);
      setUserData(updatedData);
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
