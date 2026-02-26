import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { dailyQuotes } from '../data/banis';
import { useApp } from '../hooks/useApp';
import { AppText } from '../components/AppText';

export default function HomeScreen({ navigation }: any) {
  const [currentQuote, setCurrentQuote] = useState(dailyQuotes[0]);
  const { t, fontSize, colors } = useApp();

  useEffect(() => {
    // Rotate quotes daily
    const quoteIndex = new Date().getDay() % dailyQuotes.length;
    setCurrentQuote(dailyQuotes[quoteIndex]);
  }, []);

  const features = [
    { title: t.nitnem, titleEn: 'Nitnem Banis', icon: 'book', screen: 'Nitnem', color: '#FF9933' },
    { title: t.history, titleEn: 'Sikh History', icon: 'time', screen: 'History', color: '#8B4513' },
    { title: t.liveKirtan, titleEn: 'Live Kirtan', icon: 'radio', screen: 'Live Kirtan', color: '#000080' },
    { title: t.dailyHukamnama, titleEn: 'Daily Hukamnama', icon: 'newspaper', screen: 'Hukamnama', color: '#FF6B6B' },
    { title: t.sikhCalendar, titleEn: 'Sikh Calendar', icon: 'calendar', screen: 'Calendar', color: '#4ECDC4' },
    { title: 'Find Gurdwara', titleEn: 'Find Gurdwara', icon: 'location', screen: 'GurdwaraFinder', color: '#95E1D3' },
    { title: 'Learn Gurmukhi', titleEn: 'Learn Gurmukhi', icon: 'school', screen: 'Learn', color: '#F38181' },
    { title: 'About Sikhism', titleEn: 'About Sikhism', icon: 'information-circle', screen: 'AboutSikhism', color: '#9B59B6' },
  ];

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

      {/* Feature Grid */}
      <View style={styles.featuresContainer}>
        <AppText variant="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>{t.explore}</AppText>
        <View style={styles.grid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { backgroundColor: feature.color }]}
              onPress={() => {
                if (feature.screen === 'Calendar' || feature.screen === 'GurdwaraFinder' || feature.screen === 'Learn' || feature.screen === 'AboutSikhism') {
                  navigation.navigate('More', { screen: feature.screen });
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
