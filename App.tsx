import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './src/theme';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import NitnemScreen from './src/screens/NitnemScreen';
import BaniDetailScreen from './src/screens/BaniDetailScreen';
import LiveKirtanScreen from './src/screens/LiveKirtanScreen';
import HukamnamaScreen from './src/screens/HukamnamaScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import GurdwaraFinderScreen from './src/screens/GurdwaraFinderScreen';
import LearnScreen from './src/screens/LearnScreen';
import AboutSikhismScreen from './src/screens/AboutSikhismScreen';
import GuruDetailScreen from './src/screens/GuruDetailScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import HistoryEraScreen from './src/screens/HistoryEraScreen';
import HistoryArticleScreen from './src/screens/HistoryArticleScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

function AboutStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="AboutList" component={AboutSikhismScreen} options={{ title: 'About Sikhism' }} />
      <Stack.Screen name="GuruDetail" component={GuruDetailScreen} options={{ title: 'Guru' }} />
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
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: any;
              
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Nitnem') {
                iconName = focused ? 'book' : 'book-outline';
              } else if (route.name === 'History') {
                iconName = focused ? 'time' : 'time-outline';
              } else if (route.name === 'Live Kirtan') {
                iconName = focused ? 'radio' : 'radio-outline';
              } else if (route.name === 'Hukamnama') {
                iconName = focused ? 'newspaper' : 'newspaper-outline';
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
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Nitnem" component={NitnemStack} options={{ headerShown: false }} />
          <Tab.Screen name="History" component={HistoryStack} options={{ headerShown: false }} />
          <Tab.Screen name="Live Kirtan" component={LiveKirtanScreen} />
          <Tab.Screen name="Hukamnama" component={HukamnamaScreen} />
          <Tab.Screen name="More" component={MoreScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
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
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Sikh Calendar' }} />
      <Stack.Screen name="GurdwaraFinder" component={GurdwaraFinderScreen} options={{ title: 'Find Gurdwara' }} />
      <Stack.Screen name="Learn" component={LearnScreen} options={{ title: 'Learn Gurmukhi' }} />
      <Stack.Screen name="AboutSikhism" component={AboutStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MoreListScreen({ navigation }: any) {
  const { ScrollView, View, TouchableOpacity, Text, StyleSheet } = require('react-native');
  
  const menuItems = [
    { title: 'Sikh Calendar', icon: 'calendar', screen: 'Calendar' },
    { title: 'Find Gurdwara', icon: 'location', screen: 'GurdwaraFinder' },
    { title: 'Learn Gurmukhi', icon: 'school', screen: 'Learn' },
    { title: 'About Sikhism', icon: 'information-circle', screen: 'AboutSikhism' },
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
