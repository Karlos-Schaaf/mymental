import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';

import { Link } from 'expo-router';
import { colors, fonts, spacing } from '../../src/constants/theme';

export default function StressManagementScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <View
          pointerEvents="none"
          style={styles.headerDecorCircle}
        />

        <Link href="/resources" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backText}>‹ Resources</Text>
          </Pressable>
        </Link>

        <Text style={styles.headerLabel}>
          STRESS MANAGEMENT
        </Text>

        <Text style={styles.headerTitle}>
          Manage{'\n'}
          <Text style={styles.headerTitleItalic}>
            the pressure
          </Text>
        </Text>

        <Text style={styles.headerDescription}>
          Practical strategies to help you slow down, organise your thoughts
          and respond to stressful moments.
        </Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>
          Practical strategies
        </Text>

        {/* BREATHING */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>◌</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Slow your breathing
            </Text>

            <Text style={styles.cardDescription}>
              Take a few slow breaths and focus your attention on each inhale
              and exhale. Slowing down for a moment can help you create space
              before deciding what to do next.
            </Text>
          </View>
        </View>

        {/* BREAK TASKS DOWN */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>≡</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Break tasks into smaller steps
            </Text>

            <Text style={styles.cardDescription}>
              Large assignments or responsibilities can feel overwhelming.
              Choose one small, specific action and focus on completing that
              before moving to the next.
            </Text>
          </View>
        </View>

        {/* BREAKS */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>◇</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Take short breaks
            </Text>

            <Text style={styles.cardDescription}>
              Step away from study or work for a few minutes. Stretch, move,
              get some water or change your surroundings before returning.
            </Text>
          </View>
        </View>

        {/* PRIORITISE */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>✓</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Decide what matters most
            </Text>

            <Text style={styles.cardDescription}>
              Write down what you need to do and identify what is genuinely
              urgent. Not everything has to be completed at the same time.
            </Text>
          </View>
        </View>

        {/* TALK */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>♡</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Talk to someone
            </Text>

            <Text style={styles.cardDescription}>
              Reaching out to a trusted friend, family member, classmate or
              support service can help when stress feels difficult to manage
              alone.
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, styles.secondSection]}>
          A quick reset
        </Text>

        {/* QUICK RESET */}
        <View style={styles.resetBox}>
          <Text style={styles.resetTitle}>
            Try the 3-step reset
          </Text>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                Pause
              </Text>

              <Text style={styles.stepDescription}>
                Stop what you are doing for a moment and notice how you feel.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                Breathe
              </Text>

              <Text style={styles.stepDescription}>
                Take a few slow breaths and allow your attention to settle.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                Choose one next step
              </Text>

              <Text style={styles.stepDescription}>
                Pick one small and manageable action you can take next.
              </Text>
            </View>
          </View>
        </View>

        {/* SELF CARE */}
        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>
            Build regular self-care
          </Text>

          <Text style={styles.supportDescription}>
            The Self-Care Resources section includes everyday habits and simple
            activities that can support your wellbeing.
          </Text>

          <Link href="/resources/self-care" asChild>
            <Pressable style={styles.supportButton}>
              <Text style={styles.supportButtonText}>
                Self-Care Resources
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* AUT SUPPORT */}
        <View style={styles.secondaryBox}>
          <Text style={styles.secondaryTitle}>
            Stress becoming hard to manage?
          </Text>

          <Text style={styles.secondaryDescription}>
            If stress is affecting your daily life, study or wellbeing, you can
            explore AUT counselling and wellbeing support.
          </Text>

          <Link href="/resources/aut-support" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                AUT Wellbeing Support
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* EMERGENCY */}
        <View style={styles.emergencyBox}>
          <Text style={styles.emergencyTitle}>
            Need urgent support?
          </Text>

          <Text style={styles.emergencyDescription}>
            If you or someone else needs immediate help, use the Emergency
            Contacts section.
          </Text>

          <Link href="/resources/emergency" asChild>
            <Pressable style={styles.emergencyButton}>
              <Text style={styles.emergencyButtonText}>
                Emergency Contacts
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ink,
  },

  header: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },

  headerDecorCircle: {
    position: 'absolute',
    top: -45,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.accent,
    opacity: 0.22,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xl,
  },

  backText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.coralMid,
  },

  headerLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: '#A09890',
    letterSpacing: 0.9,
    marginBottom: 8,
  },

  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: colors.paper,
    lineHeight: 36,
  },

  headerTitleItalic: {
    fontFamily: fonts.serifItalic,
    color: colors.coralMid,
  },

  headerDescription: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: '#D4C8C0',
    lineHeight: 21,
    marginTop: 12,
    maxWidth: 360,
  },

  scroll: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 50,
  },

  sectionLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },

  secondSection: {
    marginTop: spacing.lg,
  },

  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  icon: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 19,
    color: colors.coral,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.ink2,
    marginBottom: 7,
  },

  cardDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
  },

  resetBox: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  resetTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.ink2,
    marginBottom: spacing.lg,
  },

  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },

  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    textAlign: 'center',
    lineHeight: 32,
    backgroundColor: colors.paper,
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.coral,
    marginRight: spacing.md,
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink2,
    marginBottom: 4,
  },

  stepDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
  },

  supportBox: {
    marginTop: spacing.md,
    backgroundColor: colors.ink,
    borderRadius: 16,
    padding: spacing.lg,
  },

  supportTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.paper,
    marginBottom: 7,
  },

  supportDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: '#D4C8C0',
    lineHeight: 20,
  },

  supportButton: {
    backgroundColor: colors.coral,
    borderRadius: 11,
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },

  supportButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.white,
  },

  secondaryBox: {
    marginTop: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
  },

  secondaryTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.ink2,
    marginBottom: 7,
  },

  secondaryDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.coral,
    borderRadius: 11,
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },

  secondaryButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.coral,
  },

  emergencyBox: {
    marginTop: spacing.md,
    backgroundColor: colors.coral,
    borderRadius: 16,
    padding: spacing.lg,
  },

  emergencyTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.white,
    marginBottom: 7,
  },

  emergencyDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.white,
    lineHeight: 20,
  },

  emergencyButton: {
    marginTop: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 11,
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },

  emergencyButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.coral,
  },
});