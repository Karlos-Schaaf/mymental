import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { colors, fonts, spacing, radius } from '../../src/constants/theme';
import { auth } from '../../src/firebase/auth';
import { db } from '../../src/firebase/config';
import ScreenHeader from '../../src/components/ScreenHeader';

export default function PersonalInformationScreen() {
  const user = auth.currentUser;

  const [name, setName] = useState(user?.displayName ?? '');
  const [saving, setSaving] = useState(false);

  const hasChanges = name.trim() !== (user?.displayName ?? '') && name.trim().length > 0;

  const handleSave = async () => {
    if (!user) return;
    const trimmed = name.trim();

    if (!trimmed) {
      Alert.alert('Name required', 'Please enter a name.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile(user, { displayName: trimmed });

      // Keep the users/{uid} Firestore doc in sync with auth profile
      await setDoc(
        doc(db, 'users', user.uid),
        { profile: { displayName: trimmed } },
        { merge: true }
      );

      Alert.alert('Saved', 'Your personal information has been updated.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not save your changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Personal Information" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.mutedLight}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>{user?.email ?? '—'}</Text>
          </View>
          <Text style={styles.hint}>
            To change your email, go to Privacy & Security.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            !hasChanges && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!hasChanges || saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
  },
  readOnlyField: {
    backgroundColor: colors.paperDim,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  readOnlyText: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.muted,
  },
  hint: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedLight,
  },
  saveButton: {
    backgroundColor: colors.coral,
    borderRadius: radius.full,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonDisabled: {
    backgroundColor: colors.coralMid,
  },
  saveButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.white,
  },
});
