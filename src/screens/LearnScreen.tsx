import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../hooks/useApp';

interface Lesson {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  content: string;
}

export default function LearnScreen() {
  const { colors } = useApp();
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Gurmukhi Alphabet - Part 1 (ੳ to ਙ)',
      level: 'beginner',
      completed: false,
      content: 'ੳ ਅ ੲ ਸ ਹ ਕ ਖ ਗ ਘ ਙ',
    },
    {
      id: '2',
      title: 'Gurmukhi Alphabet - Part 2 (ਚ to ਞ)',
      level: 'beginner',
      completed: false,
      content: 'ਚ ਛ ਜ ਝ ਞ',
    },
    {
      id: '3',
      title: 'Vowel Symbols (Laga Matra)',
      level: 'beginner',
      completed: false,
      content: 'ਾ ਿ ੀ ੁ ੂ ੇ ੈ ੋ ੌ',
    },
    {
      id: '4',
      title: 'Basic Words - Greetings',
      level: 'intermediate',
      completed: false,
      content: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ (Sat Sri Akal)',
    },
    {
      id: '5',
      title: 'Reading Simple Shabads',
      level: 'intermediate',
      completed: false,
      content: 'Practice reading basic Gurbani verses',
    },
  ]);

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = completedCount / lessons.length;

  const toggleLesson = (lessonId: string) => {
    setLessons(lessons.map(lesson => 
      lesson.id === lessonId 
        ? { ...lesson, completed: !lesson.completed }
        : lesson
    ));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
      default:
        return '#666';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Ionicons name="school" size={40} color={colors.primary} />
        <Text style={[styles.headerText, { color: colors.text }]}>Learn Gurmukhi</Text>
        <Text style={[styles.subheaderText, { color: colors.textSecondary }]}>Master the Sacred Script</Text>
      </View>

      <Card style={[styles.progressCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Text style={[styles.progressTitle, { color: colors.text }]}>Your Progress</Text>
          <ProgressBar progress={progress} color={colors.primary} style={styles.progressBar} />
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {completedCount} of {lessons.length} lessons completed
          </Text>
        </Card.Content>
      </Card>

      <View style={[styles.alphabetCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.alphabetTitle, { color: colors.primary }]}>Gurmukhi Alphabet</Text>
        <Text style={[styles.alphabetText, { color: colors.text }]}>
          ੳ ਅ ੲ ਸ ਹ ਕ ਖ ਗ ਘ ਙ {'\n'}
          ਚ ਛ ਜ ਝ ਞ ਟ ਠ ਡ ਢ ਣ {'\n'}
          ਤ ਥ ਦ ਧ ਨ ਪ ਫ ਬ ਭ ਮ {'\n'}
          ਯ ਰ ਲ ਵ ੜ ਸ਼ ਖ਼ ਗ਼ ਜ਼ ਫ਼
        </Text>
      </View>

      <View style={styles.lessonsContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Lessons</Text>
        {lessons.map((lesson) => (
          <Card key={lesson.id} style={[styles.lessonCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity onPress={() => toggleLesson(lesson.id)}>
              <Card.Content>
                <View style={styles.lessonHeader}>
                  <View style={styles.lessonInfo}>
                    <Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson.title}</Text>
                    <View style={styles.levelBadge}>
                      <Text style={[styles.levelText, { color: getLevelColor(lesson.level) }]}>
                        {lesson.level.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[styles.lessonContent, { color: colors.textSecondary }]}>{lesson.content}</Text>
                  </View>
                  <Ionicons 
                    name={lesson.completed ? 'checkmark-circle' : 'play-circle-outline'} 
                    size={40} 
                    color={lesson.completed ? '#4CAF50' : colors.primary} 
                  />
                </View>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      <Card style={[styles.quizCard, { backgroundColor: colors.surface }]}>
        <TouchableOpacity>
          <Card.Content>
            <View style={styles.quizContent}>
              <Ionicons name="trophy" size={40} color="#FFD700" />
              <View style={styles.quizInfo}>
                <Text style={[styles.quizTitle, { color: colors.text }]}>Take a Quiz</Text>
                <Text style={[styles.quizDescription, { color: colors.textSecondary }]}>Test your Gurmukhi knowledge</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
            </View>
          </Card.Content>
        </TouchableOpacity>
      </Card>
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
    fontSize: 14,
    marginTop: 5,
  },
  progressCard: {
    margin: 16,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  alphabetCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  alphabetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  alphabetText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'center',
  },
  lessonsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  lessonCard: {
    marginBottom: 12,
    elevation: 2,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelBadge: {
    marginTop: 4,
    marginBottom: 8,
  },
  levelText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  lessonContent: {
    fontSize: 18,
    marginTop: 4,
  },
  quizCard: {
    margin: 16,
    elevation: 3,
  },
  quizContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizInfo: {
    flex: 1,
    marginLeft: 16,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quizDescription: {
    fontSize: 14,
    marginTop: 4,
  },
});
