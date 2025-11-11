import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { HistoryArticle, historyArticles } from '../data/history';

export default function HistoryArticleScreen({ route, navigation }: any) {
  const { article }: { article: HistoryArticle } = route.params;
  const [showWarning, setShowWarning] = useState(article.contentWarning ? true : false);

  const relatedArticlesData = article.relatedArticles
    ? historyArticles.filter(a => article.relatedArticles?.includes(a.id))
    : [];

  const handleSourceClick = (link: string) => {
    Linking.canOpenURL(link).then(supported => {
      if (supported) {
        Linking.openURL(link);
      } else {
        Alert.alert('Error', 'Unable to open link');
      }
    });
  };

  if (showWarning && article.contentWarning) {
    return (
      <View style={styles.warningContainer}>
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={64} color="#ff9800" />
          <Text style={styles.warningTitle}>Content Warning</Text>
          <Text style={styles.warningMessage}>{article.contentWarning}</Text>
          <Text style={styles.warningDescription}>
            This article contains information about historical events that may be disturbing.
            It includes descriptions of violence and traumatic events.
          </Text>
          <Text style={styles.warningDescription}>
            The content is presented for educational and historical purposes with respect
            for all affected communities.
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => setShowWarning(false)}
          >
            <Text style={styles.continueButtonText}>I Understand, Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{article.title}</Text>
        {article.titleGurmukhi && (
          <Text style={styles.titleGurmukhi}>{article.titleGurmukhi}</Text>
        )}
        <Text style={styles.period}>{article.period}</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.contentCard}>
          <Card.Content>
            <Text style={styles.contentText}>{article.content}</Text>
          </Card.Content>
        </Card>

        {/* Sources Section */}
        <View style={styles.sourcesSection}>
          <Text style={styles.sectionTitle}>📚 Sources & References</Text>
          <Text style={styles.sourcesNote}>
            This article is based on the following scholarly sources:
          </Text>
          {article.sources.map((source, index) => (
            <Card key={index} style={styles.sourceCard}>
              <Card.Content>
                <Text style={styles.sourceTitle}>{source.title}</Text>
                <Text style={styles.sourceAuthor}>Author: {source.author}</Text>
                <Text style={styles.sourceYear}>Year: {source.year}</Text>
                <Text style={styles.sourceLicense}>License: {source.license}</Text>
                {source.link && source.link !== 'Various archives' && (
                  <TouchableOpacity
                    style={styles.sourceLink}
                    onPress={() => handleSourceClick(source.link)}
                  >
                    <Ionicons name="link" size={16} color={theme.colors.primary} />
                    <Text style={styles.sourceLinkText}>View Source</Text>
                  </TouchableOpacity>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Related Articles */}
        {relatedArticlesData.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.sectionTitle}>🔗 Related Articles</Text>
            {relatedArticlesData.map((related) => (
              <TouchableOpacity
                key={related.id}
                onPress={() => navigation.push('HistoryArticle', { article: related })}
              >
                <Card style={styles.relatedCard}>
                  <Card.Content>
                    <Text style={styles.relatedTitle}>{related.title}</Text>
                    <Text style={styles.relatedPeriod}>{related.period}</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ℹ️ This content is summarized from various scholarly and historical sources
            with proper attribution. Original sources are linked above for further reading.
            Multiple perspectives exist on historical events.
          </Text>
        </View>
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
    padding: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  titleGurmukhi: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  period: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  contentCard: {
    marginBottom: 20,
    elevation: 2,
    borderRadius: 12,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
  },
  sourcesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sourcesNote: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  sourceCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  sourceTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  sourceAuthor: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  sourceYear: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  sourceLicense: {
    fontSize: 13,
    color: '#777',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  sourceLinkText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: 6,
  },
  relatedSection: {
    marginBottom: 20,
  },
  relatedCard: {
    marginBottom: 10,
    elevation: 2,
    borderRadius: 8,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  relatedPeriod: {
    fontSize: 13,
    color: '#666',
  },
  disclaimer: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#1565c0',
    lineHeight: 20,
  },
  // Warning Screen Styles
  warningContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  warningBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 400,
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff9800',
    marginTop: 16,
    marginBottom: 16,
  },
  warningMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  warningDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  goBackButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  goBackButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
