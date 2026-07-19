import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../hooks/useApp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  illustration: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: '1',
    icon: 'home',
    title: 'Welcome to Akaal Seva',
    description: 'Your digital companion for Sikh prayers, history, and spirituality. Access authentic Gurbani anytime, anywhere.',
    illustration: '🙏',
  },
  {
    id: '2',
    icon: 'book',
    title: 'Daily Nitnem Prayers',
    description: 'Read complete Nitnem Banis with Gurmukhi text, transliterations, and translations in multiple languages.',
    illustration: '📖',
  },
  {
    id: '3',
    icon: 'newspaper',
    title: 'Daily Hukamnama',
    description: 'Receive the daily Hukamnama from Sri Harmandir Sahib (Golden Temple) with full translations.',
    illustration: '📰',
  },
  {
    id: '4',
    icon: 'moon',
    title: 'Dark Mode & Customization',
    description: 'Personalize your experience with dark mode, adjustable font sizes, and language preferences.',
    illustration: '🌙',
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { colors } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const isLastStep = currentIndex === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      onComplete();
    }
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip button */}
      {!isLastStep && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {ONBOARDING_STEPS.map((step, index) => (
          <View key={step.id} style={styles.slide}>
            <View style={styles.content}>
              <Text style={styles.illustration}>{step.illustration}</Text>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name={step.icon} size={48} color={colors.primary} />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>{step.title}</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {ONBOARDING_STEPS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex ? colors.primary : colors.disabled,
              },
            ]}
          />
        ))}
      </View>

      {/* Next/Get Started button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>
          {isLastStep ? 'Get Started' : 'Next'}
        </Text>
        <Ionicons 
          name={isLastStep ? 'checkmark' : 'arrow-forward'} 
          size={20} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  illustration: {
    fontSize: 80,
    marginBottom: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
