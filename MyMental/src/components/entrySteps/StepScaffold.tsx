import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, spacing, radius } from '../../constants/theme';
import { EntryStepKey, getStepPosition } from '../../constants/entrySteps';

type StepScaffoldProps = {
  stepKey: EntryStepKey;
  title: string;
  subtitle?: string;
  skippable: boolean;
  onContinue: () => void;
  onSkip?: () => void;
  onClose?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  centerContent?: boolean;
  children: React.ReactNode;
};

function formatToday() {
  return new Date().toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function StepScaffold({
  stepKey,
  title,
  subtitle,
  skippable,
  onContinue,
  onSkip,
  onClose,
  continueLabel = 'Continue',
  continueDisabled,
  centerContent = true,
  children,
}: StepScaffoldProps) {
  const { current, total } = getStepPosition(stepKey);
  const isFirstStep = current === 1;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={isFirstStep ? onClose : () => router.back()}
            hitSlop={10}
            style={styles.navButton}
          >
            <Ionicons
              name={isFirstStep ? 'close' : 'chevron-back'}
              size={24}
              color={colors.muted}
            />
          </TouchableOpacity>

          <Text style={styles.dateText}>{formatToday()}</Text>

          <View style={styles.navButton}>
            {skippable && (
              <TouchableOpacity onPress={onSkip} hitSlop={10}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.progressRow}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressBar,
                i < current && styles.progressBarActive,
              ]}
            />
          ))}
        </View>

        <View
          style={[
            styles.content,
            centerContent && styles.contentCentered,
          ]}
        >
          <Text style={styles.title}>{title}</Text>

          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : null}

          <View style={styles.stepBody}>{children}</View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              continueDisabled && styles.continueButtonDisabled,
            ]}
            onPress={onContinue}
            disabled={continueDisabled}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>
              {continueLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },

  navButton: {
    width: 48,
    justifyContent: 'center',
  },

  dateText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
    letterSpacing: 0.2,
  },

  progressRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
  },

  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },

  progressBarActive: {
    backgroundColor: colors.primary,
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,

  },

  contentCentered: {
    justifyContent: 'center',
    paddingBottom: spacing.xxxl,
  },

  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
    textAlign: 'center',
    paddingTop: spacing.xxxl,
  },

  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  stepBody: {
    marginTop: spacing.xxl,
  },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },

  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueButtonDisabled: {
    backgroundColor: colors.primaryMid,
  },

  continueButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.white,
  },

  skipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'right',
  },
});