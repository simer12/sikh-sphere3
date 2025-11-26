import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { dasamGranthBanis, DASAM_GRANTH_TOTAL_VERSES } from '../data/dasamGranth';

export default function DasamGranthScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.ikOnkar}>ੴ</Text>
        <Text style={styles.headerTitle}>ਦਸਮ ਗ੍ਰੰਥ ਸਾਹਿਬ</Text>
        <Text style={styles.headerTitleEn}>Sri Dasam Granth Sahib</Text>
        <Text style={styles.headerSubtitle}>Composed by Guru Gobind Singh Ji</Text>
        <Text style={styles.versesCount}>{DASAM_GRANTH_TOTAL_VERSES} verses across {dasamGranthBanis.length} compositions</Text>
      </View>

      {/* Introduction Card */}
      <Card style={styles.introCard}>
        <Card.Content>
          <Title style={styles.introTitle}>About Dasam Granth</Title>
          <Paragraph style={styles.introText}>
            Sri Dasam Granth Sahib is a scripture containing compositions of the Tenth Sikh Guru, Guru Gobind Singh Ji. 
            It includes beautiful poetry, philosophy, and divine wisdom covering various themes including the nature of God, 
            valor, righteousness, and spirituality.
          </Paragraph>
          <Paragraph style={styles.availableNote}>
            ✅ Tap any composition below to read the full Gurbani with English transliteration and translation.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Banis List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compositions</Text>
        
        {dasamGranthBanis.map((bani) => (
          <Card key={bani.id} style={styles.card}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('DasamGranthDetail', {
                  bani: { nameGurmukhi: bani.nameGurmukhi, name: bani.name }
                });
              }}
            >
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleContainer}>
                    <Title style={styles.baniName}>{bani.name}</Title>
                    <Text style={styles.baniNameGurmukhi}>{bani.nameGurmukhi}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
                </View>
                <Paragraph style={styles.description}>{bani.description}</Paragraph>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="document-text-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{bani.verses} verses</Text>
                  </View>
                </View>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      {/* Coming Soon Notice */}
      <Card style={styles.comingSoonCard}>
        <Card.Content>
          <View style={styles.comingSoonContent}>
            <Ionicons name="construct-outline" size={48} color={theme.colors.primary} />
            <Text style={styles.comingSoonTitle}>Full Content Coming Soon</Text>
            <Text style={styles.comingSoonText}>
              We're integrating the complete Dasam Granth Sahib from the Shabados Database, 
              which will provide authentic Gurmukhi text with translations.
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={{ height: 40 }} />
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
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  ikOnkar: {
    fontSize: 48,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 8,
  },
  headerTitleEn: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  versesCount: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  introCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 3,
    backgroundColor: '#FFF8E1',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  availableNote: {
    fontSize: 13,
    color: '#0F9D58',
    fontWeight: '600',
    lineHeight: 20,
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitleContainer: {
    flex: 1,
  },
  baniName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  baniNameGurmukhi: {
    fontSize: 20,
    color: '#333',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  comingSoonCard: {
    margin: 16,
    marginTop: 8,
    elevation: 3,
    backgroundColor: '#E3F2FD',
  },
  comingSoonContent: {
    alignItems: 'center',
    padding: 20,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
