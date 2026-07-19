import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { historyEras } from '../data/history';
import { useApp } from '../hooks/useApp';

export default function HistoryScreen({ navigation }: any) {
  const { colors } = useApp();
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Sikh History</Text>
        <Text style={[styles.headerTitleGurmukhi, { color: '#FFFFFF' }]}>ਸਿੱਖ ਇਤਿਹਾਸ</Text>
        <Text style={[styles.headerSubtitle, { color: 'rgba(255,255,255,0.9)' }]}>
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
            <Card style={[styles.eraCard, { backgroundColor: colors.card }]}>
              <Card.Content>
                <View style={styles.eraHeader}>
                  <Text style={styles.eraIcon}>{era.icon}</Text>
                  <View style={styles.eraInfo}>
                    <Text style={[styles.eraTitle, { color: colors.primary }]}>{era.title}</Text>
                    <Text style={[styles.eraTitleGurmukhi, { color: colors.textSecondary }]}>{era.titleGurmukhi}</Text>
                    <Text style={[styles.eraPeriod, { color: colors.textSecondary }]}>{era.period}</Text>
                  </View>
                </View>
                <Text style={[styles.eraDescription, { color: colors.text }]}>{era.description}</Text>
                <View style={[styles.articleCount, { borderTopColor: colors.border }]}>
                  <Text style={[styles.articleCountText, { color: colors.primary }]}>
                    {era.articles.length} {era.articles.length === 1 ? 'Article' : 'Articles'}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          📚 All content is summarized from scholarly sources with proper attribution
        </Text>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          🔗 Links to original sources provided for further reading
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerTitleGurmukhi: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  headerSubtitle: {
    fontSize: 15,
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
    marginBottom: 4,
  },
  eraTitleGurmukhi: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  eraPeriod: {
    fontSize: 14,
    fontWeight: '600',
  },
  eraDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  articleCount: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  articleCountText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    marginTop: 8,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
});
