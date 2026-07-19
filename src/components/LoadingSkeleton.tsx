import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useApp } from '../hooks/useApp';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  marginBottom?: number;
  style?: any;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  marginBottom = 0,
  style,
}) => {
  const { colors } = useApp();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          marginBottom,
          backgroundColor: colors.disabled,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Pre-built skeleton layouts for common patterns
export const CardSkeleton: React.FC = () => {
  const { colors } = useApp();
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <LoadingSkeleton height={24} width="60%" marginBottom={12} />
      <LoadingSkeleton height={16} width="100%" marginBottom={8} />
      <LoadingSkeleton height={16} width="90%" marginBottom={8} />
      <LoadingSkeleton height={16} width="80%" />
    </View>
  );
};

export const ListItemSkeleton: React.FC = () => {
  const { colors } = useApp();
  return (
    <View style={[styles.listItem, { backgroundColor: colors.card }]}>
      <LoadingSkeleton height={48} width={48} borderRadius={24} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <LoadingSkeleton height={18} width="70%" marginBottom={8} />
        <LoadingSkeleton height={14} width="50%" />
      </View>
    </View>
  );
};

export const HeaderSkeleton: React.FC = () => {
  return (
    <View style={styles.header}>
      <LoadingSkeleton height={32} width="60%" marginBottom={12} />
      <LoadingSkeleton height={16} width="40%" />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
});
