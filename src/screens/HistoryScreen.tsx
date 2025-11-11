import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { theme } from '../theme';
import { historyEras } from '../data/history';

export default function HistoryScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sikh History</Text>
        <Text style={styles.headerTitleGurmukhi}>ਸਿੱਖ ਇਤਿਹਾਸ</Text>
        <Text style={styles.headerSubtitle}>
          Journey through centuries of courage, spirituality, and resilience
        </Text>
      </View>

      <View style={styles.content}>
        {historyEras.map((era) => (
          <TouchableOpacity
            key={era.id}
            onPress={() => navigation.navigate('HistoryEra', { era })}
            activeOpacity={0.7}
          >
            <Card style={styles.eraCard}>
              <Card.Content>
                <View style={styles.eraHeader}>
                  <Text style={styles.eraIcon}>{era.icon}</Text>
                  <View style={styles.eraInfo}>
                    <Text style={styles.eraTitle}>{era.title}</Text>
                    <Text style={styles.eraTitleGurmukhi}>{era.titleGurmukhi}</Text>
                    <Text style={styles.eraPeriod}>{era.period}</Text>
                  </View>
                </View>
                <Text style={styles.eraDescription}>{era.description}</Text>
                <View style={styles.articleCount}>
                  <Text style={styles.articleCountText}>
                    {era.articles.length} {era.articles.length === 1 ? 'Article' : 'Articles'}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          📚 All content is summarized from scholarly sources with proper attribution
        </Text>
        <Text style={styles.footerText}>
          🔗 Links to original sources provided for further reading
        </Text>
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
    padding: 24,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerTitleGurmukhi: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  content: {
    padding: 16,
  },
  eraCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  eraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eraIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  eraInfo: {
    flex: 1,
  },
  eraTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  eraTitleGurmukhi: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  eraPeriod: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  eraDescription: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 12,
  },
  articleCount: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  articleCountText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
});
