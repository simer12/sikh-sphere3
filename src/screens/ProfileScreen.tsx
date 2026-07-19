import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../hooks/useApp';

export default function ProfileScreen({ navigation }: any) {
  const { user, userData, logout } = useAuth();
  const { t, colors } = useApp();

  const handleLogout = () => {
    Alert.alert(
      t.logout,
      'Are you sure you want to logout?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.logout,
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      title: t.editProfile,
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      title: t.preferences,
      icon: 'settings-outline',
      onPress: () => navigation.navigate('Preferences'),
    },
    {
      title: t.readingHistory,
      icon: 'book-outline',
      onPress: () => navigation.navigate('ReadingHistory'),
    },
    {
      title: t.bookmarks,
      icon: 'bookmark-outline',
      onPress: () => navigation.navigate('Bookmarks'),
    },
    {
      title: t.notifications,
      icon: 'notifications-outline',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      title: t.helpSupport,
      icon: 'help-circle-outline',
      onPress: () => Alert.alert(t.helpSupport, 'For support, email: support@akaalseva.com'),
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header */}
      <LinearGradient
        colors={[colors.primary, '#FF9933', '#138808']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.profileImageContainer}>
          {userData?.photoURL ? (
            <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={50} color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.profileName}>{userData?.displayName || 'Guest User'}</Text>
        <Text style={styles.profileEmail}>{userData?.email || 'Not logged in'}</Text>
      </LinearGradient>

      {/* Stats Section */}
      {user && (
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days Streak</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Banis Read</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Bookmarks</Text>
          </View>
        </View>
      )}

      {/* Guest Mode Info */}
      {!user && (
        <Card style={[styles.guestInfoCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <View style={styles.guestInfo}>
              <Ionicons name="information-circle" size={24} color={colors.primary} />
              <View style={styles.guestInfoText}>
                <Text style={[styles.guestInfoTitle, { color: colors.primary }]}>Guest Mode</Text>
                <Text style={[styles.guestInfoDescription, { color: colors.textSecondary }]}>
                  You're browsing as a guest. Sign in to save your progress, bookmarks, and reading history across devices.
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Menu Items */}
      <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: colors.surface }]}>
                <Ionicons name={item.icon as any} size={24} color={colors.primary} />
              </View>
              <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      {user && (
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: colors.error }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={[styles.logoutButtonText, { color: colors.error }]}>Logout</Text>
        </TouchableOpacity>
      )}

      {/* Login Button for Guests */}
      {!user && (
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Sign In to Save Your Progress</Text>
        </TouchableOpacity>
      )}

      {/* App Version */}
      <Text style={[styles.versionText, { color: colors.textTertiary }]}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
  },
  guestInfoCard: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  guestInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  guestInfoText: {
    flex: 1,
    marginLeft: 12,
  },
  guestInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  guestInfoDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  menuContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loginButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 24,
  },
});
