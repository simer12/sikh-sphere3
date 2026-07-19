import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useApp } from '../hooks/useApp';
import { AppText } from '../components/AppText';

export default function EditProfileScreen({ navigation }: any) {
  const { user, userData, updateUserProfile } = useAuth();
  const { t, fontSize, colors } = useApp();
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert(t.error, 'Name cannot be empty');
      return;
    }

    try {
      setLoading(true);

      // Update Firebase profile
      if (user && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim(),
        });
      }

      // Update Supabase
      if (user) {
        const { error } = await supabase
          .from('user_data')
          .update({
            name: displayName.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.uid);

        if (error) throw error;
      }

      // Update context
      await updateUserProfile({ displayName: displayName.trim() });

      Alert.alert(t.success, t.savedSuccessfully, [
        { text: t.ok, onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert(t.error, t.tryAgain);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Profile Photo Section */}
        <View style={[styles.photoSection, { backgroundColor: colors.card }]}>
          <View style={[styles.photoContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="person" size={60} color="#fff" />
          </View>
          <TouchableOpacity
            style={[styles.changePhotoButton, { backgroundColor: colors.surface }]}
            onPress={() => Alert.alert(t.comingSoon, 'Photo upload will be available soon!')}
          >
            <Ionicons name="camera" size={20} color={colors.primary} />
            <AppText variant="body" style={[styles.changePhotoText, { color: colors.primary }]}>{t.changePhoto}</AppText>
          </TouchableOpacity>
        </View>

        {/* Name Input */}
        <View style={styles.inputSection}>
          <AppText variant="subtitle" style={[styles.label, { color: colors.text }]}>{t.displayName}</AppText>
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { fontSize, color: colors.text }]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        {/* Email (Read-only) */}
        <View style={styles.inputSection}>
          <AppText variant="subtitle" style={[styles.label, { color: colors.text }]}>{t.emailAddress}</AppText>
          <View style={[styles.inputContainer, styles.disabledInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textTertiary} />
            <Text style={[styles.disabledText, { color: colors.textTertiary }]}>{userData?.email || 'N/A'}</Text>
          </View>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>Email cannot be changed</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Account Info */}
        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>Account Information</Text>
          <View style={[styles.infoItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>User ID:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{user?.uid.substring(0, 8)}...</Text>
          </View>
          <View style={[styles.infoItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Account Created:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {user?.metadata.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    borderRadius: 12,
    elevation: 2,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  changePhotoText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  disabledInput: {},
  disabledText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  saveButton: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 2,
  },
  saveButtonDisabled: {
    backgroundColor: '#999',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoSection: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
