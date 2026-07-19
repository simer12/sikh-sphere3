import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './src/theme';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { BookmarksProvider } from './src/contexts/BookmarksContext';
import { ReadingHistoryProvider } from './src/contexts/ReadingHistoryContext';
import { NitnemProgressProvider } from './src/contexts/NitnemProgressContext';
import { NitnemRoutineProvider } from './src/contexts/NitnemRoutineContext';
import { AkaalOriginalsProvider } from './src/contexts/AkaalOriginalsContext';
import { PreferencesProvider, usePreferences } from './src/contexts/PreferencesContext';
import { ThemeProvider } from './src/components/ThemeProvider';
import { OnboardingFlow } from './src/components/OnboardingFlow';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import NitnemScreen from './src/screens/NitnemScreen';
import BaniDetailScreen from './src/screens/BaniDetailScreen';
import DasamGranthScreen from './src/screens/DasamGranthScreen';
import DasamGranthDetailScreen from './src/screens/DasamGranthDetailScreen';
import LiveKirtanScreen from './src/screens/LiveKirtanScreen';
import HukamnamaScreen from './src/screens/HukamnamaScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import HistoryEraScreen from './src/screens/HistoryEraScreen';
import HistoryArticleScreen from './src/screens/HistoryArticleScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import PreferencesScreen from './src/screens/PreferencesScreen';
import ReadingHistoryScreen from './src/screens/ReadingHistoryScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import RoutineBuilderScreen from './src/screens/RoutineBuilderScreen';
import AkaalOriginalsScreen from './src/screens/AkaalOriginalsScreen';
import AkaalEpisodeDetailScreen from './src/screens/AkaalEpisodeDetailScreen';
import AkaalSeasonDetailScreen from './src/screens/AkaalSeasonDetailScreen';
import AkaalBrowseScreen from './src/screens/AkaalBrowseScreen';
import AkaalOriginalsAdminScreen from './src/screens/AkaalOriginalsAdminScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Hukamnama" component={HukamnamaScreen} options={{ title: 'Daily Hukamnama' }} />
      <Stack.Screen name="Live Kirtan" component={LiveKirtanScreen} options={{ title: 'Live Kirtan' }} />
      <Stack.Screen name="AkaalOriginals" component={AkaalOriginalsScreen} options={{ title: 'Akaal Originals' }} />
      <Stack.Screen name="AkaalEpisodeDetail" component={AkaalEpisodeDetailScreen} options={{ title: 'Episode' }} />
      <Stack.Screen name="AkaalSeasonDetail" component={AkaalSeasonDetailScreen} options={{ title: 'Season' }} />
      <Stack.Screen name="AkaalBrowse" component={AkaalBrowseScreen} options={{ title: 'Browse' }} />
      <Stack.Screen name="AkaalOriginalsAdmin" component={AkaalOriginalsAdminScreen} options={{ title: 'Manage Originals' }} />
    </Stack.Navigator>
  );
}

function NitnemStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="NitnemList" component={NitnemScreen} options={{ title: 'Nitnem' }} />
      <Stack.Screen name="BaniDetail" component={BaniDetailScreen} options={{ title: 'Bani' }} />
    </Stack.Navigator>
  );
}

function DasamGranthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="DasamGranthList" component={DasamGranthScreen} options={{ title: 'Dasam Granth' }} />
      <Stack.Screen name="DasamGranthDetail" component={DasamGranthDetailScreen} options={{ title: 'Dasam Granth Bani' }} />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="HistoryList" component={HistoryScreen} options={{ title: 'Sikh History' }} />
      <Stack.Screen name="HistoryEra" component={HistoryEraScreen} options={{ title: 'Era' }} />
      <Stack.Screen name="HistoryArticle" component={HistoryArticleScreen} options={{ title: 'Article' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <ThemeProvider>
          <BookmarksProvider>
            <ReadingHistoryProvider>
              <NitnemProgressProvider>
                <NitnemRoutineProvider>
                  <AkaalOriginalsProvider>
                    <AppNavigator />
                  </AkaalOriginalsProvider>
                </NitnemRoutineProvider>
              </NitnemProgressProvider>
            </ReadingHistoryProvider>
          </BookmarksProvider>
        </ThemeProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}

// Main App Navigator with Auth Check
function AppNavigator() {
  const { user, userData, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem('onboardingCompleted');
      setShowOnboarding(!completed);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setShowOnboarding(false);
    } finally {
      setCheckingOnboarding(false);
    }
  };

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
  };

  if (loading || checkingOnboarding) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Show onboarding on first launch
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
          </>
        ) : !userData ? (
          <>
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main Tabs (existing tab navigator)
function MainTabs() {
  const { preferences } = usePreferences();
  const t = require('./src/i18n/translations').translations[preferences.language];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Nitnem') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Dasam Granth') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'menu' : 'menu-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false, title: t.home }} />
      <Tab.Screen name="Nitnem" component={NitnemStack} options={{ headerShown: false, title: t.nitnem }} />
      <Tab.Screen name="Dasam Granth" component={DasamGranthStack} options={{ headerShown: false, title: t.dasamGranth }} />
      <Tab.Screen name="History" component={HistoryStack} options={{ headerShown: false, title: t.history }} />
      <Tab.Screen name="More" component={MoreScreen} options={{ title: t.more }} />
    </Tab.Navigator>
  );
}

// More screen with additional features
function MoreScreen({ navigation }: any) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="MoreList" component={MoreListScreen} options={{ title: 'More' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} options={{ title: 'Preferences' }} />
      <Stack.Screen name="ReadingHistory" component={ReadingHistoryScreen} options={{ title: 'Reading History' }} />
      <Stack.Screen name="RoutineBuilder" component={RoutineBuilderScreen} options={{ title: 'My Daily Nitnem' }} />
      <Stack.Screen name="AkaalOriginals" component={AkaalOriginalsScreen} options={{ title: 'Akaal Originals' }} />
      <Stack.Screen name="AkaalEpisodeDetail" component={AkaalEpisodeDetailScreen} options={{ title: 'Episode' }} />
      <Stack.Screen name="AkaalSeasonDetail" component={AkaalSeasonDetailScreen} options={{ title: 'Season' }} />
      <Stack.Screen name="AkaalBrowse" component={AkaalBrowseScreen} options={{ title: 'Browse' }} />
      <Stack.Screen name="AkaalOriginalsAdmin" component={AkaalOriginalsAdminScreen} options={{ title: 'Manage Originals' }} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} options={{ title: 'My Bookmarks' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Sikh Calendar' }} />
    </Stack.Navigator>
  );
}

function MoreListScreen({ navigation }: any) {
  const { ScrollView, View, TouchableOpacity, Text, StyleSheet } = require('react-native');
  
  const menuItems = [
    { title: 'Profile', icon: 'person', screen: 'Profile' },
    { title: 'Akaal Originals', icon: 'play-circle-outline', screen: 'AkaalOriginals' },
    { title: 'My Daily Nitnem', icon: 'calendar-outline', screen: 'RoutineBuilder' },
    { title: 'Preferences', icon: 'settings-outline', screen: 'Preferences' },
    { title: 'Reading History', icon: 'bar-chart-outline', screen: 'ReadingHistory' },
    { title: 'My Bookmarks', icon: 'bookmark-outline', screen: 'Bookmarks' },
    { title: 'Notifications', icon: 'notifications-outline', screen: 'Notifications' },
    { title: 'Sikh Calendar', icon: 'calendar', screen: 'Calendar' },
  ];

  return (
    <ScrollView style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Ionicons name={item.icon as any} size={24} color={theme.colors.primary} />
          <Text style={styles.menuText}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = require('react-native').StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
  },
});
