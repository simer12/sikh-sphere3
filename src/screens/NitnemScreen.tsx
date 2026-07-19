import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { nitnemBanisMetadata, Bani } from '../data/banis';
import { fetchBaniFromAPI, convertBaniDBToBani } from '../services/banidb';
import { useApp } from '../hooks/useApp';
import { AppText } from '../components/AppText';
import { SearchBar } from '../components/SearchBar';
import { ErrorMessage } from '../components/ErrorMessage';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { ProgressRing } from '../components/ProgressRing';
import { useNitnemProgress } from '../contexts/NitnemProgressContext';
import { useNitnemRoutines } from '../contexts/NitnemRoutineContext';

export default function NitnemScreen({ navigation, route }: any) {
  const { t, fontSize, colors } = useApp();
  const { weeklyCompleted, weeklyGoal, weeklyProgress, dailyStreak, getBaniProgress } = useNitnemProgress();
  const { getRoutineById } = useNitnemRoutines();
  const routineId = route?.params?.routineId;
  const activeRoutine = getRoutineById(routineId);
  const [banis, setBanis] = useState<Bani[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBanisFromAPI();
  }, []);

  const loadBanisFromAPI = async () => {
    try {
      // Check local cache first for instant display
      if (banis.length === 0) {
        const cached = await AsyncStorage.getItem('cached_nitnem_banis');
        if (cached) {
          setBanis(JSON.parse(cached));
          setLoading(false);
        }
      }

      setRefreshing(true);
      setError(null);
      const loadedBanis: Bani[] = [];

      // Fetch all Nitnem Banis from API using metadata
      for (const baniMeta of nitnemBanisMetadata) {
        try {
          console.log(`Fetching ${baniMeta.name} (IDs: ${baniMeta.apiIds.join(', ')})...`);
          const apiData = await Promise.all(baniMeta.apiIds.map(apiId => fetchBaniFromAPI(apiId)));
          const convertedBani = convertBaniDBToBani(apiData, baniMeta);
          loadedBanis.push(convertedBani);
        } catch (err) {
          console.error(`Error loading Bani ${baniMeta.id} (${baniMeta.name}):`, err);
          throw err;
        }
      }

      setBanis(loadedBanis);
      await AsyncStorage.setItem('cached_nitnem_banis', JSON.stringify(loadedBanis));
      console.log(`Successfully loaded ${loadedBanis.length} Banis from BaniDB API and cached them`);
    } catch (err) {
      console.error('Error loading Banis from API, checking for offline cache:', err);
      
      try {
        const cached = await AsyncStorage.getItem('cached_nitnem_banis');
        if (cached) {
          setBanis(JSON.parse(cached));
          setError(null);
          console.log('Successfully fell back to offline cached Nitnem Banis.');
          return;
        }
      } catch (cacheErr) {
        console.error('Failed to read cached banis:', cacheErr);
      }

      if (banis.length === 0) {
        setError('Failed to load Banis from BaniDB API. Please check your internet connection.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Ionicons name="book" size={40} color={colors.primary} />
          <AppText variant="title" style={[styles.headerText, { color: colors.text }]}>{t.dailyPrayers}</AppText>
          <AppText variant="subtitle" style={[styles.subheaderText, { color: colors.textSecondary }]}>{t.nitnemBanis}</AppText>
        </View>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Ionicons name="book" size={40} color={colors.primary} />
          <AppText variant="title" style={[styles.headerText, { color: colors.text }]}>{t.dailyPrayers}</AppText>
          <AppText variant="subtitle" style={[styles.subheaderText, { color: colors.textSecondary }]}>{t.nitnemBanis}</AppText>
        </View>
        <ErrorMessage
          title={t.connectionError}
          message={error}
          onRetry={loadBanisFromAPI}
          retryLabel={t.retry}
        />
      </View>
    );
  }

  const routineBanis = activeRoutine
    ? activeRoutine.baniIds
        .map((baniId) => banis.find((bani) => bani.id === baniId))
        .filter(Boolean) as Bani[]
    : banis;

  const filteredBanis = routineBanis.filter(bani =>
    bani.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bani.nameGurmukhi.includes(searchQuery) ||
    bani.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={loadBanisFromAPI}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Ionicons name="book" size={40} color={colors.primary} />
        <AppText variant="title" style={[styles.headerText, { color: colors.text }]}>{t.dailyPrayers}</AppText>
        <AppText variant="subtitle" style={[styles.subheaderText, { color: colors.textSecondary }]}>{t.nitnemBanis}</AppText>
        <AppText variant="caption" style={[styles.successText, { color: colors.success }]}>✓ {t.loadedFromAPI}</AppText>
      </View>

      <Card style={[styles.goalCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.goalContent}>
            <ProgressRing
              progress={weeklyProgress}
              value={`${Math.min(weeklyCompleted, weeklyGoal)}/${weeklyGoal}`}
              label="this week"
              size={96}
            />
            <View style={styles.goalCopy}>
              <Text style={[styles.goalTitle, { color: colors.text }]}>Gentle weekly goal</Text>
              <Text style={[styles.goalText, { color: colors.textSecondary }]}>
                Complete {weeklyGoal} prayers this week. No pressure, just a steady return.
              </Text>
              <View style={styles.streakPill}>
                <Ionicons name="flame-outline" size={15} color={colors.primary} />
                <Text style={[styles.streakText, { color: colors.primary }]}>{dailyStreak} day Nitnem streak</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <SearchBar
        placeholder={activeRoutine ? `Search ${activeRoutine.name}...` : 'Search Banis...'}
        onSearch={setSearchQuery}
      />

      {activeRoutine && (
        <Card style={[styles.activeRoutineCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <View style={styles.activeRoutineHeader}>
              <View>
                <Text style={[styles.activeRoutineTitle, { color: colors.text }]}>{activeRoutine.name}</Text>
                <Text style={[styles.activeRoutineText, { color: colors.textSecondary }]}>
                  Scheduled at {activeRoutine.reminderTime}. Complete each Bani here to fill this routine.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.allBanisButton, { borderColor: colors.border }]}
                onPress={() => navigation.setParams({ routineId: undefined })}
              >
                <Text style={[styles.allBanisText, { color: colors.primary }]}>All</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      )}

      {filteredBanis.map((bani) => {
        const progress = getBaniProgress(bani.id, bani.name);
        const percent = Math.round(progress.progress * 100);

        return (
          <Card key={bani.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <TouchableOpacity onPress={() => navigation.navigate('BaniDetail', { bani, routineId: activeRoutine?.id })}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleContainer}>
                    <View style={styles.titleRow}>
                      <Title style={[styles.baniName, { color: colors.primary }]}>{bani.name}</Title>
                      {progress.completedToday && (
                        <View style={[styles.donePill, { backgroundColor: colors.success }]}>
                          <Ionicons name="checkmark" size={13} color="#fff" />
                          <Text style={styles.donePillText}>Done today</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.baniNameGurmukhi, { color: colors.text }]}>{bani.nameGurmukhi}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={colors.primary} />
                </View>
                <Paragraph style={[styles.description, { color: colors.textSecondary }]}>{bani.description}</Paragraph>
                <View style={styles.progressMeta}>
                  <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                    {progress.completedToday ? 'Completed today' : percent > 0 ? `${percent}% read` : 'Ready when you are'}
                  </Text>
                  {progress.completions > 0 && (
                    <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                      {progress.completions} completion{progress.completions === 1 ? '' : 's'}
                    </Text>
                  )}
                </View>
                <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: progress.completedToday ? colors.success : colors.primary,
                        width: `${Math.max(progress.completedToday ? 100 : percent, percent > 0 ? 8 : 0)}%`,
                      },
                    ]}
                  />
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>{bani.time}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="hourglass-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>{bani.duration}</Text>
                  </View>
                </View>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        );
      })}
      {activeRoutine && filteredBanis.length === 0 && (
        <Card style={[styles.emptyRoutineCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Ionicons name="calendar-outline" size={34} color={colors.primary} />
            <Text style={[styles.emptyRoutineTitle, { color: colors.text }]}>No Banis selected</Text>
            <Text style={[styles.emptyRoutineText, { color: colors.textSecondary }]}>
              Edit your daily Nitnem schedule and choose Banis for this routine.
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subheaderText: {
    fontSize: 16,
    marginTop: 5,
  },
  successText: {
    fontSize: 12,
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    margin: 12,
    elevation: 3,
  },
  goalCard: {
    margin: 12,
    elevation: 2,
  },
  activeRoutineCard: {
    marginHorizontal: 12,
    marginBottom: 4,
    elevation: 2,
  },
  activeRoutineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  activeRoutineTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  activeRoutineText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  allBanisButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  allBanisText: {
    fontSize: 13,
    fontWeight: '800',
  },
  emptyRoutineCard: {
    margin: 12,
    elevation: 2,
  },
  emptyRoutineTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
  },
  emptyRoutineText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  goalCopy: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  goalText: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  streakPill: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  baniName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  donePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  donePillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  baniNameGurmukhi: {
    fontSize: 20,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressTrack: {
    height: 7,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
