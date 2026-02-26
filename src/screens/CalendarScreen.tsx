import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { 
  getNanakshahiEvents, 
  getCurrentNanakshahiYear, 
  NANAKSHAHI_MONTHS,
  SikhEvent 
} from '../services/nanakshahiCalendar';
import { useApp } from '../hooks/useApp';

export default function CalendarScreen() {
  const { colors } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const nanakshahiYear = getCurrentNanakshahiYear();
  const sikhEvents = getNanakshahiEvents();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'gurpurab':
        return 'star';
      case 'martyrdom':
        return 'flower';
      case 'historical':
        return 'flag';
      case 'festival':
        return 'sparkles';
      case 'gurgaddi':
        return 'trophy';
      case 'jotijot':
        return 'moon';
      case 'birth':
        return 'heart';
      default:
        return 'calendar';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'gurpurab':
        return colors.primary;
      case 'martyrdom':
        return '#FF6B6B';
      case 'historical':
        return '#4ECDC4';
      case 'festival':
        return '#FFB84D';
      case 'gurgaddi':
        return '#9B59B6';
      case 'jotijot':
        return '#34495E';
      case 'birth':
        return '#E91E63';
      default:
        return colors.textSecondary;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Ionicons name="calendar" size={40} color={colors.primary} />
        <Text style={[styles.headerText, { color: colors.text }]}>Sikh Calendar</Text>
        <Text style={[styles.subheaderText, { color: colors.textSecondary }]}>
          Nanakshahi {nanakshahiYear} (2025-2026 CE)
        </Text>
        <Text style={[styles.infoText, { color: colors.textTertiary }]}>
          🌟 Fixed solar calendar • Adopted in 1999
        </Text>
        <Text style={[styles.infoText, { fontWeight: 'bold', color: colors.primary, marginTop: 5 }]}>
          📅 {sikhEvents.length} Total Events
        </Text>
      </View>

      <View style={[styles.legendContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.legendTitle, { color: colors.text }]}>Event Types:</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <Ionicons name="star" size={16} color={colors.primary} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Gurpurab</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons name="flower" size={16} color="#FF6B6B" />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Martyrdom</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons name="flag" size={16} color="#4ECDC4" />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Historical</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons name="sparkles" size={16} color="#FFB84D" />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Festival</Text>
          </View>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <Ionicons name="trophy" size={16} color="#9B59B6" />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Gurgaddi</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons name="moon" size={16} color="#34495E" />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Joti Jot</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons name="heart" size={16} color="#E91E63" />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Birth</Text>
          </View>
        </View>
      </View>

      <View style={styles.eventsContainer}>
        {sikhEvents.map((event) => (
          <Card key={event.id} style={[styles.eventCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity>
              <Card.Content>
                <View style={styles.eventHeader}>
                  <Ionicons 
                    name={getEventIcon(event.type) as any} 
                    size={32} 
                    color={getEventColor(event.type)} 
                  />
                  <View style={styles.eventInfo}>
                    <Text style={[styles.eventName, { color: colors.text }]}>{event.name}</Text>
                    <Text style={[styles.eventNameGurmukhi, { color: colors.textSecondary }]}>{event.nameGurmukhi}</Text>
                    <Text style={[styles.eventNanakshahi, { color: '#FF8C00' }]}>{event.nanakshahiDate}</Text>
                    <Text style={[styles.eventDate, { color: colors.primary }]}>{event.gregorianDate}</Text>
                    {event.year && (
                      <Text style={[styles.eventYear, { color: colors.textTertiary }]}>Historical: {event.year}</Text>
                    )}
                    <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>{event.description}</Text>
                  </View>
                </View>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        ))}
      </View>
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
  infoText: {
    fontSize: 12,
    marginTop: 3,
  },
  legendContainer: {
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    marginLeft: 4,
  },
  eventsContainer: {
    padding: 16,
  },
  eventCard: {
    marginBottom: 12,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventInfo: {
    flex: 1,
    marginLeft: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventNameGurmukhi: {
    fontSize: 16,
    marginTop: 4,
  },
  eventNanakshahi: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  eventYear: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  eventDescription: {
    fontSize: 14,
    marginTop: 8,
  },
});
