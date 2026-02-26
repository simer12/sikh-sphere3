import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { useApp } from '../hooks/useApp';
import { AppText } from '../components/AppText';

interface NotificationSettings {
  enabled: boolean;
  dailyHukamnama: boolean;
  hukamnamaTime: string;
  nitnemReminder: boolean;
  nitnemTimes: {
    morning: boolean;
    evening: boolean;
    night: boolean;
  };
  gurpurabReminder: boolean;
  weeklyProgress: boolean;
  newContent: boolean;
}

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { t, fontSize, colors } = useApp();
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    dailyHukamnama: true,
    hukamnamaTime: '06:00',
    nitnemReminder: true,
    nitnemTimes: {
      morning: true,
      evening: true,
      night: true,
    },
    gurpurabReminder: true,
    weeklyProgress: false,
    newContent: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.uid)
        .single();

      if (data) {
        setSettings({
          enabled: data.enabled ?? true,
          dailyHukamnama: data.daily_hukamnama ?? true,
          hukamnamaTime: data.hukamnama_time ?? '06:00',
          nitnemReminder: data.nitnem_reminder ?? true,
          nitnemTimes: data.nitnem_times ?? {
            morning: true,
            evening: true,
            night: true,
          },
          gurpurabReminder: data.gurpurab_reminder ?? true,
          weeklyProgress: data.weekly_progress ?? false,
          newContent: data.new_content ?? true,
        });
      }
    } catch (error) {
      console.log('No notification settings found, using defaults');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notification_settings')
        .upsert(
          {
            user_id: user.uid,
            enabled: newSettings.enabled,
            daily_hukamnama: newSettings.dailyHukamnama,
            hukamnama_time: newSettings.hukamnamaTime,
            nitnem_reminder: newSettings.nitnemReminder,
            nitnem_times: newSettings.nitnemTimes,
            gurpurab_reminder: newSettings.gurpurabReminder,
            weekly_progress: newSettings.weeklyProgress,
            new_content: newSettings.newContent,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save notification settings');
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const updateNitnemTime = (time: 'morning' | 'evening' | 'night', value: boolean) => {
    const newNitnemTimes = { ...settings.nitnemTimes, [time]: value };
    const newSettings = { ...settings, nitnemTimes: newNitnemTimes };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (!user) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="notifications-off-outline" size={80} color={colors.disabled} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Sign In Required</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Please sign in to configure notification settings
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Master Switch */}
      <Card style={[styles.masterCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.masterSetting}>
            <View style={styles.masterLeft}>
              <Ionicons
                name={settings.enabled ? 'notifications' : 'notifications-off'}
                size={32}
                color={settings.enabled ? colors.primary : colors.disabled}
              />
              <View style={styles.masterText}>
                <Text style={[styles.masterTitle, { color: colors.text }]}>Notifications</Text>
                <Text style={[styles.masterDescription, { color: colors.textSecondary }]}>
                  {settings.enabled ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={(value) => updateSetting('enabled', value)}
              trackColor={{ false: colors.disabled, true: colors.primary }}
            />
          </View>
        </Card.Content>
      </Card>

      {settings.enabled && (
        <>
          {/* Daily Hukamnama */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Daily Hukamnama</Text>
            <Card style={[styles.card, { backgroundColor: colors.card }]}>
              <Card.Content>
                <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="newspaper" size={24} color={colors.primary} />
                    <View>
                      <Text style={[styles.settingLabel, { color: colors.text }]}>Daily Hukamnama</Text>
                      <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                        Get notified when new Hukamnama is available
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={settings.dailyHukamnama}
                    onValueChange={(value) => updateSetting('dailyHukamnama', value)}
                    trackColor={{ false: colors.disabled, true: colors.primary }}
                  />
                </View>

                {settings.dailyHukamnama && (
                  <TouchableOpacity
                    style={[styles.timeSelector, { backgroundColor: colors.surface }]}
                    onPress={() =>
                      Alert.alert('Coming Soon', 'Time picker will be available soon!')
                    }
                  >
                    <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
                    <Text style={[styles.timeText, { color: colors.text }]}>Notification Time: {settings.hukamnamaTime}</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.disabled} />
                  </TouchableOpacity>
                )}
              </Card.Content>
            </Card>
          </View>

          {/* Nitnem Reminders */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Nitnem Reminders</Text>
            <Card style={[styles.card, { backgroundColor: colors.card }]}>
              <Card.Content>
                <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="book" size={24} color={colors.primary} />
                    <View>
                      <Text style={[styles.settingLabel, { color: colors.text }]}>Nitnem Reminders</Text>
                      <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                        Remind me to complete daily Nitnem
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={settings.nitnemReminder}
                    onValueChange={(value) => updateSetting('nitnemReminder', value)}
                    trackColor={{ false: colors.disabled, true: colors.primary }}
                  />
                </View>

                {settings.nitnemReminder && (
                  <View style={styles.subSettings}>
                    <View style={[styles.subSettingItem, { backgroundColor: colors.surface }]}>
                      <Text style={[styles.subSettingLabel, { color: colors.text }]}>🌅 Morning Nitnem (5:00 AM)</Text>
                      <Switch
                        value={settings.nitnemTimes.morning}
                        onValueChange={(value) => updateNitnemTime('morning', value)}
                        trackColor={{ false: colors.disabled, true: colors.primary }}
                      />
                    </View>
                    <View style={[styles.subSettingItem, { backgroundColor: colors.surface }]}>
                      <Text style={[styles.subSettingLabel, { color: colors.text }]}>🌆 Evening Nitnem (6:00 PM)</Text>
                      <Switch
                        value={settings.nitnemTimes.evening}
                        onValueChange={(value) => updateNitnemTime('evening', value)}
                        trackColor={{ false: colors.disabled, true: colors.primary }}
                      />
                    </View>
                    <View style={[styles.subSettingItem, { backgroundColor: colors.surface }]}>
                      <Text style={[styles.subSettingLabel, { color: colors.text }]}>🌙 Night Nitnem (9:00 PM)</Text>
                      <Switch
                        value={settings.nitnemTimes.night}
                        onValueChange={(value) => updateNitnemTime('night', value)}
                        trackColor={{ false: colors.disabled, true: colors.primary }}
                      />
                    </View>
                  </View>
                )}
              </Card.Content>
            </Card>
          </View>

          {/* Special Events */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Special Events</Text>
            <Card style={[styles.card, { backgroundColor: colors.card }]}>
              <Card.Content>
                <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="star" size={24} color={colors.primary} />
                    <View>
                      <Text style={[styles.settingLabel, { color: colors.text }]}>Gurpurab Reminders</Text>
                      <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                        Important Sikh festivals and Gurpurabs
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={settings.gurpurabReminder}
                    onValueChange={(value) => updateSetting('gurpurabReminder', value)}
                    trackColor={{ false: colors.disabled, true: colors.primary }}
                  />
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Progress & Updates */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Progress & Updates</Text>
            <Card style={[styles.card, { backgroundColor: colors.card }]}>
              <Card.Content>
                <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="stats-chart" size={24} color={colors.primary} />
                    <View>
                      <Text style={[styles.settingLabel, { color: colors.text }]}>Weekly Progress</Text>
                      <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                        Summary of your reading activity
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={settings.weeklyProgress}
                    onValueChange={(value) => updateSetting('weeklyProgress', value)}
                    trackColor={{ false: colors.disabled, true: colors.primary }}
                  />
                </View>

                <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="sparkles" size={24} color={colors.primary} />
                    <View>
                      <Text style={[styles.settingLabel, { color: colors.text }]}>New Content</Text>
                      <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                        When new Banis or features are added
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={settings.newContent}
                    onValueChange={(value) => updateSetting('newContent', value)}
                    trackColor={{ false: colors.disabled, true: colors.primary }}
                  />
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Info */}
          <Card style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <Card.Content>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle" size={24} color={colors.primary} />
                <Text style={[styles.infoTitle, { color: colors.text }]}>About Notifications</Text>
              </View>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                • Notifications respect your device's Do Not Disturb settings{'\n'}
                • You can manage system notification permissions in your device settings{'\n'}
                • Some features require app to be installed (not available in browser)
              </Text>
            </Card.Content>
          </Card>
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  masterCard: {
    margin: 16,
    elevation: 4,
  },
  masterSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  masterText: {
    marginLeft: 16,
  },
  masterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  masterDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
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
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  timeText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },
  subSettings: {
    marginTop: 12,
    paddingLeft: 12,
  },
  subSettingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  subSettingLabel: {
    fontSize: 14,
  },
  infoCard: {
    margin: 16,
    elevation: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
});



