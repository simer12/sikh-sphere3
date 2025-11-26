import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { HistoryArticle, historyArticles, HistorySection } from '../data/history';

export default function HistoryArticleScreen({ route, navigation }: any) {
  const { article }: { article: HistoryArticle } = route.params;
  const [showWarning, setShowWarning] = useState(article.contentWarning ? true : false);
  const [selectedSection, setSelectedSection] = useState<HistorySection | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);

  const relatedArticlesData = article.relatedArticles
    ? historyArticles.filter(a => article.relatedArticles?.includes(a.id))
    : [];

  // Check if article has new format (tableOfContents + chapters) or old format (sections)
  const hasNewFormat = article.tableOfContents && article.chapters;
  const hasOldFormat = article.sections && article.sections.length > 0;

  const handleSourceClick = (link: string) => {
    Linking.canOpenURL(link).then(supported => {
      if (supported) {
        Linking.openURL(link);
      } else {
        Alert.alert('Error', 'Unable to open link');
      }
    });
  };

  const handleSectionClick = (section: HistorySection) => {
    setSelectedSection(section);
  };

  const renderTableOfContents = () => {
    // Handle old format (sections)
    if (hasOldFormat) {
      return (
        <View style={styles.tocContainer}>
          <Text style={styles.tocTitle}>📖 Table of Contents</Text>
          <Text style={styles.tocSubtitle}>ਸਮੱਗਰੀ ਸੂਚੀ</Text>
          <View style={styles.tocList}>
            {article.sections!.map((section, index) => (
              <TouchableOpacity
                key={section.id}
                style={styles.tocItem}
                onPress={() => handleSectionClick(section)}
              >
                <View style={styles.tocNumber}>
                  <Text style={styles.tocNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.tocContent}>
                  <Text style={styles.tocItemTitle}>{section.title}</Text>
                  {section.titleGurmukhi && (
                    <Text style={styles.tocItemGurmukhi}>{section.titleGurmukhi}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    // Handle new format (tableOfContents + chapters)
    if (hasNewFormat) {
      return (
        <View style={styles.tocContainer}>
          <Text style={styles.tocTitle}>📖 Table of Contents</Text>
          <Text style={styles.tocSubtitle}>ਸਮੱਗਰੀ ਸੂਚੀ</Text>
          {article.tableOfContents!.map((part: any, partIndex: number) => (
            <View key={part.id} style={styles.partContainer}>
              <Text style={styles.partTitle}>{part.title}</Text>
              {part.titleEnglish && (
                <Text style={styles.partTitleEnglish}>{part.titleEnglish}</Text>
              )}
              <View style={styles.tocList}>
                {part.chapters.map((chapter: any, chapterIndex: number) => {
                  const chapterData = article.chapters?.find((c: any) => c.id === chapter.id);
                  return (
                    <TouchableOpacity
                      key={chapter.id}
                      style={styles.tocItem}
                      onPress={() => setSelectedChapter(chapterData)}
                    >
                      <View style={styles.tocNumber}>
                        <Text style={styles.tocNumberText}>{chapterData?.number || (chapterIndex + 1)}</Text>
                      </View>
                      <View style={styles.tocContent}>
                        <Text style={styles.tocItemTitle}>{chapter.title}</Text>
                        {chapter.titleEnglish && (
                          <Text style={styles.tocItemGurmukhi}>{chapter.titleEnglish}</Text>
                        )}
                        {chapter.pageRange && (
                          <Text style={styles.pageRange}>Pages: {chapter.pageRange}</Text>
                        )}
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  const renderSectionContent = () => {
    // Handle old format
    if (selectedSection) {
      return (
        <View style={styles.sectionContentContainer}>
          <TouchableOpacity
            style={styles.backToTocButton}
            onPress={() => setSelectedSection(null)}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
            <Text style={styles.backToTocText}>Back to Contents</Text>
          </TouchableOpacity>
          
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>{selectedSection.title}</Text>
              {selectedSection.titleGurmukhi && (
                <Text style={styles.sectionGurmukhi}>{selectedSection.titleGurmukhi}</Text>
              )}
              <View style={styles.sectionDivider} />
              <Text style={styles.sectionContent}>{selectedSection.content}</Text>
            </Card.Content>
          </Card>
        </View>
      );
    }

    // Handle new format (chapter content)
    if (selectedChapter) {
      return (
        <View style={styles.sectionContentContainer}>
          <TouchableOpacity
            style={styles.backToTocButton}
            onPress={() => setSelectedChapter(null)}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
            <Text style={styles.backToTocText}>Back to Contents</Text>
          </TouchableOpacity>
          
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.chapterHeader}>
                <Text style={styles.chapterNumber}>Chapter {selectedChapter.number}</Text>
                <Text style={styles.pageRangeHeader}>Pages: {selectedChapter.pageRange}</Text>
              </View>
              <Text style={styles.sectionTitle}>{selectedChapter.title}</Text>
              {selectedChapter.titleEnglish && (
                <Text style={styles.sectionGurmukhi}>{selectedChapter.titleEnglish}</Text>
              )}
              <View style={styles.sectionDivider} />
              <Text style={styles.wordCount}>📖 {selectedChapter.wordCount?.toLocaleString() || 0} words</Text>
              <Text style={styles.sectionContent}>{selectedChapter.content}</Text>
            </Card.Content>
          </Card>
        </View>
      );
    }

    return null;
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
        {selectedSection || selectedChapter ? (
          renderSectionContent()
        ) : (
          <>
            {hasOldFormat || hasNewFormat ? (
              renderTableOfContents()
            ) : (
              <Card style={styles.contentCard}>
                <Card.Content>
                  <Text style={styles.contentText}>{article.content}</Text>
                </Card.Content>
              </Card>
            )}

            {/* Sources Section */}
            <View style={styles.sourcesSection}>
              <Text style={styles.sectionTitleText}>📚 Sources & References</Text>
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
                <Text style={styles.sectionTitleText}>🔗 Related Articles</Text>
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
          </>
        )}
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
  // Table of Contents Styles
  tocContainer: {
    marginBottom: 24,
  },
  tocTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  tocSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  tocList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  tocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tocNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tocNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tocContent: {
    flex: 1,
  },
  tocItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  tocItemGurmukhi: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  pageRange: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  partContainer: {
    marginBottom: 20,
  },
  partTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  partTitleEnglish: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
    paddingHorizontal: 8,
    fontStyle: 'italic',
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chapterNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pageRangeHeader: {
    fontSize: 12,
    color: '#666',
  },
  wordCount: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  // Section Content Styles
  sectionContentContainer: {
    marginBottom: 20,
  },
  backToTocButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  backToTocText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: 8,
  },
  sectionCard: {
    elevation: 2,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionGurmukhi: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: theme.colors.primary,
    marginBottom: 16,
    opacity: 0.3,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
  },
  sourcesSection: {
    marginBottom: 20,
  },
  sectionTitleText: {
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
