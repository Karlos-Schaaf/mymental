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

export default function AUTSupportScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View
          pointerEvents="none"
          style={styles.headerDecorCircle}
        />

        {/* Back to Resources */}
        <Link href="/resources" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backText}>‹ Resources</Text>
          </Pressable>
        </Link>

        <Text style={styles.headerLabel}>
          AUT SUPPORT
        </Text>

        <Text style={styles.headerTitle}>
          Wellbeing{'\n'}
          <Text style={styles.headerTitleItalic}>
            Support
          </Text>
        </Text>

        <Text style={styles.headerDescription}>
          Find wellbeing, counselling and health support available to AUT
          students.
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>
          Available support
        </Text>

        {/* Counselling & Mental Health */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>♡</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Counselling & Mental Health
            </Text>

            <Text style={styles.cardDescription}>
              AUT provides counselling and mental health support for students
              who need someone to talk to or additional wellbeing assistance.
            </Text>

            <Link
              href="https://www.aut.ac.nz/student-life/student-health-and-wellbeing"
              asChild
            >
              <Pressable style={styles.linkButton}>
                <Text style={styles.linkText}>
                  View AUT support →
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Student Medical Centre */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>＋</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Student Medical Centre
            </Text>

            <Text style={styles.cardDescription}>
              AUT students can access health and medical services through
              AUT&apos;s student medical centres.
            </Text>

            <Link
              href="https://www.aut.ac.nz/student-life/student-health-and-wellbeing"
              asChild
            >
              <Pressable style={styles.linkButton}>
                <Text style={styles.linkText}>
                  View medical services →
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Student Support */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>◎</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Student Support
            </Text>

            <Text style={styles.cardDescription}>
              Explore AUT services designed to support students throughout
              their studies and university experience.
            </Text>

            <Link
              href="https://www.aut.ac.nz/student-life/support-services"
              asChild
            >
              <Pressable style={styles.linkButton}>
                <Text style={styles.linkText}>
                  Explore student support →
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Emergency Support */}
        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>
            Looking for urgent help?
          </Text>

          <Text style={styles.supportDescription}>
            If you or someone else needs urgent support, return to the Resource
            Hub and select Emergency Contacts.
          </Text>

          <Link href="/resources/emergency" asChild>
            <Pressable style={styles.supportButton}>
              <Text style={styles.supportButtonText}>
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

  /* HEADER */

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

  /* CONTENT */

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

  /* CARDS */

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

  /* EXTERNAL LINKS */

  linkButton: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingRight: 10,
  },

  linkText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.coral,
  },

  /* EMERGENCY SUPPORT */

  supportBox: {
    marginTop: spacing.sm,
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
});