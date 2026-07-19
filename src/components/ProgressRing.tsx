import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../hooks/useApp';

interface ProgressRingProps {
  progress: number;
  value: string | number;
  label: string;
  size?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  value,
  label,
  size = 108,
}) => {
  const { colors } = useApp();
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const dots = Array.from({ length: 12 });
  const activeDots = Math.round(clampedProgress * dots.length);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colors.border,
          },
        ]}
      >
        {dots.map((_, index) => {
          const angle = (index / dots.length) * 360;
          const radius = size / 2 - 8;
          const dotSize = 8;
          const x = size / 2 + radius * Math.cos((angle - 90) * (Math.PI / 180)) - dotSize / 2;
          const y = size / 2 + radius * Math.sin((angle - 90) * (Math.PI / 180)) - dotSize / 2;

          return (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  left: x,
                  top: y,
                  backgroundColor: index < activeDots ? colors.primary : colors.border,
                },
              ]}
            />
          );
        })}
        <View style={styles.center}>
          <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  label: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
});
