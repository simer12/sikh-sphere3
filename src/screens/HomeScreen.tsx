import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { dailyQuotes } from '../data/banis';

export default function HomeScreen({ navigation }: any) {
  const [currentQuote, setCurrentQuote] = useState(dailyQuotes[0]);

  useEffect(() => {
    // Rotate quotes daily
    const quoteIndex = new Date().getDay() % dailyQuotes.length;
    setCurrentQuote(dailyQuotes[quoteIndex]);
  }, []);

  const features = [
    { title: 'Nitnem Banis', icon: 'book', screen: 'Nitnem', color: '#FF9933' },
    { title: 'Sikh History', icon: 'time', screen: 'History', color: '#8B4513' },
    { title: 'Live Kirtan', icon: 'radio', screen: 'Live Kirtan', color: '#000080' },
    { title: 'Daily Hukamnama', icon: 'newspaper', screen: 'Hukamnama', color: '#FF6B6B' },
    { title: 'Sikh Calendar', icon: 'calendar', screen: 'Calendar', color: '#4ECDC4' },
    { title: 'Find Gurdwara', icon: 'location', screen: 'GurdwaraFinder', color: '#95E1D3' },
    { title: 'Learn Gurmukhi', icon: 'school', screen: 'Learn', color: '#F38181' },
    { title: 'About Sikhism', icon: 'information-circle', screen: 'AboutSikhism', color: '#9B59B6' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ੴ</Text>
        <Text style={styles.headerSubtitle}>Akaal Seva</Text>
        <Text style={styles.headerTagline}>Your Spiritual Companion</Text>
      </View>

      {/* Daily Quote */}
      <Card style={styles.quoteCard}>
        <Card.Content>
          <Title style={styles.quoteTitle}>Daily Inspiration</Title>
          <Text style={styles.gurmukhiText}>{currentQuote.gurmukhi}</Text>
          <Text style={styles.transliteration}>{currentQuote.transliteration}</Text>
          <Paragraph style={styles.englishText}>{currentQuote.english}</Paragraph>
          <Text style={styles.reference}>{currentQuote.reference}</Text>
        </Card.Content>
      </Card>

      {/* Feature Grid */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Explore</Text>
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
              <Text style={styles.featureText}>{feature.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="sunny" size={24} color={theme.colors.primary} />
            <Text style={styles.statLabel}>Amrit Vela</Text>
            <Text style={styles.statValue}>4:00 AM</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="moon" size={24} color={theme.colors.primary} />
            <Text style={styles.statLabel}>Rehras Sahib</Text>
            <Text style={styles.statValue}>6:30 PM</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.primary,
    marginBottom: 10,
  },
  gurmukhiText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  transliteration: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  englishText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  reference: {
    fontSize: 12,
    color: theme.colors.primary,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  featuresContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
});
