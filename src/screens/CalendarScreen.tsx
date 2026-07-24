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

const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarScreen() {
  const { colors } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const nanakshahiYear = getCurrentNanakshahiYear();
  const sikhEvents = getNanakshahiEvents();

  const filteredEvents = sikhEvents.filter((event) => {
    return event.gregorianDate.startsWith(GREGORIAN_MONTHS[selectedMonth]);
  });

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Ionicons name="calendar" size={32} color={colors.primary} />
        <Text style={[styles.headerText, { color: colors.text }]}>Sikh Calendar</Text>
        <Text style={[styles.subheaderText, { color: colors.textSecondary }]}>
          Nanakshahi {nanakshahiYear} (2025-2026 CE)
        </Text>
      </View>

      {/* Month Selector Tabs */}
      <View style={[styles.monthTabsContainer, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthTabsScroll}>
          {GREGORIAN_MONTHS.map((month, index) => {
            const isSelected = selectedMonth === index;
            return (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthTab,
                  isSelected && { borderBottomColor: colors.primary }
                ]}
                onPress={() => setSelectedMonth(index)}
              >
                <Text
                  style={[
                    styles.monthTabText,
                    { color: isSelected ? colors.primary : colors.textSecondary },
                    isSelected && { fontWeight: '700' }
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Legend */}
        <View style={[styles.legendContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.legendTitle, { color: colors.text }]}>Event Types:</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <Ionicons name="star" size={14} color={colors.primary} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Gurpurab</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="flower" size={14} color="#FF6B6B" />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Martyrdom</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="flag" size={14} color="#4ECDC4" />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Historical</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="sparkles" size={14} color="#FFB84D" />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Festival</Text>
            </View>
          </View>
        </View>

        {/* Events List */}
        <View style={styles.eventsContainer}>
          {filteredEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No historical events recorded for {GREGORIAN_MONTHS[selectedMonth]}
              </Text>
            </View>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event.id} style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Card.Content>
                  <View style={styles.eventHeader}>
                    <Ionicons 
                      name={getEventIcon(event.type) as any} 
                      size={28} 
                      color={getEventColor(event.type)} 
                    />
                    <View style={styles.eventInfo}>
                      <Text style={[styles.eventName, { color: colors.text }]}>{event.name}</Text>
                      <Text style={[styles.eventNameGurmukhi, { color: colors.textSecondary }]}>{event.nameGurmukhi}</Text>
                      <View style={styles.dateBadgeContainer}>
                        <View style={[styles.badge, { backgroundColor: colors.surface }]}>
                          <Text style={[styles.badgeText, { color: colors.primary }]}>{event.gregorianDate}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: colors.surface }]}>
                          <Text style={[styles.badgeText, { color: '#FF8C00' }]}>{event.nanakshahiDate}</Text>
                        </View>
                      </View>
                      {event.year && (
                        <Text style={[styles.eventYear, { color: colors.textTertiary }]}>Historical Year: {event.year}</Text>
                      )}
                      <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>{event.description}</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 6,
  },
  subheaderText: {
    fontSize: 13,
    marginTop: 2,
  },
  monthTabsContainer: {
    borderBottomWidth: 1,
    height: 48,
  },
  monthTabsScroll: {
    paddingHorizontal: 12,
  },
  monthTab: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  monthTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  legendContainer: {
    padding: 12,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 1,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    fontSize: 11,
  },
  eventsContainer: {
    padding: 16,
  },
  eventCard: {
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventInfo: {
    flex: 1,
    marginLeft: 14,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventNameGurmukhi: {
    fontSize: 14,
    marginTop: 2,
  },
  dateBadgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventYear: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 6,
  },
  eventDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
