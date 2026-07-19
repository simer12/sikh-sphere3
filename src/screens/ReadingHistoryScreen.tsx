import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { useApp } from '../hooks/useApp';
import { AppText } from '../components/AppText';
import { ProgressRing } from '../components/ProgressRing';
import { useNitnemProgress } from '../contexts/NitnemProgressContext';

interface ReadingEntry {
  id: string;
  bani_name: string;
  bani_type: string;
  read_at: string;
  duration_seconds?: number;
}

export default function ReadingHistoryScreen({ navigation }: any) {
  const { user } = useAuth();
  const { t, fontSize, colors } = useApp();
  const { weeklyCompleted, weeklyGoal, weeklyProgress, dailyStreak, badges, sessions } = useNitnemProgress();
  const [history, setHistory] = useState<ReadingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReads: 0,
    uniqueBanis: 0,
    currentStreak: 0,
    totalMinutes: 0,
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reading_history')
        .select('*')
        .eq('user_id', user.uid)
        .order('read_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data) {
        setHistory(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: ReadingEntry[]) => {
    const uniqueBanis = new Set(data.map((entry) => entry.bani_name)).size;
    const totalMinutes = Math.floor(
      data.reduce((sum, entry) => sum + (entry.duration_seconds || 0), 0) / 60
    );

    // Calculate current streak
    let streak = 0;
    const today = new Date().toDateString();
    const dates = data.map((entry) => new Date(entry.read_at).toDateString());
    const uniqueDates = [...new Set(dates)];

    if (uniqueDates.includes(today)) {
      streak = 1;
      let currentDate = new Date();
      for (let i = 1; i < 365; i++) {
        currentDate.setDate(currentDate.getDate() - 1);
        if (uniqueDates.includes(currentDate.toDateString())) {
          streak++;
        } else {
          break;
        }
      }
    }

    setStats({
      totalReads: data.length,
      uniqueBanis,
      currentStreak: streak,
      totalMinutes,
    });
  };

  const clearHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('reading_history')
        .delete()
        .eq('user_id', user.uid);

      if (error) throw error;

      setHistory([]);
      setStats({
        totalReads: 0,
        uniqueBanis: 0,
        currentStreak: 0,
        totalMinutes: 0,
      });
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const getBaniIcon = (type: string) => {
    switch (type) {
      case 'nitnem':
        return 'book';
      case 'dasam-granth':
        return 'library';
      default:
        return 'document-text';
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading your reading history...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="book-outline" size={80} color={colors.disabled} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Sign In Required</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Please sign in to track your reading history
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="flame" size={24} color={colors.accent} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{stats.currentStreak}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="book" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{stats.totalReads}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Reads</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="time" size={24} color={colors.accent} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{stats.totalMinutes}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Minutes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="library" size={24} color={colors.accent} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{stats.uniqueBanis}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Unique Banis</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Card style={[styles.momentumCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <View style={styles.momentumHeader}>
              <ProgressRing
                progress={weeklyProgress}
                value={`${Math.min(weeklyCompleted, weeklyGoal)}/${weeklyGoal}`}
                label="weekly goal"
                size={100}
              />
              <View style={styles.momentumCopy}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Nitnem momentum</Text>
                <Text style={[styles.momentumText, { color: colors.textSecondary }]}>
                  {dailyStreak > 0
                    ? `${dailyStreak} day streak. Keep it gentle and steady.`
                    : 'Start with one prayer. The goal is rhythm, not pressure.'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {badges.length > 0 && (
          <View style={styles.badgeSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Milestone badges</Text>
            {badges.slice(0, 6).map((badge) => (
              <View key={badge.id} style={[styles.badgeItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.badgeIcon, { backgroundColor: colors.surface }]}>
                  <Ionicons name={badge.icon as any} size={22} color={colors.primary} />
                </View>
                <View style={styles.badgeCopy}>
                  <Text style={[styles.badgeTitle, { color: colors.text }]}>{badge.title}</Text>
                  <Text style={[styles.badgeDescription, { color: colors.textSecondary }]}>{badge.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {sessions.some((session) => session.reflection) && (
          <View style={styles.reflectionSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent reflections</Text>
            {sessions
              .filter((session) => session.reflection)
              .slice(0, 3)
              .map((session) => (
                <View key={session.id} style={[styles.reflectionItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.reflectionBani, { color: colors.primary }]}>{session.baniName}</Text>
                  <Text style={[styles.reflectionText, { color: colors.text }]}>{session.reflection}</Text>
                </View>
              ))}
          </View>
        )}
      </View>

      {/* History List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Reading History</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={clearHistory}>
              <Text style={[styles.clearText, { color: colors.error }]}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {history.length === 0 ? (
          <Card style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Card.Content>
              <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={60} color={colors.disabled} />
                <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Reading History</Text>
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                  Start reading Banis to track your spiritual journey
                </Text>
                <TouchableOpacity
                  style={[styles.exploreButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('Nitnem')}
                >
                  <Text style={styles.exploreButtonText}>Explore Banis</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        ) : (
          history.map((entry) => (
            <Card key={entry.id} style={[styles.historyCard, { backgroundColor: colors.card }]}>
              <Card.Content>
                <View style={styles.historyItem}>
                  <View style={[styles.historyIconContainer, { backgroundColor: colors.surface }]}>
                    <Ionicons
                      name={getBaniIcon(entry.bani_type)}
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={[styles.historyTitle, { color: colors.text }]}>{entry.bani_name}</Text>
                    <View style={styles.historyMeta}>
                      <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                      <Text style={[styles.historyTime, { color: colors.textSecondary }]}>{formatDate(entry.read_at)}</Text>
                      {entry.duration_seconds && (
                        <>
                          <Text style={[styles.historyDivider, { color: colors.border }]}>•</Text>
                          <Text style={[styles.historyDuration, { color: colors.textSecondary }]}>
                            {Math.floor(entry.duration_seconds / 60)} min
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.disabled} />
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
  },
  momentumCard: {
    marginBottom: 16,
    elevation: 2,
  },
  momentumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  momentumCopy: {
    flex: 1,
  },
  momentumText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  badgeSection: {
    marginBottom: 16,
  },
  badgeItem: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCopy: {
    flex: 1,
    marginLeft: 12,
  },
  badgeTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  badgeDescription: {
    fontSize: 13,
    marginTop: 3,
  },
  reflectionSection: {
    marginBottom: 16,
  },
  reflectionItem: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  reflectionBani: {
    fontSize: 13,
    fontWeight: '700',
  },
  reflectionText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  historyCard: {
    marginBottom: 12,
    elevation: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
    marginLeft: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTime: {
    fontSize: 13,
    marginLeft: 4,
  },
  historyDivider: {
    marginHorizontal: 8,
  },
  historyDuration: {
    fontSize: 13,
  },
  emptyCard: {
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 20,
  },
  exploreButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
