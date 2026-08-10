import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logger } from '../services/logger';

export interface UserData {
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

// Custom mock User type to satisfy existing screen compilers
export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

interface AuthContextType {
  user: MockUser | null;
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

const SESSION_KEY = 'cached_auth_user_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data immediately on mount
  useEffect(() => {
    const loadCachedSession = async () => {
      try {
        const cached = await AsyncStorage.getItem(SESSION_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setUser(parsed.user);
          setUserData(parsed.userData);
          Logger.info('Restored offline standalone profile from local storage.');
        } else {
          // No profile set up yet. Set a default guest user reference but keep userData null
          // to trigger the Profile Setup screen on first launch.
          setUser({
            uid: 'guest_user',
            email: 'guest@sikhsphere.local',
            displayName: 'Sikh Sphere Guest',
            photoURL: null,
            metadata: {
              creationTime: new Date().toISOString(),
            }
          });
          setUserData(null);
        }
      } catch (err) {
        Logger.warn('Error loading cached session:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCachedSession();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    // Deprecated for standalone mode
    Logger.info('Sign up bypassed in standalone mode.');
  };

  const signIn = async (email: string, password: string) => {
    // Deprecated for standalone mode
    Logger.info('Sign in bypassed in standalone mode.');
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
      setUser({
        uid: 'guest_user',
        email: 'guest@sikhsphere.local',
        displayName: 'Sikh Sphere Guest',
        photoURL: null,
        metadata: {
          creationTime: new Date().toISOString(),
        }
      });
      setUserData(null);
      Logger.info('Offline profile successfully reset.');
    } catch (error: any) {
      Logger.error('Error resetting offline profile:', error);
    }
  };

  const updateUserProfile = async (data: Partial<UserData>) => {
    try {
      const activeUid = user?.uid || 'guest_user';
      const currentUser: MockUser = {
        uid: activeUid,
        email: 'guest@sikhsphere.local',
        displayName: data.displayName || user?.displayName || 'Sikh Sphere Guest',
        photoURL: data.photoURL || user?.photoURL || null,
        metadata: user?.metadata || {
          creationTime: new Date().toISOString(),
        }
      };

      const nextUserData: UserData = {
        uid: activeUid,
        email: 'guest@sikhsphere.local',
        displayName: data.displayName || userData?.displayName || 'Sikh Sphere Guest',
        photoURL: data.photoURL || userData?.photoURL || null,
        isAdmin: false,
        preferences: {
          fontSize: data.preferences?.fontSize || userData?.preferences?.fontSize || 16,
          darkMode: data.preferences?.darkMode || userData?.preferences?.darkMode || false,
          language: data.preferences?.language || userData?.preferences?.language || 'en',
          notifications: data.preferences?.notifications || userData?.preferences?.notifications || true,
        },
      };

      setUser(currentUser);
      setUserData(nextUserData);

      await AsyncStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          user: currentUser,
          userData: nextUserData,
        })
      );
      Logger.info('Offline standalone profile updated successfully.');
    } catch (error: any) {
      Logger.error('Failed to update offline profile:', error);
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
