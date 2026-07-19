import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReadingHistory } from './ReadingHistoryContext';

const STORAGE_KEY = 'nitnem_progress_v1';
const WEEKLY_GOAL = 3;

export interface NitnemSession {
  id: string;
  baniId: number;
  baniName: string;
  completedAt: string;
  routineId?: string;
  durationSeconds?: number;
  reflection?: string;
}

export interface BaniProgressSummary {
  baniId: number;
  baniName?: string;
  progress: number;
  completions: number;
  completedToday: boolean;
  lastCompletedAt?: string;
  currentStreak: number;
  bestStreak: number;
}

export interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
  icon: string;
}

interface NitnemProgressState {
  sessions: NitnemSession[];
  progressByBani: Record<number, number>;
}

interface NitnemProgressContextType {
  loading: boolean;
  sessions: NitnemSession[];
  progressByBani: Record<number, number>;
  weeklyGoal: number;
  weeklyCompleted: number;
  weeklyProgress: number;
  dailyStreak: number;
  badges: MilestoneBadge[];
  getBaniProgress: (baniId: number, baniName?: string) => BaniProgressSummary;
  updateReadingProgress: (baniId: number, progress: number) => Promise<void>;
  completeBani: (params: {
    baniId: number;
    baniName: string;
    routineId?: string;
    durationSeconds?: number;
    reflection?: string;
  }) => Promise<void>;
  addReflection: (sessionId: string, reflection: string) => Promise<void>;
}

const NitnemProgressContext = createContext<NitnemProgressContextType>({} as NitnemProgressContextType);

const dateKey = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const startOfWeek = () => {
  const date = new Date();
  const day = date.getDay();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date;
};

const calculateStreak = (dates: string[]) => {
  const uniqueDates = new Set(dates);
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    if (!uniqueDates.has(dateKey(cursor))) {
      break;
    }

    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

const calculateBestStreak = (dates: string[]) => {
  const sorted = [...new Set(dates)].sort();
  let best = 0;
  let current = 0;
  let previous: Date | null = null;

  sorted.forEach((key) => {
    const currentDate = new Date(`${key}T00:00:00`);
    if (!previous) {
      current = 1;
    } else {
      const diffDays = Math.round((currentDate.getTime() - previous.getTime()) / 86400000);
      current = diffDays === 1 ? current + 1 : 1;
    }

    best = Math.max(best, current);
    previous = currentDate;
  });

  return best;
};

const buildBadges = (sessions: NitnemSession[], dailyStreak: number): MilestoneBadge[] => {
  const badges: MilestoneBadge[] = [];
  const byBani = sessions.reduce<Record<number, NitnemSession[]>>((grouped, session) => {
    grouped[session.baniId] = grouped[session.baniId] || [];
    grouped[session.baniId].push(session);
    return grouped;
  }, {});

  Object.entries(byBani).forEach(([baniId, baniSessions]) => {
    const sorted = [...baniSessions].sort(
      (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
    const baniName = sorted[0]?.baniName || 'Bani';
    const baniDates = sorted.map((session) => dateKey(session.completedAt));
    const baniBestStreak = calculateBestStreak(baniDates);

    if (sorted[0]) {
      badges.push({
        id: `first-${baniId}`,
        title: `First full ${baniName}`,
        description: 'Completed from start to finish.',
        earnedAt: sorted[0].completedAt,
        icon: 'checkmark-circle',
      });
    }

    if (baniBestStreak >= 7) {
      const seventhSession = sorted[Math.min(sorted.length - 1, 6)];
      badges.push({
        id: `seven-${baniId}`,
        title: `7 days of ${baniName}`,
        description: 'A gentle rhythm is forming.',
        earnedAt: seventhSession.completedAt,
        icon: 'sparkles',
      });
    }
  });

  if (dailyStreak >= 7) {
    const latestSession = [...sessions].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )[0];

    badges.push({
      id: 'daily-seven',
      title: '7 day Nitnem rhythm',
      description: 'Read at least one prayer each day for a week.',
      earnedAt: latestSession?.completedAt || new Date().toISOString(),
      icon: 'sunny',
    });
  }

  return badges.sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime());
};

export const useNitnemProgress = () => {
  const context = useContext(NitnemProgressContext);
  if (!context) {
    throw new Error('useNitnemProgress must be used within a NitnemProgressProvider');
  }
  return context;
};

export const NitnemProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { trackReading } = useReadingHistory();
  const [state, setState] = useState<NitnemProgressState>({ sessions: [], progressByBani: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const persist = async (nextState: NitnemProgressState) => {
    setState(nextState);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  };

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({
          sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
          progressByBani: parsed.progressByBani || {},
        });
      }
    } catch (error) {
      console.error('Error loading Nitnem progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReadingProgress = async (baniId: number, progress: number) => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const currentProgress = state.progressByBani[baniId] || 0;

    if (Math.abs(clampedProgress - currentProgress) < 0.03 && clampedProgress < 1) {
      return;
    }

    await persist({
      ...state,
      progressByBani: {
        ...state.progressByBani,
        [baniId]: Math.max(currentProgress, clampedProgress),
      },
    });
  };

  const completeBani: NitnemProgressContextType['completeBani'] = async ({
    baniId,
    baniName,
    routineId,
    durationSeconds,
    reflection,
  }) => {
    const today = dateKey(new Date());
    const alreadyCompletedToday = state.sessions.some(
      (session) => session.baniId === baniId && dateKey(session.completedAt) === today
    );

    const session: NitnemSession = {
      id: `${baniId}-${Date.now()}`,
      baniId,
      baniName,
      routineId,
      completedAt: new Date().toISOString(),
      durationSeconds,
      reflection: reflection?.trim() || undefined,
    };

    const nextSessions = alreadyCompletedToday
      ? state.sessions.map((existing) =>
          existing.baniId === baniId && dateKey(existing.completedAt) === today
            ? { ...existing, routineId: routineId || existing.routineId, durationSeconds, reflection: session.reflection || existing.reflection }
            : existing
        )
      : [session, ...state.sessions];

    await persist({
      sessions: nextSessions,
      progressByBani: {
        ...state.progressByBani,
        [baniId]: 1,
      },
    });

    await trackReading(baniName, 'nitnem', durationSeconds);
  };

  const addReflection = async (sessionId: string, reflection: string) => {
    await persist({
      ...state,
      sessions: state.sessions.map((session) =>
        session.id === sessionId ? { ...session, reflection: reflection.trim() } : session
      ),
    });
  };

  const dailyStreak = useMemo(
    () => calculateStreak(state.sessions.map((session) => dateKey(session.completedAt))),
    [state.sessions]
  );

  const weeklyCompleted = useMemo(() => {
    const weekStart = startOfWeek();
    return state.sessions.filter((session) => new Date(session.completedAt) >= weekStart).length;
  }, [state.sessions]);

  const badges = useMemo(() => buildBadges(state.sessions, dailyStreak), [state.sessions, dailyStreak]);

  const getBaniProgress = (baniId: number, baniName?: string): BaniProgressSummary => {
    const baniSessions = state.sessions.filter((session) => session.baniId === baniId);
    const dates = baniSessions.map((session) => dateKey(session.completedAt));

    return {
      baniId,
      baniName,
      progress: state.progressByBani[baniId] || 0,
      completions: baniSessions.length,
      completedToday: dates.includes(dateKey(new Date())),
      lastCompletedAt: baniSessions[0]?.completedAt,
      currentStreak: calculateStreak(dates),
      bestStreak: calculateBestStreak(dates),
    };
  };

  const value = {
    loading,
    sessions: state.sessions,
    progressByBani: state.progressByBani,
    weeklyGoal: WEEKLY_GOAL,
    weeklyCompleted,
    weeklyProgress: Math.min(1, weeklyCompleted / WEEKLY_GOAL),
    dailyStreak,
    badges,
    getBaniProgress,
    updateReadingProgress,
    completeBani,
    addReflection,
  };

  return <NitnemProgressContext.Provider value={value}>{children}</NitnemProgressContext.Provider>;
};
