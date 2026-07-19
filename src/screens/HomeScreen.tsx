import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { dailyQuotes } from '../data/banis';
import { useApp } from '../hooks/useApp';
import { AppText } from '../components/AppText';
import { ProgressRing } from '../components/ProgressRing';
import { useNitnemProgress } from '../contexts/NitnemProgressContext';
import { getBaniMetaById, NitnemRoutine, useNitnemRoutines } from '../contexts/NitnemRoutineContext';

export default function HomeScreen({ navigation }: any) {
  const [currentQuote, setCurrentQuote] = useState(dailyQuotes[0]);
  const { t, fontSize, colors } = useApp();
  const { weeklyCompleted, weeklyGoal, weeklyProgress, dailyStreak, badges, getBaniProgress } = useNitnemProgress();
  const { getTodayRoutines, hasCustomSchedule } = useNitnemRoutines();
  const todayRoutines = getTodayRoutines();

  useEffect(() => {
    // Rotate quotes daily
    const quoteIndex = new Date().getDay() % dailyQuotes.length;
    setCurrentQuote(dailyQuotes[quoteIndex]);
  }, []);

  const features = [
    { title: t.nitnem, titleEn: 'Nitnem Banis', icon: 'book', screen: 'Nitnem', color: '#FF9933' },
    { title: 'Akaal Originals', titleEn: 'Sikh History Videos', icon: 'play-circle', screen: 'AkaalOriginals', color: '#111111' },
    { title: t.history, titleEn: 'Sikh History', icon: 'time', screen: 'History', color: '#8B4513' },
    { title: t.liveKirtan, titleEn: 'Live Kirtan', icon: 'radio', screen: 'Live Kirtan', color: '#000080' },
    { title: t.dailyHukamnama, titleEn: 'Daily Hukamnama', icon: 'newspaper', screen: 'Hukamnama', color: '#FF6B6B' },
    { title: t.sikhCalendar, titleEn: 'Sikh Calendar', icon: 'calendar', screen: 'Calendar', color: '#4ECDC4' },
  ];

  const getRoutineStatus = (routine: NitnemRoutine) => {
    const completed = routine.baniIds.filter((baniId) => getBaniProgress(baniId).completedToday).length;
    const total = routine.baniIds.length;
    return {
      completed,
      total,
      progress: total > 0 ? completed / total : 0,
      label: total === 0 ? 'No Banis selected' : completed === total ? 'Completed today' : `${completed} of ${total} completed`,
    };
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>ੴ</Text>
        <Text style={styles.headerSubtitle}>Akaal Seva</Text>
        <Text style={styles.headerTagline}>Your Spiritual Companion</Text>
      </View>

      {/* Daily Quote */}
      <Card style={[styles.quoteCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.quoteTitle, { fontSize: fontSize + 2, color: colors.primary }]}>Daily Inspiration</Title>
          <AppText variant="body" style={[styles.gurmukhiText, { fontSize: fontSize + 4, color: colors.text }]}>
            {currentQuote.gurmukhi}
          </AppText>
          <AppText variant="caption" style={[styles.transliteration, { color: colors.textSecondary }]}>
            {currentQuote.transliteration}
          </AppText>
          <AppText variant="body" style={[styles.englishText, { color: colors.text }]}>
            {currentQuote.english}
          </AppText>
          <AppText variant="caption" style={[styles.reference, { color: colors.primary }]}>
            {currentQuote.reference}
          </AppText>
        </Card.Content>
      </Card>

      <Card style={[styles.scheduleCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.scheduleHeader}>
            <View>
              <Text style={[styles.scheduleTitle, { color: colors.text }]}>Today's Nitnem</Text>
              <Text style={[styles.scheduleSubtitle, { color: colors.textSecondary }]}>Your personal daily schedule</Text>
            </View>
            <TouchableOpacity
              style={[styles.editScheduleButton, { borderColor: colors.border }]}
              onPress={() => navigation.navigate('More', { screen: 'RoutineBuilder' })}
            >
              <Ionicons name="create-outline" size={17} color={colors.primary} />
              <Text style={[styles.editScheduleText, { color: colors.primary }]}>Edit</Text>
            </TouchableOpacity>
          </View>

          {todayRoutines.length === 0 ? (
            <TouchableOpacity
              style={[styles.emptySchedule, { borderColor: colors.border }]}
              onPress={() => navigation.navigate('More', { screen: 'RoutineBuilder' })}
            >
              <Ionicons name="calendar-outline" size={22} color={colors.primary} />
              <Text style={[styles.emptyScheduleText, { color: colors.textSecondary }]}>
                Create your morning, afternoon, evening, and night rhythm.
              </Text>
            </TouchableOpacity>
          ) : (
            todayRoutines.map((routine) => {
              const status = getRoutineStatus(routine);
              const baniNames = routine.baniIds
                .map((baniId) => getBaniMetaById(baniId)?.name)
                .filter(Boolean)
                .join(', ');

              return (
                <TouchableOpacity
                  key={routine.id}
                  style={[styles.routineRow, { borderColor: colors.border }]}
                  onPress={() => navigation.navigate('Nitnem', { screen: 'NitnemList', params: { routineId: routine.id } })}
                >
                  <View style={[styles.routineTimeBadge, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.routineTime, { color: colors.primary }]}>{routine.reminderTime}</Text>
                  </View>
                  <View style={styles.routineRowBody}>
                    <View style={styles.routineRowHeader}>
                      <Text style={[styles.routineRowTitle, { color: colors.text }]}>{routine.name}</Text>
                      <Text style={[styles.routineRowStatus, { color: status.completed === status.total && status.total > 0 ? colors.success : colors.textSecondary }]}>
                        {status.label}
                      </Text>
                    </View>
                    <Text style={[styles.routineBaniNames, { color: colors.textSecondary }]} numberOfLines={1}>
                      {baniNames || 'Choose Banis for this routine'}
                    </Text>
                    <View style={[styles.scheduleProgressTrack, { backgroundColor: colors.surface }]}>
                      <View
                        style={[
                          styles.scheduleProgressFill,
                          {
                            backgroundColor: status.completed === status.total && status.total > 0 ? colors.success : colors.primary,
                            width: `${Math.max(Math.round(status.progress * 100), status.progress > 0 ? 8 : 0)}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {!hasCustomSchedule && (
            <TouchableOpacity
              style={[styles.setupPrompt, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('More', { screen: 'RoutineBuilder' })}
            >
              <Ionicons name="sparkles-outline" size={18} color={colors.accent} />
              <Text style={[styles.setupPromptText, { color: colors.textSecondary }]}>
                Tell us what you read morning, afternoon, evening, and night so this becomes your routine.
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.startScheduleButton, { backgroundColor: colors.primary }]}
            onPress={() =>
              todayRoutines[0]
                ? navigation.navigate('Nitnem', { screen: 'NitnemList', params: { routineId: todayRoutines[0].id } })
                : navigation.navigate('Nitnem')
            }
          >
            <Ionicons name="book-outline" size={18} color="#fff" />
            <Text style={styles.startScheduleText}>Read from Nitnem</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Feature Grid */}
      <View style={styles.featuresContainer}>
        <AppText variant="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>{t.explore}</AppText>
        <View style={styles.grid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { backgroundColor: feature.color }]}
              onPress={() => {
                if (feature.screen === 'Calendar') {
                  navigation.navigate('More', { screen: feature.screen });
                } else if (feature.screen === 'AkaalOriginals') {
                  navigation.navigate('AkaalOriginals');
                } else {
                  navigation.navigate(feature.screen);
                }
              }}
            >
              <Ionicons name={feature.icon as any} size={32} color="#fff" />
              <Text style={[styles.featureText, { fontSize: fontSize - 2 }]}>{feature.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Gentle Habit Progress */}
      <Card style={[styles.habitCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.habitHeader}>
            <View style={styles.habitTitleBlock}>
              <AppText variant="subtitle" style={[styles.habitTitle, { color: colors.text }]}>This week's rhythm</AppText>
              <AppText variant="caption" style={[styles.habitSubtitle, { color: colors.textSecondary }]}>
                Gentle goal: {weeklyGoal} prayers this week
              </AppText>
            </View>
            <ProgressRing
              progress={weeklyProgress}
              value={`${Math.min(weeklyCompleted, weeklyGoal)}/${weeklyGoal}`}
              label="prayers"
              size={104}
            />
          </View>

          <View style={styles.habitStatsRow}>
            <View style={[styles.habitStat, { backgroundColor: colors.surface }]}>
              <Ionicons name="flame-outline" size={20} color={colors.primary} />
              <Text style={[styles.habitStatValue, { color: colors.text }]}>{dailyStreak}</Text>
              <Text style={[styles.habitStatLabel, { color: colors.textSecondary }]}>day streak</Text>
            </View>
            <View style={[styles.habitStat, { backgroundColor: colors.surface }]}>
              <Ionicons name={(badges[0]?.icon || 'ribbon-outline') as any} size={20} color={colors.accent} />
              <Text style={[styles.badgeTitle, { color: colors.text }]} numberOfLines={1}>
                {badges[0]?.title || 'First badge awaits'}
              </Text>
              <Text style={[styles.habitStatLabel, { color: colors.textSecondary }]}>
                {badges[0] ? 'latest milestone' : 'complete one Bani'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.softReminder, { borderColor: colors.border }]}
            onPress={() => navigation.navigate('Nitnem')}
          >
            <Ionicons name="leaf-outline" size={18} color={colors.accent} />
            <Text style={[styles.softReminderText, { color: colors.textSecondary }]}>
              A short prayer today is enough to keep the thread warm.
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <AppText variant="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>{t.today}</AppText>
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Ionicons name="sunny" size={24} color={colors.primary} />
            <AppText variant="caption" style={[styles.statLabel, { color: colors.textSecondary }]}>Amrit Vela</AppText>
            <AppText variant="body" style={[styles.statValue, { color: colors.text }]}>4:00 AM</AppText>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Ionicons name="moon" size={24} color={colors.primary} />
            <AppText variant="caption" style={[styles.statLabel, { color: colors.textSecondary }]}>{t.rehrasSahib}</AppText>
            <AppText variant="body" style={[styles.statValue, { color: colors.text }]}>6:30 PM</AppText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 60,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
  },
  headerTagline: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  quoteCard: {
    margin: 16,
    elevation: 4,
  },
  scheduleCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 12,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  scheduleSubtitle: {
    fontSize: 13,
    marginTop: 3,
  },
  editScheduleButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  editScheduleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptySchedule: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emptyScheduleText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  routineRow: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  routineTimeBadge: {
    width: 56,
    minHeight: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routineTime: {
    fontSize: 13,
    fontWeight: '800',
  },
  routineRowBody: {
    flex: 1,
  },
  routineRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  routineRowTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  routineRowStatus: {
    fontSize: 12,
    fontWeight: '700',
  },
  routineBaniNames: {
    fontSize: 12,
    marginTop: 4,
  },
  scheduleProgressTrack: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
  },
  scheduleProgressFill: {
    height: '100%',
    borderRadius: 999,
  },
  startScheduleButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  startScheduleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  setupPrompt: {
    borderRadius: 10,
    padding: 12,
    marginTop: 2,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  setupPromptText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  habitCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  habitTitleBlock: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  habitSubtitle: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  habitStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  habitStat: {
    flex: 1,
    minHeight: 82,
    borderRadius: 10,
    padding: 12,
  },
  habitStatValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 6,
  },
  habitStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  softReminder: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  softReminderText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  quoteTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  gurmukhiText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  transliteration: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  englishText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  reference: {
    fontSize: 12,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  featuresContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  featureText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
