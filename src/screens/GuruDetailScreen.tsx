import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../hooks/useApp';

export default function GuruDetailScreen({ route }: any) {
  const { guru } = route.params;
  const { colors } = useApp();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-circle" size={100} color={colors.primary} />
        </View>
        <Text style={[styles.guruName, { color: colors.text }]}>{guru.name}</Text>
        <Text style={[styles.guruNameGurmukhi, { color: colors.primary }]}>{guru.nameGurmukhi}</Text>
        <Text style={[styles.period, { color: colors.textSecondary }]}>{guru.period}</Text>
        {guru.gurushipPeriod && (
          <Text style={[styles.gurushipPeriod, { color: colors.primary }]}>Guruship: {guru.gurushipPeriod}</Text>
        )}
        <Text style={[styles.birthPlace, { color: colors.textSecondary }]}>Born: {guru.birthPlace}</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Text style={[styles.cardTitle, { color: colors.text }]}>📖 About</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{guru.description}</Text>
        </Card.Content>
      </Card>

      {guru.teachings && guru.teachings.length > 0 && (
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Text style={[styles.cardTitle, { color: colors.text }]}>🌟 Key Teachings</Text>
            {guru.teachings.map((teaching: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
                <Text style={[styles.listText, { color: colors.textSecondary }]}>{teaching}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {guru.keyEvents && guru.keyEvents.length > 0 && (
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Text style={[styles.cardTitle, { color: colors.text }]}>🏛️ Key Events</Text>
            {guru.keyEvents.map((event: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
                <Text style={[styles.listText, { color: colors.textSecondary }]}>{event}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Text style={[styles.cardTitle, { color: colors.text }]}>💎 Legacy</Text>
          <Text style={[styles.legacyText, { color: colors.textSecondary }]}>
            {guru.name} continues to inspire millions of Sikhs worldwide with teachings of equality,
            compassion, and devotion to the One Universal Creator.
          </Text>
        </Card.Content>
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
  iconContainer: {
    marginBottom: 12,
  },
  guruName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  guruNameGurmukhi: {
    fontSize: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  period: {
    fontSize: 16,
    marginTop: 8,
  },
  gurushipPeriod: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  birthPlace: {
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    margin: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  legacyText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
