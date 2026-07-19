import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../hooks/useApp';
import { HistoryArticle, historyArticles, HistorySection } from '../data/history';

export default function HistoryArticleScreen({ route, navigation }: any) {
  const { colors } = useApp();
  const { article }: { article: HistoryArticle } = route.params;
  const [showWarning, setShowWarning] = useState(article.contentWarning ? true : false);
  const [selectedSection, setSelectedSection] = useState<HistorySection | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);

  const handleChapterSelect = (chapter: any) => {
    if (!chapter) return;
    if (article.id === 'guru-nanak-jeevan-katha' && !chapter.content) {
      try {
        const chaptersData = require('../data/guruNanakJeevanKathaChapters.json');
        setSelectedChapter({
          ...chapter,
          content: chaptersData[chapter.id] || 'ਸਮੱਗਰੀ ਨਹੀਂ ਲੱਭੀ। (Content not found.)'
        });
      } catch (err) {
        console.error('Error loading chapter content dynamically:', err);
        setSelectedChapter({
          ...chapter,
          content: 'Failed to load chapter content.'
        });
      }
    } else {
      setSelectedChapter(chapter);
    }
  };

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
          <Text style={[styles.tocTitle, { color: colors.text }]}>📖 Table of Contents</Text>
          <Text style={[styles.tocSubtitle, { color: colors.primary }]}>ਸਮੱਗਰੀ ਸੂਚੀ</Text>
          <View style={[styles.tocList, { backgroundColor: colors.card }]}>
            {article.sections!.map((section, index) => (
              <TouchableOpacity
                key={section.id}
                style={[styles.tocItem, { borderBottomColor: colors.border }]}
                onPress={() => handleSectionClick(section)}
              >
                <View style={[styles.tocNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.tocNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.tocContent}>
                  <Text style={[styles.tocItemTitle, { color: colors.text }]}>{section.title}</Text>
                  {section.titleGurmukhi && (
                    <Text style={[styles.tocItemGurmukhi, { color: colors.textSecondary }]}>{section.titleGurmukhi}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.primary} />
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
          <Text style={[styles.tocTitle, { color: colors.text }]}>📖 Table of Contents</Text>
          <Text style={[styles.tocSubtitle, { color: colors.primary }]}>ਸਮੱਗਰੀ ਸੂਚੀ</Text>
          {article.tableOfContents!.map((part: any, partIndex: number) => (
            <View key={part.id} style={styles.partContainer}>
              <Text style={[styles.partTitle, { color: colors.primary }]}>{part.title}</Text>
              {part.titleEnglish && (
                <Text style={[styles.partTitleEnglish, { color: colors.textSecondary }]}>{part.titleEnglish}</Text>
              )}
              <View style={[styles.tocList, { backgroundColor: colors.card }]}>
                {part.chapters.map((chapter: any, chapterIndex: number) => {
                  const chapterData = article.chapters?.find((c: any) => c.id === chapter.id);
                  return (
                    <TouchableOpacity
                      key={chapter.id}
                      style={[styles.tocItem, { borderBottomColor: colors.border }]}
                      onPress={() => handleChapterSelect(chapterData)}
                    >
                      <View style={[styles.tocNumber, { backgroundColor: colors.primary }]}>
                        <Text style={styles.tocNumberText}>{chapterData?.number || (chapterIndex + 1)}</Text>
                      </View>
                      <View style={styles.tocContent}>
                        <Text style={[styles.tocItemTitle, { color: colors.text }]}>{chapter.title}</Text>
                        {chapter.titleEnglish && (
                          <Text style={[styles.tocItemGurmukhi, { color: colors.textSecondary }]}>{chapter.titleEnglish}</Text>
                        )}
                        {chapter.pageRange && (
                          <Text style={[styles.pageRange, { color: colors.textTertiary }]}>Pages: {chapter.pageRange}</Text>
                        )}
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={colors.primary} />
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
            style={[styles.backToTocButton, { backgroundColor: colors.card }]}
            onPress={() => setSelectedSection(null)}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={[styles.backToTocText, { color: colors.primary }]}>Back to Contents</Text>
          </TouchableOpacity>
          
          <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
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
            style={[styles.backToTocButton, { backgroundColor: colors.card }]}
            onPress={() => setSelectedChapter(null)}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={[styles.backToTocText, { color: colors.primary }]}>Back to Contents</Text>
          </TouchableOpacity>
          
          <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
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
        <View style={[styles.warningBox, { backgroundColor: colors.card }]}>
          <Ionicons name="warning" size={64} color="#ff9800" />
          <Text style={styles.warningTitle}>Content Warning</Text>
          <Text style={[styles.warningMessage, { color: colors.text }]}>{article.contentWarning}</Text>
          <Text style={[styles.warningDescription, { color: colors.textSecondary }]}>
            This article contains information about historical events that may be disturbing.
            It includes descriptions of violence and traumatic events.
          </Text>
          <Text style={[styles.warningDescription, { color: colors.textSecondary }]}>
            The content is presented for educational and historical purposes with respect
            for all affected communities.
          </Text>
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowWarning(false)}
          >
            <Text style={styles.continueButtonText}>I Understand, Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.goBackButtonText, { color: colors.textSecondary }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
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
              <Card style={[styles.contentCard, { backgroundColor: colors.card }]}>
                <Card.Content>
                  <Text style={[styles.contentText, { color: colors.text }]}>{article.content}</Text>
                </Card.Content>
              </Card>
            )}

            {/* Sources Section */}
            <View style={styles.sourcesSection}>
              <Text style={[styles.sectionTitleText, { color: colors.text }]}>📚 Sources & References</Text>
              <Text style={[styles.sourcesNote, { color: colors.textSecondary }]}>
                This article is based on the following scholarly sources:
              </Text>
              {article.sources.map((source, index) => (
                <Card key={index} style={[styles.sourceCard, { backgroundColor: colors.surface }]}>
                  <Card.Content>
                    <Text style={[styles.sourceTitle, { color: colors.text }]}>{source.title}</Text>
                    <Text style={[styles.sourceAuthor, { color: colors.textSecondary }]}>Author: {source.author}</Text>
                    <Text style={[styles.sourceYear, { color: colors.textSecondary }]}>Year: {source.year}</Text>
                    <Text style={[styles.sourceLicense, { color: colors.textTertiary }]}>License: {source.license}</Text>
                    {source.link && source.link !== 'Various archives' && (
                      <TouchableOpacity
                        style={styles.sourceLink}
                        onPress={() => handleSourceClick(source.link)}
                      >
                        <Ionicons name="link" size={16} color={colors.primary} />
                        <Text style={[styles.sourceLinkText, { color: colors.primary }]}>View Source</Text>
                      </TouchableOpacity>
                    )}
                  </Card.Content>
                </Card>
              ))}
            </View>

            {/* Related Articles */}
            {relatedArticlesData.length > 0 && (
              <View style={styles.relatedSection}>
                <Text style={[styles.sectionTitleText, { color: colors.text }]}>🔗 Related Articles</Text>
                {relatedArticlesData.map((related) => (
                  <TouchableOpacity
                    key={related.id}
                    onPress={() => navigation.push('HistoryArticle', { article: related })}
                  >
                    <Card style={[styles.relatedCard, { backgroundColor: colors.card }]}>
                      <Card.Content>
                        <Text style={[styles.relatedTitle, { color: colors.primary }]}>{related.title}</Text>
                        <Text style={[styles.relatedPeriod, { color: colors.textSecondary }]}>{related.period}</Text>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Disclaimer */}
            <View style={[styles.disclaimer, { backgroundColor: colors.surface }]}>
              <Text style={[styles.disclaimerText, { color: colors.primary }]}>
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
  },
  header: {
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
    lineHeight: 26,
  },
  // Table of Contents Styles
  tocContainer: {
    marginBottom: 24,
  },
  tocTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  tocSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  tocList: {
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  tocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  tocNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    marginBottom: 2,
  },
  tocItemGurmukhi: {
    fontSize: 13,
    fontWeight: '500',
  },
  pageRange: {
    fontSize: 11,
    marginTop: 2,
  },
  partContainer: {
    marginBottom: 20,
  },
  partTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  partTitleEnglish: {
    fontSize: 15,
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pageRangeHeader: {
    fontSize: 12,
  },
  wordCount: {
    fontSize: 12,
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
    borderRadius: 8,
    elevation: 2,
  },
  backToTocText: {
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 8,
  },
  sectionGurmukhi: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionDivider: {
    height: 2,
    marginBottom: 16,
    opacity: 0.3,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 26,
  },
  sourcesSection: {
    marginBottom: 20,
  },
  sectionTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sourcesNote: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  sourceCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 8,
  },
  sourceTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  sourceAuthor: {
    fontSize: 14,
    marginBottom: 3,
  },
  sourceYear: {
    fontSize: 14,
    marginBottom: 3,
  },
  sourceLicense: {
    fontSize: 13,
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
    marginBottom: 4,
  },
  relatedPeriod: {
    fontSize: 13,
  },
  disclaimer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 13,
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
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  warningDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  continueButton: {
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
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
