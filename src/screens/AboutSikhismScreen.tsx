import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { gurus, sikhConcepts } from '../data/banis';
import { useApp } from '../hooks/useApp';

export default function AboutSikhismScreen({ navigation }: any) {
  const { colors } = useApp();
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerSymbol, { color: colors.primary }]}>ੴ</Text>
        <Text style={[styles.headerText, { color: colors.text }]}>About Sikhism</Text>
        <Text style={[styles.subheaderText, { color: colors.textSecondary }]}>Learn about the Sikh Faith</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>The Ten Gurus</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {gurus.slice(0, 3).map((guru) => (
            <Card key={guru.id} style={[styles.guruCard, { backgroundColor: colors.card }]}>
              <TouchableOpacity onPress={() => navigation.navigate('GuruDetail', { guru })}>
                <Card.Content>
                  <View style={styles.guruIconContainer}>
                    <Ionicons name="person-circle" size={60} color={colors.primary} />
                  </View>
                  <Text style={[styles.guruName, { color: colors.text }]}>{guru.name}</Text>
                  <Text style={[styles.guruPeriod, { color: colors.textSecondary }]}>{guru.period}</Text>
                </Card.Content>
              </TouchableOpacity>
            </Card>
          ))}
          <Card style={[styles.viewAllCard, { backgroundColor: colors.surface }]}>
            <TouchableOpacity onPress={() => navigation.navigate('GuruDetail', { guru: gurus[0] })}>
              <Card.Content>
                <View style={styles.viewAllContent}>
                  <Ionicons name="arrow-forward-circle" size={40} color={colors.primary} />
                  <Text style={[styles.viewAllText, { color: colors.primary }]}>View All Gurus</Text>
                </View>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Core Concepts</Text>
        {sikhConcepts.map((concept) => (
          <Card key={concept.id} style={[styles.conceptCard, { backgroundColor: colors.card }]}>
            <Card.Content>
              <View style={styles.conceptHeader}>
                <Text style={[styles.conceptTitleGurmukhi, { color: colors.primary }]}>{concept.titleGurmukhi}</Text>
                <Text style={[styles.conceptTitle, { color: colors.text }]}>{concept.title}</Text>
              </View>
              <Text style={[styles.conceptDescription, { color: colors.textSecondary }]}>{concept.description}</Text>
              <TouchableOpacity style={styles.readMoreButton}>
                <Text style={[styles.readMoreText, { color: colors.primary }]}>Read more</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sikh History</Text>
        <Card style={[styles.historyCard, { backgroundColor: colors.card }]}>
          <TouchableOpacity>
            <Card.Content>
              <View style={styles.historyItem}>
                <Ionicons name="book" size={32} color={colors.primary} />
                <View style={styles.historyInfo}>
                  <Text style={[styles.historyTitle, { color: colors.text }]}>Foundation of Sikhism</Text>
                  <Text style={[styles.historyDate, { color: colors.primary }]}>1469 CE</Text>
                </View>
              </View>
            </Card.Content>
          </TouchableOpacity>
        </Card>
        
        <Card style={[styles.historyCard, { backgroundColor: colors.card }]}>
          <TouchableOpacity>
            <Card.Content>
              <View style={styles.historyItem}>
                <Ionicons name="shield" size={32} color={colors.primary} />
                <View style={styles.historyInfo}>
                  <Text style={[styles.historyTitle, { color: colors.text }]}>Birth of Khalsa</Text>
                  <Text style={[styles.historyDate, { color: colors.primary }]}>1699 CE - Vaisakhi</Text>
                </View>
              </View>
            </Card.Content>
          </TouchableOpacity>
        </Card>
        
        <Card style={[styles.historyCard, { backgroundColor: colors.card }]}>
          <TouchableOpacity>
            <Card.Content>
              <View style={styles.historyItem}>
                <Ionicons name="star" size={32} color={colors.primary} />
                <View style={styles.historyInfo}>
                  <Text style={[styles.historyTitle, { color: colors.text }]}>Sikh Empire</Text>
                  <Text style={[styles.historyDate, { color: colors.primary }]}>1799-1849 CE</Text>
                </View>
              </View>
            </Card.Content>
          </TouchableOpacity>
        </Card>
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
  headerSymbol: {
    fontSize: 50,
    fontWeight: 'bold',
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  guruCard: {
    width: 150,
    marginRight: 12,
    elevation: 2,
  },
  guruIconContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  guruName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  guruPeriod: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  viewAllCard: {
    width: 150,
    justifyContent: 'center',
    elevation: 2,
  },
  viewAllContent: {
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  conceptCard: {
    marginBottom: 12,
    elevation: 2,
  },
  conceptHeader: {
    marginBottom: 8,
  },
  conceptTitleGurmukhi: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  conceptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  conceptDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  historyCard: {
    marginBottom: 12,
    elevation: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyDate: {
    fontSize: 14,
    marginTop: 4,
  },
});
