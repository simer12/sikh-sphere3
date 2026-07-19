import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { nitnemBanisMetadata } from '../data/banis';

export type RoutineTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type ReminderMode = 'silent' | 'gentle' | 'standard';

export interface NitnemRoutine {
  id: string;
  name: string;
  timeOfDay: RoutineTimeOfDay;
  reminderTime: string;
  enabled: boolean;
  reminderEnabled: boolean;
  reminderMode: ReminderMode;
  daysOfWeek: number[];
  baniIds: number[];
  note?: string;
}

interface NitnemRoutineContextType {
  routines: NitnemRoutine[];
  loading: boolean;
  hasCustomSchedule: boolean;
  getRoutineById: (routineId?: string) => NitnemRoutine | undefined;
  getTodayRoutines: () => NitnemRoutine[];
  updateRoutine: (routineId: string, updates: Partial<NitnemRoutine>) => Promise<void>;
  toggleRoutineBani: (routineId: string, baniId: number) => Promise<void>;
  toggleRoutineEnabled: (routineId: string) => Promise<void>;
  setReminderTime: (routineId: string, reminderTime: string) => Promise<void>;
  resetToDefaultRoutines: () => Promise<void>;
}

const STORAGE_KEY = 'nitnem_routines_v1';
const NOTIFICATION_IDS_KEY = 'nitnem_routine_notification_ids_v1';

const allDays = [0, 1, 2, 3, 4, 5, 6];

const defaultRoutines: NitnemRoutine[] = [
  {
    id: 'morning',
    name: 'Morning Nitnem',
    timeOfDay: 'morning',
    reminderTime: '05:00',
    enabled: true,
    reminderEnabled: false,
    reminderMode: 'gentle',
    daysOfWeek: allDays,
    baniIds: [2, 4, 5, 6, 7],
    note: 'Amrit Vela routine',
  },
  {
    id: 'afternoon',
    name: 'Afternoon Simran',
    timeOfDay: 'afternoon',
    reminderTime: '12:30',
    enabled: false,
    reminderEnabled: false,
    reminderMode: 'gentle',
    daysOfWeek: allDays,
    baniIds: [],
    note: 'Optional midday pause',
  },
  {
    id: 'evening',
    name: 'Evening Rehras',
    timeOfDay: 'evening',
    reminderTime: '18:30',
    enabled: true,
    reminderEnabled: false,
    reminderMode: 'gentle',
    daysOfWeek: allDays,
    baniIds: [8],
    note: 'After the day settles',
  },
  {
    id: 'night',
    name: 'Night Sohila',
    timeOfDay: 'night',
    reminderTime: '21:30',
    enabled: true,
    reminderEnabled: false,
    reminderMode: 'gentle',
    daysOfWeek: allDays,
    baniIds: [9],
    note: 'Before sleep',
  },
];

const NitnemRoutineContext = createContext<NitnemRoutineContextType>({} as NitnemRoutineContextType);

export const getBaniMetaById = (baniId: number) =>
  nitnemBanisMetadata.find((bani) => bani.id === baniId);

export const useNitnemRoutines = () => {
  const context = useContext(NitnemRoutineContext);
  if (!context) {
    throw new Error('useNitnemRoutines must be used within a NitnemRoutineProvider');
  }
  return context;
};

export const NitnemRoutineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routines, setRoutines] = useState<NitnemRoutine[]>(defaultRoutines);
  const [loading, setLoading] = useState(true);
  const [hasCustomSchedule, setHasCustomSchedule] = useState(false);

  useEffect(() => {
    loadRoutines();
  }, []);

  const cancelRoutineNotifications = async () => {
    if (Platform.OS === 'web') return;

    try {
      const storedIds = await AsyncStorage.getItem(NOTIFICATION_IDS_KEY);
      const ids = storedIds ? JSON.parse(storedIds) : [];
      if (Array.isArray(ids)) {
        await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
      }
      await AsyncStorage.removeItem(NOTIFICATION_IDS_KEY);
    } catch (error) {
      console.error('Error cancelling Nitnem reminders:', error);
    }
  };

  const syncRoutineNotifications = async (nextRoutines: NitnemRoutine[]) => {
    if (Platform.OS === 'web') return;

    try {
      await cancelRoutineNotifications();

      const scheduledIds: string[] = [];
      const routinesToSchedule = nextRoutines.filter(
        (routine) => routine.enabled && routine.reminderEnabled && routine.reminderMode !== 'silent'
      );

      if (routinesToSchedule.length === 0) {
        return;
      }

      const permissions = await Notifications.getPermissionsAsync();
      const finalPermissions = permissions.granted
        ? permissions
        : await Notifications.requestPermissionsAsync();

      if (!finalPermissions.granted) {
        return;
      }

      for (const routine of routinesToSchedule) {
        const [hour, minute] = routine.reminderTime.split(':').map(Number);
        const baniNames = routine.baniIds
          .map((baniId) => getBaniMetaById(baniId)?.name)
          .filter(Boolean)
          .join(', ');

        const reminderId = await Notifications.scheduleNotificationAsync({
          content: {
            title: routine.name,
            body: baniNames
              ? `A quiet moment for ${baniNames}, when you are ready.`
              : 'A quiet moment for your Nitnem routine, when you are ready.',
            sound: true,
          },
          trigger: {
            hour,
            minute,
            repeats: true,
          } as any,
        });
        scheduledIds.push(reminderId);

        if (routine.reminderMode === 'standard') {
          const followUp = new Date();
          followUp.setHours(hour, minute + 15, 0, 0);

          const followUpId = await Notifications.scheduleNotificationAsync({
            content: {
              title: `${routine.name} gentle follow-up`,
              body: 'Still here for you. Continue only if this is a good moment.',
              sound: true,
            },
            trigger: {
              hour: followUp.getHours(),
              minute: followUp.getMinutes(),
              repeats: true,
            } as any,
          });
          scheduledIds.push(followUpId);
        }
      }

      await AsyncStorage.setItem(NOTIFICATION_IDS_KEY, JSON.stringify(scheduledIds));
    } catch (error) {
      console.error('Error scheduling Nitnem reminders:', error);
    }
  };

  const persist = async (nextRoutines: NitnemRoutine[], custom = true) => {
    setRoutines(nextRoutines);
    setHasCustomSchedule(custom);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ routines: nextRoutines, hasCustomSchedule: custom }));
    await syncRoutineNotifications(nextRoutines);
  };

  const loadRoutines = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.routines)) {
          setRoutines(parsed.routines);
          setHasCustomSchedule(Boolean(parsed.hasCustomSchedule));
        }
      }
    } catch (error) {
      console.error('Error loading Nitnem routines:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRoutine = async (routineId: string, updates: Partial<NitnemRoutine>) => {
    await persist(routines.map((routine) => (routine.id === routineId ? { ...routine, ...updates } : routine)));
  };

  const toggleRoutineBani = async (routineId: string, baniId: number) => {
    await persist(
      routines.map((routine) => {
        if (routine.id !== routineId) {
          return routine;
        }

        const hasBani = routine.baniIds.includes(baniId);
        return {
          ...routine,
          baniIds: hasBani
            ? routine.baniIds.filter((id) => id !== baniId)
            : [...routine.baniIds, baniId],
        };
      })
    );
  };

  const toggleRoutineEnabled = async (routineId: string) => {
    const routine = routines.find((item) => item.id === routineId);
    if (!routine) return;
    await updateRoutine(routineId, { enabled: !routine.enabled });
  };

  const setReminderTime = async (routineId: string, reminderTime: string) => {
    await updateRoutine(routineId, { reminderTime, reminderEnabled: true });
  };

  const resetToDefaultRoutines = async () => {
    await persist(defaultRoutines, false);
  };

  const getRoutineById = (routineId?: string) => routines.find((routine) => routine.id === routineId);

  const getTodayRoutines = () => {
    const today = new Date().getDay();
    return routines
      .filter((routine) => routine.enabled && routine.daysOfWeek.includes(today))
      .sort((a, b) => a.reminderTime.localeCompare(b.reminderTime));
  };

  const value = useMemo(
    () => ({
      routines,
      loading,
      hasCustomSchedule,
      getRoutineById,
      getTodayRoutines,
      updateRoutine,
      toggleRoutineBani,
      toggleRoutineEnabled,
      setReminderTime,
      resetToDefaultRoutines,
    }),
    [routines, loading, hasCustomSchedule]
  );

  return <NitnemRoutineContext.Provider value={value}>{children}</NitnemRoutineContext.Provider>;
};
