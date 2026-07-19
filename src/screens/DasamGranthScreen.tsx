import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { dasamGranthBanis, DASAM_GRANTH_TOTAL_VERSES } from '../data/dasamGranth';
import { useApp } from '../hooks/useApp';

export default function DasamGranthScreen({ navigation }: any) {
  const { colors } = useApp();
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Compositions</Text>
        
        {dasamGranthBanis.map((bani) => (
          <Card key={bani.id} style={[styles.card, { backgroundColor: colors.card }]}>
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
                    <Title style={[styles.baniName, { color: colors.text }]}>{bani.name}</Title>
                    <Text style={[styles.baniNameGurmukhi, { color: colors.primary }]}>{bani.nameGurmukhi}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={colors.primary} />
                </View>
                <Paragraph style={[styles.description, { color: colors.textSecondary }]}>{bani.description}</Paragraph>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="document-text-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>{bani.verses} verses</Text>
                  </View>
                </View>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      {/* Coming Soon Notice */}
      <Card style={[styles.comingSoonCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.comingSoonContent}>
            <Ionicons name="construct-outline" size={48} color={colors.primary} />
            <Text style={[styles.comingSoonTitle, { color: colors.text }]}>Full Content Coming Soon</Text>
            <Text style={[styles.comingSoonText, { color: colors.textSecondary }]}>
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
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  ikOnkar: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerTitleEn: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  versesCount: {
    fontSize: 14,
    marginTop: 4,
  },
  introCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 3,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  availableNote: {
    fontSize: 13,
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
  },
  baniNameGurmukhi: {
    fontSize: 20,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
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
    marginLeft: 4,
  },
  comingSoonCard: {
    margin: 16,
    marginTop: 8,
    elevation: 3,
  },
  comingSoonContent: {
    alignItems: 'center',
    padding: 20,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
