import React, { useRef, useState } from 'react';
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../hooks/useApp';
import { useNitnemProgress } from '../contexts/NitnemProgressContext';
import { useNitnemRoutines } from '../contexts/NitnemRoutineContext';
import { hapticFeedback } from '../utils/haptics';

export default function BaniDetailScreen({ route }: any) {
  const { bani } = route.params;
  const routineId = route.params?.routineId;
  const { colors } = useApp();
  const { getBaniProgress, updateReadingProgress, completeBani } = useNitnemProgress();
  const { getRoutineById } = useNitnemRoutines();
  const routine = getRoutineById(routineId);
  const savedProgress = getBaniProgress(bani.id, bani.name);
  const [currentProgress, setCurrentProgress] = useState(savedProgress.progress);
  const [reflectionVisible, setReflectionVisible] = useState(false);
  const [reflection, setReflection] = useState('');
  const [savingCompletion, setSavingCompletion] = useState(false);
  const startedAtRef = useRef(Date.now());
  const lastSavedProgressRef = useRef(savedProgress.progress);

  const allVerses = bani.gurmukhi.split('\n\n').filter((verse: string) => verse.trim().length > 0);
  const visibleProgress = Math.max(currentProgress, savedProgress.progress);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollableHeight = Math.max(contentSize.height - layoutMeasurement.height, 1);
    const nextProgress = Math.min(1, Math.max(0, contentOffset.y / scrollableHeight));

    setCurrentProgress(nextProgress);

    if (nextProgress - lastSavedProgressRef.current >= 0.08 || nextProgress >= 0.98) {
      lastSavedProgressRef.current = nextProgress;
      updateReadingProgress(bani.id, nextProgress);
    }
  };

  const openReflectionPrompt = () => {
    hapticFeedback.success();
    setReflectionVisible(true);
  };

  const saveCompletion = async (reflectionText?: string) => {
    setSavingCompletion(true);
    const durationSeconds = Math.max(30, Math.round((Date.now() - startedAtRef.current) / 1000));

    try {
      await completeBani({
        baniId: bani.id,
        baniName: bani.name,
        routineId,
        durationSeconds,
        reflection: reflectionText,
      });
      setCurrentProgress(1);
      setReflection('');
      setReflectionVisible(false);
    } finally {
      setSavingCompletion(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.baniName, { color: colors.text }]}>{bani.nameGurmukhi}</Text>
        <Text style={[styles.verseCount, { color: colors.textSecondary }]}>{allVerses.length} verses</Text>
        {routine && (
          <View style={[styles.routinePill, { backgroundColor: colors.surface }]}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={[styles.routinePillText, { color: colors.primary }]}>{routine.name} at {routine.reminderTime}</Text>
          </View>
        )}
        <View style={styles.headerMeta}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {savedProgress.completedToday ? 'Completed today' : `${Math.round(visibleProgress * 100)}% read`}
          </Text>
          {savedProgress.currentStreak > 0 && (
            <Text style={[styles.progressText, { color: colors.primary }]}>
              {savedProgress.currentStreak} day {bani.name} streak
            </Text>
          )}
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: savedProgress.completedToday ? colors.success : colors.primary,
                width: `${Math.max(savedProgress.completedToday ? 100 : Math.round(visibleProgress * 100), 2)}%`,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
        scrollEventThrottle={300}
        onScroll={handleScroll}
      >
        {allVerses.map((verse: string, index: number) => (
          <View key={`verse-${index}`} style={[styles.verseBlock, { borderBottomColor: colors.border }]}>
            <Text style={[styles.gurmukhiText, { color: colors.text }]}>{verse}</Text>
          </View>
        ))}

        <View style={[styles.endMarker, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
          <Text style={[styles.endText, { color: colors.primary }]}>End</Text>
          <Text style={[styles.endTextEnglish, { color: colors.textSecondary }]}>End of {bani.name}</Text>
        </View>

        <View style={[styles.completionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons
            name={savedProgress.completedToday ? 'checkmark-circle' : 'leaf-outline'}
            size={30}
            color={savedProgress.completedToday ? colors.success : colors.accent}
          />
          <Text style={[styles.completionTitle, { color: colors.text }]}>
            {savedProgress.completedToday ? 'Reading completed today' : 'Mark this reading complete'}
          </Text>
          <Text style={[styles.completionCopy, { color: colors.textSecondary }]}>
            {savedProgress.completedToday
              ? 'Your progress is saved. Come back gently when it is time again.'
              : 'Completion marks help build a calm streak and unlock consistency badges.'}
          </Text>
          {!savedProgress.completedToday && (
            <TouchableOpacity style={[styles.completeButton, { backgroundColor: colors.primary }]} onPress={openReflectionPrompt}>
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.completeButtonText}>Complete reading</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal visible={reflectionVisible} transparent animationType="fade" onRequestClose={() => setReflectionVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.reflectionModal, { backgroundColor: colors.card }]}>
            <Text style={[styles.reflectionTitle, { color: colors.text }]}>A quiet reflection</Text>
            <Text style={[styles.reflectionPrompt, { color: colors.textSecondary }]}>
              What is one thought, feeling, or line you want to carry from this reading?
            </Text>
            <TextInput
              value={reflection}
              onChangeText={setReflection}
              multiline
              placeholder="Write a few words..."
              placeholderTextColor={colors.textTertiary}
              style={[
                styles.reflectionInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: colors.border }]}
                disabled={savingCompletion}
                onPress={() => saveCompletion()}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                disabled={savingCompletion}
                onPress={() => saveCompletion(reflection)}
              >
                <Text style={styles.primaryButtonText}>{savingCompletion ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  baniName: {
    fontSize: 24,
    fontWeight: '600',
  },
  verseCount: {
    fontSize: 14,
    marginTop: 4,
  },
  routinePill: {
    marginTop: 10,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routinePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  headerMeta: {
    width: '100%',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressTrack: {
    width: '100%',
    height: 7,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 60,
  },
  verseBlock: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  gurmukhiText: {
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 40,
    textAlign: 'left',
    letterSpacing: 0.3,
  },
  endMarker: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  endText: {
    fontSize: 28,
    fontWeight: '600',
  },
  endTextEnglish: {
    fontSize: 16,
    marginTop: 8,
  },
  completionCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  completionCopy: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  completeButton: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  reflectionModal: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 14,
    padding: 20,
  },
  reflectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  reflectionPrompt: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  reflectionInput: {
    minHeight: 110,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  primaryButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
