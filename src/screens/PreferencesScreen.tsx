import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePreferences } from '../contexts/PreferencesContext';
import { useApp } from '../hooks/useApp';
import { hapticFeedback } from '../utils/haptics';

export default function PreferencesScreen({ navigation }: any) {
  const { preferences, updatePreference, resetPreferences } = usePreferences();
  const { t, colors } = useApp();

  const fontSizes = [
    { label: t.small, value: 14 },
    { label: t.medium, value: 16 },
    { label: t.large, value: 18 },
    { label: t.extraLarge, value: 20 },
  ];

  const handleReset = () => {
    Alert.alert(
      'Reset Preferences',
      'Are you sure you want to reset all preferences to default?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetPreferences();
            Alert.alert(t.success, 'Preferences have been reset to default');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Display Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t.display}</Text>

        {/* Font Size */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="text" size={24} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>{t.fontSize}</Text>
          </View>
        </View>
        <View style={styles.fontSizeContainer}>
          {fontSizes.map((size) => (
            <TouchableOpacity
              key={size.value}
              style={[
                styles.fontSizeButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
                preferences.fontSize === size.value && { 
                  backgroundColor: colors.primary, 
                  borderColor: colors.primary 
                },
              ]}
              onPress={() => {
                hapticFeedback.selection();
                updatePreference('fontSize', size.value);
              }}
            >
              <Text
                style={[
                  styles.fontSizeText,
                  { color: colors.textSecondary },
                  preferences.fontSize === size.value && { color: '#fff' },
                ]}
              >
                {size.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dark Mode */}
        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={24} color={colors.primary} />
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>{t.darkMode}</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {preferences.darkMode ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
          <Switch
            value={preferences.darkMode}
            onValueChange={(value) => {
              hapticFeedback.light();
              updatePreference('darkMode', value);
            }}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={preferences.darkMode ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Language Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t.language}</Text>

        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: colors.border }]}
          onPress={() => {
            hapticFeedback.selection();
            updatePreference('language', preferences.language === 'en' ? 'pa' : 'en');
          }}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="language" size={24} color={colors.primary} />
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>{t.primaryLanguage}</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {preferences.language === 'en' ? 'English' : 'Punjabi (ਪੰਜਾਬੀ)'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Audio Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t.audio}</Text>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="play-circle" size={24} color={colors.primary} />
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>{t.autoPlay}</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>Start audio automatically</Text>
            </View>
          </View>
          <Switch
            value={preferences.autoPlay}
            onValueChange={(value) => {
              hapticFeedback.light();
              updatePreference('autoPlay', value);
            }}
            trackColor={{ false: colors.disabled, true: colors.primary }}
          />
        </View>
      </View>

      {/* Download Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t.downloads}</Text>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="wifi" size={24} color={colors.primary} />
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>{t.wifiOnly}</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>Save mobile data</Text>
            </View>
          </View>
          <Switch
            value={preferences.downloadOnWifi}
            onValueChange={(value) => updatePreference('downloadOnWifi', value)}
            trackColor={{ false: colors.disabled, true: colors.primary }}
          />
        </View>
      </View>

      {/* Notification Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t.notificationsTitle}</Text>

        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: colors.border }]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Notification Preferences</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Reset Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleReset}
        >
          <Ionicons name="refresh" size={20} color={colors.error} />
          <Text style={[styles.resetButtonText, { color: colors.error }]}>{t.resetToDefault}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    marginLeft: 12,
    marginTop: 2,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  fontSizeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  fontSizeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
