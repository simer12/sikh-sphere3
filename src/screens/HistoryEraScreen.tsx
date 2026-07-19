import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { useApp } from '../hooks/useApp';
import { historyArticles, HistoryEra } from '../data/history';

export default function HistoryEraScreen({ route, navigation }: any) {
  const { colors } = useApp();
  const { era }: { era: HistoryEra } = route.params;
  
  const eraArticles = historyArticles.filter(article => 
    era.articles.includes(article.id)
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerIcon}>{era.icon}</Text>
        <Text style={styles.headerTitle}>{era.title}</Text>
        <Text style={styles.headerTitleGurmukhi}>{era.titleGurmukhi}</Text>
        <Text style={styles.headerPeriod}>{era.period}</Text>
        <Text style={styles.headerDescription}>{era.description}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Articles in this Era</Text>
        
        {eraArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            onPress={() => navigation.navigate('HistoryArticle', { article })}
            activeOpacity={0.7}
          >
            <Card style={[styles.articleCard, { backgroundColor: colors.card }]}>
              <Card.Content>
                {article.contentWarning && (
                  <View style={styles.warningBanner}>
                    <Text style={styles.warningText}>⚠️ Content Warning</Text>
                  </View>
                )}
                
                <Text style={[styles.articleTitle, { color: colors.primary }]}>{article.title}</Text>
                {article.titleGurmukhi && (
                  <Text style={[styles.articleTitleGurmukhi, { color: colors.textSecondary }]}>{article.titleGurmukhi}</Text>
                )}
                <Text style={[styles.articlePeriod, { color: colors.textTertiary }]}>{article.period}</Text>
                <Text style={[styles.articleSummary, { color: colors.text }]}>{article.summary}</Text>
                
                <View style={[styles.readMore, { borderTopColor: colors.border }]}>
                  <Text style={[styles.readMoreText, { color: colors.primary }]}>Read More →</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
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
    padding: 24,
    paddingTop: 28,
    paddingBottom: 28,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerTitleGurmukhi: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerPeriod: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: 12,
  },
  headerDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  articleCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
  },
  warningBanner: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#856404',
    fontWeight: '600',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  articleTitleGurmukhi: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  articlePeriod: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  articleSummary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  readMore: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
