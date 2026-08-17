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

export default function SelfCareScreen() {
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
          SELF-CARE
        </Text>

        <Text style={styles.headerTitle}>
          Take care{'\n'}
          <Text style={styles.headerTitleItalic}>
            of yourself
          </Text>
        </Text>

        <Text style={styles.headerDescription}>
          Small, practical actions can support your wellbeing during busy,
          stressful or difficult periods.
        </Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>
          Everyday self-care
        </Text>

        {/* SLEEP */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>☾</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Sleep and rest
            </Text>

            <Text style={styles.cardDescription}>
              Try to keep a regular sleep routine and give yourself enough time
              to rest. Consistent sleep can support concentration, mood and
              energy.
            </Text>
          </View>
        </View>

        {/* MOVEMENT */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>◇</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Move your body
            </Text>

            <Text style={styles.cardDescription}>
              Gentle movement, stretching, walking or exercise can help you
              reset after long periods of study or sitting.
            </Text>
          </View>
        </View>

        {/* FOOD */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>○</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Eat and hydrate regularly
            </Text>

            <Text style={styles.cardDescription}>
              Regular meals and enough water can support your energy and
              concentration throughout the day.
            </Text>
          </View>
        </View>

        {/* CONNECTION */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>♡</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Stay connected
            </Text>

            <Text style={styles.cardDescription}>
              Spend time with people you trust. Talking with friends, family or
              supportive people can help when things feel difficult.
            </Text>
          </View>
        </View>

        {/* BREAKS */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>◉</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Take regular breaks
            </Text>

            <Text style={styles.cardDescription}>
              Step away from study or work for a few minutes when you can.
              Short breaks can help you reset your attention.
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, styles.secondSection]}>
          Quick reset ideas
        </Text>

        <View style={styles.tipCard}>
          <Text style={styles.tipNumber}>01</Text>

          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>
              Slow down for a moment
            </Text>

            <Text style={styles.tipDescription}>
              Pause what you are doing and notice your breathing, surroundings
              and how your body feels.
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipNumber}>02</Text>

          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>
              Do one manageable thing
            </Text>

            <Text style={styles.tipDescription}>
              Choose one small task instead of trying to solve everything at
              once.
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipNumber}>03</Text>

          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>
              Make space for something you enjoy
            </Text>

            <Text style={styles.tipDescription}>
              Music, hobbies, time outside or another enjoyable activity can be
              a useful part of taking care of yourself.
            </Text>
          </View>
        </View>

        {/* STRESS MANAGEMENT CTA */}
        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>
            Feeling stressed?
          </Text>

          <Text style={styles.supportDescription}>
            The Stress Management section has additional practical strategies
            for managing pressure and feeling overwhelmed.
          </Text>

          <Link href="/resources/stress" asChild>
            <Pressable style={styles.supportButton}>
              <Text style={styles.supportButtonText}>
                Stress Management
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* AUT SUPPORT CTA */}
        <View style={styles.secondaryBox}>
          <Text style={styles.secondaryTitle}>
            Need more support?
          </Text>

          <Text style={styles.secondaryDescription}>
            Self-care can be useful, but you do not have to manage everything
            by yourself. AUT wellbeing services are available if you need
            additional support.
          </Text>

          <Link href="/resources/aut-support" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                AUT Wellbeing Support
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
    backgroundColor: colors.coral,
    opacity: 0.18,
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

  tipCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  tipNumber: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    color: colors.coral,
    marginRight: spacing.md,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.ink2,
    marginBottom: 6,
  },

  tipDescription: {
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
});