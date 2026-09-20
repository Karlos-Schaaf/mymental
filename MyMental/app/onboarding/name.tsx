import { updateProfile } from 'firebase/auth';
import { auth } from '../../src/firebase/auth';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, spacing, radius } from '../../src/constants/theme';

export default function NameScreen() {
  const [name, setName] = useState('');

  const trimmedName = name.trim();
  const canContinue = trimmedName.length > 0;

 const handleContinue = async () => {
  if (!canContinue) return;

  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: trimmedName,
      });
    }

    router.push({
      pathname: '/onboarding/walkthrough',
      params: {
        name: trimmedName,
      },
    });
  } catch (error) {
    console.error('Failed to save name:', error);
  }
};

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.ink}
            />
          </TouchableOpacity>

          <View style={styles.content}>
            {/* Icon */}
            <View style={styles.iconCircle}>
              <Ionicons
                name="person-outline"
                size={42}
                color={colors.teal}
              />
            </View>

            {/* Text */}
            <View style={styles.textBlock}>
              <Text style={styles.title}>
                What should we call you?
              </Text>

              <Text style={styles.subtitle}>
                Tell us your name so we can make MyMental feel a little more
                personal.
              </Text>
            </View>

            {/* Name input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={21}
                color={colors.muted}
              />

              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.mutedLight}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                maxLength={40}
                onSubmitEditing={handleContinue}
              />
            </View>

            <Text style={styles.hint}>
              You can change this later in your profile.
            </Text>
          </View>

          {/* Continue */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              !canContinue && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            activeOpacity={0.85}
            disabled={!canContinue}
          >
            <Text
              style={[
                styles.continueButtonText,
                !canContinue && styles.continueButtonTextDisabled,
              ]}
            >
              Continue
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color={
                canContinue
                  ? colors.white
                  : colors.mutedLight
              }
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  textBlock: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },

  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 27,
    color: colors.ink,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 330,
  },

  inputContainer: {
    width: '100%',
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },

  input: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: spacing.md,
  },

  hint: {
    width: '100%',
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedLight,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },

  continueButton: {
    minHeight: 56,
    backgroundColor: colors.teal,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  continueButtonDisabled: {
    backgroundColor: colors.tealLight,
  },

  continueButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.white,
  },

  continueButtonTextDisabled: {
    color: colors.mutedLight,
  },
});