import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function GuruDetailScreen({ route }: any) {
  const { guru } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-circle" size={100} color={theme.colors.primary} />
        </View>
        <Text style={styles.guruName}>{guru.name}</Text>
        <Text style={styles.guruNameGurmukhi}>{guru.nameGurmukhi}</Text>
        <Text style={styles.period}>{guru.period}</Text>
        {guru.gurushipPeriod && (
          <Text style={styles.gurushipPeriod}>Guruship: {guru.gurushipPeriod}</Text>
        )}
        <Text style={styles.birthPlace}>Born: {guru.birthPlace}</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>📖 About</Text>
          <Text style={styles.description}>{guru.description}</Text>
        </Card.Content>
      </Card>

      {guru.teachings && guru.teachings.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>🌟 Key Teachings</Text>
            {guru.teachings.map((teaching: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{teaching}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {guru.keyEvents && guru.keyEvents.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>🏛️ Key Events</Text>
            {guru.keyEvents.map((event: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{event}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>💎 Legacy</Text>
          <Text style={styles.legacyText}>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    marginBottom: 12,
  },
  guruName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  guruNameGurmukhi: {
    fontSize: 20,
    color: theme.colors.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  period: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  gurushipPeriod: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  birthPlace: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  card: {
    margin: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: theme.colors.primary,
    marginRight: 8,
    fontWeight: 'bold',
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  legacyText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
