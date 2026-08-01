import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Logger } from './logger';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  /**
   * Request push/local notification permissions
   */
  requestPermissions: async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Logger.warn('Notification permission was not granted by the user.');
        return false;
      }

      // Configure Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-reminders', {
          name: 'Daily Nitnem Reminders',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF9800',
        });
      }

      Logger.info('Notification permission successfully granted & configured.');
      return true;
    } catch (error: any) {
      Logger.error('Failed to request notification permission:', error);
      return false;
    }
  },

  /**
   * Schedule morning and evening daily Nitnem reminders (Free local notifications)
   */
  scheduleDailyNitnemReminders: async () => {
    try {
      // 1. Cancel existing notifications to prevent duplicates
      await Notifications.cancelAllScheduledNotificationsAsync();

      // 2. Schedule Morning Nitnem (6:00 AM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌅 Morning Nitnem Reminder',
          body: 'Good morning! It is time to connect with Gurbani. Open your morning Nitnem routines.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: 6,
          minute: 0,
          repeats: true,
        } as any,
      });

      // 3. Schedule Evening Rehras Sahib (6:00 PM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌇 Evening Rehras Sahib Reminder',
          body: 'Good evening! Take a moment of quiet reflection and open Rehras Sahib.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: 18,
          minute: 0,
          repeats: true,
        } as any,
      });

      Logger.info('Daily morning and evening Nitnem notifications successfully scheduled.');
    } catch (error: any) {
      Logger.error('Failed to schedule daily reminders:', error);
    }
  },

  /**
   * Cancel all scheduled reminders
   */
  cancelAllReminders: async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Logger.info('All scheduled notifications successfully cleared.');
    } catch (error: any) {
      Logger.error('Failed to clear scheduled notifications:', error);
    }
  },
};
