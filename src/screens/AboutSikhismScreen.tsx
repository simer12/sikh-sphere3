import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { gurus, sikhConcepts } from '../data/banis';

export default function AboutSikhismScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSymbol}>ੴ</Text>
        <Text style={styles.headerText}>About Sikhism</Text>
        <Text style={styles.subheaderText}>Learn about the Sikh Faith</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The Ten Gurus</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {gurus.slice(0, 3).map((guru) => (
            <Card key={guru.id} style={styles.guruCard}>
              <TouchableOpacity onPress={() => navigation.navigate('GuruDetail', { guru })}>
                <Card.Content>
                  <View style={styles.guruIconContainer}>
                    <Ionicons name="person-circle" size={60} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.guruName}>{guru.name}</Text>
                  <Text style={styles.guruPeriod}>{guru.period}</Text>
                </Card.Content>
              </TouchableOpacity>
            </Card>
          ))}
          <Card style={styles.viewAllCard}>
            <TouchableOpacity onPress={() => navigation.navigate('GuruDetail', { guru: gurus[0] })}>
              <Card.Content>
                <View style={styles.viewAllContent}>
                  <Ionicons name="arrow-forward-circle" size={40} color={theme.colors.primary} />
                  <Text style={styles.viewAllText}>View All Gurus</Text>
                </View>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Concepts</Text>
        {sikhConcepts.map((concept) => (
          <Card key={concept.id} style={styles.conceptCard}>
            <Card.Content>
              <View style={styles.conceptHeader}>
                <Text style={styles.conceptTitleGurmukhi}>{concept.titleGurmukhi}</Text>
                <Text style={styles.conceptTitle}>{concept.title}</Text>
              </View>
              <Text style={styles.conceptDescription}>{concept.description}</Text>
              <TouchableOpacity style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>Read more</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sikh History</Text>
        <Card style={styles.historyCard}>
          <TouchableOpacity>
            <Card.Content>
              <View style={styles.historyItem}>
                <Ionicons name="book" size={32} color={theme.colors.primary} />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>Foundation of Sikhism</Text>
                  <Text style={styles.historyDate}>1469 CE</Text>
                </View>
              </View>
            </Card.Content>
          </TouchableOpacity>
        </Card>
        
        <Card style={styles.historyCard}>
          <TouchableOpacity>
            <Card.Content>
              <View style={styles.historyItem}>
                <Ionicons name="shield" size={32} color={theme.colors.primary} />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>Birth of Khalsa</Text>
                  <Text style={styles.historyDate}>1699 CE - Vaisakhi</Text>
                </View>
              </View>
            </Card.Content>
          </TouchableOpacity>
        </Card>
        
        <Card style={styles.historyCard}>
          <TouchableOpacity>
            <Card.Content>
              <View style={styles.historyItem}>
                <Ionicons name="star" size={32} color={theme.colors.primary} />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>Sikh Empire</Text>
                  <Text style={styles.historyDate}>1799-1849 CE</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerSymbol: {
    fontSize: 50,
    color: theme.colors.primary,
    fontWeight: 'bold',
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#333',
    textAlign: 'center',
  },
  guruPeriod: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  viewAllCard: {
    width: 150,
    justifyContent: 'center',
    elevation: 2,
    backgroundColor: '#FFF9E6',
  },
  viewAllContent: {
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
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
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  conceptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  conceptDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 14,
    color: theme.colors.primary,
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
    color: '#333',
  },
  historyDate: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 4,
  },
});
