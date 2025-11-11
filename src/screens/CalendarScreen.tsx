import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { 
  getNanakshahiEvents, 
  getCurrentNanakshahiYear, 
  NANAKSHAHI_MONTHS,
  SikhEvent 
} from '../services/nanakshahiCalendar';

export default function CalendarScreen() {
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
        return theme.colors.primary;
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
        return '#666';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="calendar" size={40} color={theme.colors.primary} />
        <Text style={styles.headerText}>Sikh Calendar</Text>
        <Text style={styles.subheaderText}>
          Nanakshahi {nanakshahiYear} (2025-2026 CE)
        </Text>
        <Text style={styles.infoText}>
          🌟 Fixed solar calendar • Adopted in 1999
        </Text>
        <Text style={[styles.infoText, { fontWeight: 'bold', color: theme.colors.primary, marginTop: 5 }]}>
          📅 {sikhEvents.length} Total Events
        </Text>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Event Types:</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <Ionicons name="star" size={16} color={theme.colors.primary} />
            <Text style={styles.legendText}>Gurpurab</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons name="flower" size={16} color="#FF6B6B" />
            <Text style={styles.legendText}>Martyrdom</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons name="flag" size={16} color="#4ECDC4" />
            <Text style={styles.legendText}>Historical</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons name="sparkles" size={16} color="#FFB84D" />
            <Text style={styles.legendText}>Festival</Text>
          </View>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <Ionicons name="trophy" size={16} color="#9B59B6" />
            <Text style={styles.legendText}>Gurgaddi</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons name="moon" size={16} color="#34495E" />
            <Text style={styles.legendText}>Joti Jot</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons name="heart" size={16} color="#E91E63" />
            <Text style={styles.legendText}>Birth</Text>
          </View>
        </View>
      </View>

      <View style={styles.eventsContainer}>
        {sikhEvents.map((event) => (
          <Card key={event.id} style={styles.eventCard}>
            <TouchableOpacity>
              <Card.Content>
                <View style={styles.eventHeader}>
                  <Ionicons 
                    name={getEventIcon(event.type) as any} 
                    size={32} 
                    color={getEventColor(event.type)} 
                  />
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventName}>{event.name}</Text>
                    <Text style={styles.eventNameGurmukhi}>{event.nameGurmukhi}</Text>
                    <Text style={styles.eventNanakshahi}>{event.nanakshahiDate}</Text>
                    <Text style={styles.eventDate}>{event.gregorianDate}</Text>
                    {event.year && (
                      <Text style={styles.eventYear}>Historical: {event.year}</Text>
                    )}
                    <Text style={styles.eventDescription}>{event.description}</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subheaderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  legendContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#666',
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
    color: '#333',
  },
  eventNameGurmukhi: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  eventNanakshahi: {
    fontSize: 13,
    color: '#FF8C00',
    fontWeight: '600',
    marginTop: 6,
  },
  eventDate: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  eventYear: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 2,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
