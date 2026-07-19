import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { nitnemBanisMetadata } from '../data/banis';
import { useApp } from '../hooks/useApp';
import { getBaniMetaById, NitnemRoutine, useNitnemRoutines } from '../contexts/NitnemRoutineContext';
import { hapticFeedback } from '../utils/haptics';

const timePresets: Record<string, string[]> = {
  morning: ['04:30', '05:00', '06:00', '07:00'],
  afternoon: ['12:00', '12:30', '13:00', '15:00'],
  evening: ['18:00', '18:30', '19:00', '20:00'],
  night: ['21:00', '21:30', '22:00', '22:30'],
};

const routineIcons: Record<string, string> = {
  morning: 'sunny-outline',
  afternoon: 'partly-sunny-outline',
  evening: 'moon-outline',
  night: 'cloudy-night-outline',
};

export default function RoutineBuilderScreen() {
  const { colors } = useApp();
  const {
    routines,
    toggleRoutineEnabled,
    toggleRoutineBani,
    setReminderTime,
    updateRoutine,
    resetToDefaultRoutines,
  } = useNitnemRoutines();

  const handleToggleBani = async (routineId: string, baniId: number) => {
    hapticFeedback.selection();
    await toggleRoutineBani(routineId, baniId);
  };

  const renderRoutine = (routine: NitnemRoutine) => {
    const selectedBanis = routine.baniIds
      .map((baniId) => getBaniMetaById(baniId))
      .filter(Boolean);

    return (
      <Card key={routine.id} style={[styles.routineCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.routineHeader}>
            <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
              <Ionicons name={(routineIcons[routine.timeOfDay] || 'time-outline') as any} size={22} color={colors.primary} />
            </View>
            <View style={styles.routineTitleBlock}>
              <Text style={[styles.routineName, { color: colors.text }]}>{routine.name}</Text>
              <Text style={[styles.routineSummary, { color: colors.textSecondary }]}>
                {selectedBanis.length > 0
                  ? selectedBanis.map((bani) => bani?.name).join(', ')
                  : 'Choose Banis for this time'}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.enabledToggle,
                {
                  backgroundColor: routine.enabled ? colors.primary : colors.surface,
                  borderColor: routine.enabled ? colors.primary : colors.border,
                },
              ]}
              onPress={() => toggleRoutineEnabled(routine.id)}
            >
              <Ionicons name={routine.enabled ? 'checkmark' : 'pause-outline'} size={18} color={routine.enabled ? '#fff' : colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Reminder time</Text>
            <View style={styles.presetRow}>
              {(timePresets[routine.timeOfDay] || []).map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: routine.reminderTime === time ? colors.primary : colors.surface,
                      borderColor: routine.reminderTime === time ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setReminderTime(routine.id, time)}
                >
                  <Text style={[styles.timeChipText, { color: routine.reminderTime === time ? '#fff' : colors.text }]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.reminderModeRow}
              onPress={() =>
                updateRoutine(routine.id, {
                  reminderMode: routine.reminderMode === 'gentle' ? 'standard' : routine.reminderMode === 'standard' ? 'silent' : 'gentle',
                  reminderEnabled: routine.reminderMode !== 'standard',
                })
              }
            >
              <Ionicons
                name={routine.reminderMode === 'silent' ? 'notifications-off-outline' : 'notifications-outline'}
                size={17}
                color={colors.textSecondary}
              />
              <Text style={[styles.reminderModeText, { color: colors.textSecondary }]}>
                {routine.reminderMode === 'gentle'
                  ? 'Gentle reminder'
                  : routine.reminderMode === 'standard'
                    ? 'Reminder with one follow-up'
                    : 'Schedule only, no reminder'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Banis for this routine</Text>
            <View style={styles.baniGrid}>
              {nitnemBanisMetadata.map((bani) => {
                const selected = routine.baniIds.includes(bani.id);
                return (
                  <TouchableOpacity
                    key={bani.id}
                    style={[
                      styles.baniChip,
                      {
                        backgroundColor: selected ? colors.primary : colors.surface,
                        borderColor: selected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => handleToggleBani(routine.id, bani.id)}
                  >
                    <Ionicons name={selected ? 'checkmark-circle' : 'add-circle-outline'} size={16} color={selected ? '#fff' : colors.primary} />
                    <Text style={[styles.baniChipText, { color: selected ? '#fff' : colors.text }]}>{bani.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Daily Nitnem</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Shape your morning, afternoon, evening, and night rhythm. You can keep this gentle and change it anytime.
        </Text>
      </View>

      {routines.map(renderRoutine)}

      <TouchableOpacity style={[styles.resetButton, { borderColor: colors.border }]} onPress={resetToDefaultRoutines}>
        <Ionicons name="refresh-outline" size={18} color={colors.textSecondary} />
        <Text style={[styles.resetText, { color: colors.textSecondary }]}>Reset to common Nitnem routine</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  routineCard: {
    marginBottom: 14,
    elevation: 2,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineTitleBlock: {
    flex: 1,
    marginLeft: 12,
  },
  routineName: {
    fontSize: 18,
    fontWeight: '800',
  },
  routineSummary: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  enabledToggle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBlock: {
    marginTop: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  reminderModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 7,
  },
  reminderModeText: {
    fontSize: 13,
  },
  baniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  baniChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  baniChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  resetButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
