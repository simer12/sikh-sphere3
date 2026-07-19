import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient} from 'expo-linear-gradient';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileSetupScreen({ navigation }: any) {
  const { colors } = useApp();
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({
        uid: user!.uid,
        email: user!.email,
        displayName: name.trim(),
        photoURL: user!.photoURL,
        preferences: {
          fontSize: 16,
          darkMode: false,
          language: 'en',
          notifications: true,
        },
      });
      
      // Reload to show main tabs
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={[colors.primary, '#FF9933']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.khanda}>ੴ</Text>
          <Text style={styles.title}>Welcome to Akaal Seva</Text>
          <Text style={styles.subtitle}>Let's set up your profile</Text>
        </LinearGradient>

        <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
          <View style={styles.stepIndicator}>
            <View style={[styles.activeStep, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: colors.border }]} />
            <View style={styles.inactiveStep}>
              <Text style={[styles.stepNumberInactive, { color: colors.textTertiary }]}>2</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            This helps us personalize your experience
          </Text>

          {/* Name Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Your Name"
              placeholderTextColor={colors.textTertiary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>

          {/* Email Display (read-only) */}
          <View style={[styles.inputContainer, styles.readOnly, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <Text style={[styles.readOnlyText, { color: colors.textSecondary }]}>{user?.email}</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.primary }]}>
              Your data is securely stored and synced across all your devices
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleComplete}
            disabled={loading}
          >
            <LinearGradient
              colors={[colors.primary, '#FF9933']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <Text style={styles.buttonText}>Setting up...</Text>
              ) : (
                <>
                  <Text style={styles.buttonText}>Complete Setup</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  khanda: {
    fontSize: 60,
    color: '#fff',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  activeStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    width: 50,
    height: 2,
    marginHorizontal: 10,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepNumberInactive: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 15,
    borderWidth: 1,
  },
  readOnly: {
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  readOnlyText: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    marginVertical: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
