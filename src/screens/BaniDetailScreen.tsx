import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder, ScrollView } from 'react-native';
import { theme } from '../theme';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VERSES_PER_PAGE = 12; // Optimal verses per page for readability

export default function BaniDetailScreen({ route }: any) {
  const { bani } = route.params;
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const translateX = useRef(new Animated.Value(0)).current;
  
  // Keep a ref to current page for gesture handlers
  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;

  // Split content into verses (by double newline)
  const verses = bani.gurmukhi.split('\n\n').filter((v: string) => v.trim());
  
  // Calculate total pages - fewer verses per page like real Gutka
  const totalPages = Math.ceil(verses.length / VERSES_PER_PAGE);

  // Get verses for current page
  const getPageVerses = (pageIndex: number) => {
    const startIdx = pageIndex * VERSES_PER_PAGE;
    const endIdx = Math.min(startIdx + VERSES_PER_PAGE, verses.length);
    return verses.slice(startIdx, endIdx);
  };

  // Navigation functions - use callback form to avoid stale closures
  const goToNextPage = () => {
    setCurrentPage(prevPage => {
      if (prevPage < totalPages - 1) {
        const nextPage = prevPage + 1;
        
        // Animate from left
        translateX.setValue(SCREEN_WIDTH);
        Animated.timing(translateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
        
        return nextPage;
      }
      return prevPage;
    });
  };

  const goToPreviousPage = () => {
    setCurrentPage(prevPage => {
      if (prevPage > 0) {
        const newPage = prevPage - 1;
        
        // Animate from right
        translateX.setValue(-SCREEN_WIDTH);
        Animated.timing(translateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
        
        return newPage;
      }
      return prevPage;
    });
  };

  // Pan responder for swipe gestures - recreated when currentPage changes
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = 100;
        const currentPageValue = currentPageRef.current;
        
        if (gestureState.dx > swipeThreshold) {
          // Swipe right - previous page
          if (currentPageValue > 0) {
            goToPreviousPage();
          } else {
            // Snap back if at first page
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }).start();
          }
        } else if (gestureState.dx < -swipeThreshold) {
          // Swipe left - next page
          if (currentPageValue < totalPages - 1) {
            goToNextPage();
          } else {
            // Snap back if at last page
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }).start();
          }
        } else {
          // Snap back to current position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        }
      },
    })
  ).current;

  const togglePlayback = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else if (bani.audioUrl) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: bani.audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
    }
  };

  const pageVerses = getPageVerses(currentPage);

  return (
    <View style={styles.container}>
      {/* Main Content Area - Full Screen Clean Sundar Gutka Style */}
      <View style={styles.contentWrapper}>
        <Animated.View
          style={[styles.contentContainer, { transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {pageVerses.map((verse: string, index: number) => {
              const verseIndex = currentPage * VERSES_PER_PAGE + index;
              return (
                <View key={verseIndex} style={styles.verseBlock}>
                  <Text style={styles.gurmukhiText}>{verse}</Text>
                </View>
              );
            })}
          </ScrollView>
        </Animated.View>
      </View>

      {/* Page Dots Indicator */}
      <View style={styles.dotsContainer}>
        {Array.from({ length: Math.min(totalPages, 7) }).map((_, index) => {
          const dotIndex = totalPages > 7 
            ? Math.floor((currentPage / totalPages) * 7)
            : currentPage;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                index === dotIndex && styles.dotActive,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8f5', // Clean cream background like Sundar Gutka
  },
  // Sundar Gutka Style - Clean and Simple, Full Screen
  contentWrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingVertical: 32,
    paddingTop: 40,
    paddingBottom: 40,
  },
  verseBlock: {
    marginBottom: 24,
  },
  gurmukhiText: {
    fontSize: 26, // Larger, more readable like Sundar Gutka
    fontWeight: '400',
    color: '#1a1a1a',
    lineHeight: 42, // Comfortable line spacing
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 16,
    backgroundColor: '#faf8f5',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#d0c9c0',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
