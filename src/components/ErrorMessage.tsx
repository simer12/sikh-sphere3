import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../hooks/useApp';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  type?: 'error' | 'warning' | 'info';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Oops! Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
  type = 'error',
}) => {
  const { colors } = useApp();

  const getIconName = () => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'alert-circle';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'warning':
        return '#FFB84D';
      case 'info':
        return colors.primary;
      default:
        return colors.error;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: getColor() + '20' }]}>
        <Ionicons name={getIconName()} size={48} color={getColor()} />
      </View>
      
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      
      {onRetry && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: getColor() }]}
          onPress={onRetry}
        >
          <Ionicons name="refresh" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Inline error banner for forms/smaller spaces
export const ErrorBanner: React.FC<{ message: string; onDismiss?: () => void }> = ({
  message,
  onDismiss,
}) => {
  const { colors } = useApp();

  return (
    <View style={[styles.banner, { backgroundColor: colors.error + '15', borderColor: colors.error }]}>
      <Ionicons name="alert-circle" size={20} color={colors.error} />
      <Text style={[styles.bannerText, { color: colors.error }]}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss}>
          <Ionicons name="close" size={20} color={colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 8,
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
