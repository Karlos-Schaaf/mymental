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

export default function InternationalSupportScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
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
          INTERNATIONAL SUPPORT
        </Text>

        <Text style={styles.headerTitle}>
          Student{'\n'}
          <Text style={styles.headerTitleItalic}>
            Support
          </Text>
        </Text>

        <Text style={styles.headerDescription}>
          Find support and guidance for studying, living and adjusting
          to life in New Zealand as an international student.
        </Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>
          AUT support
        </Text>

        {/* AUT INTERNATIONAL SUPPORT */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>◎</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              AUT International Student Support
            </Text>

            <Text style={styles.cardDescription}>
              AUT provides support for international students with
              studying, settling into life in New Zealand and accessing
              university services.
            </Text>

            <Link
              href="https://www.aut.ac.nz/international/international-student-support"
              asChild
            >
              <Pressable style={styles.linkButton}>
                <Text style={styles.linkText}>
                  Visit AUT International →
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* STUDENT HUB */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>◉</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Student Hub
            </Text>

            <Text style={styles.cardDescription}>
              The Student Hub can help with general student support,
              study questions and finding the right AUT service.
            </Text>

            <Link
              href="https://www.aut.ac.nz/student-life/support-services/student-hub"
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

        {/* HELPFUL GUIDANCE */}
        <Text style={[styles.sectionLabel, styles.secondSection]}>
          Helpful guidance
        </Text>

        {/* SETTLING IN */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Settling into New Zealand
          </Text>

          <Text style={styles.infoDescription}>
            Moving to a new country can involve changes in culture,
            study expectations, language, routines and social
            connections. Using university support early can make the
            adjustment easier.
          </Text>
        </View>

        {/* STUDY SUPPORT */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Study support
          </Text>

          <Text style={styles.infoDescription}>
            If you are finding study difficult, ask for help early.
            AUT support services can help you identify academic,
            wellbeing or practical support that may be useful.
          </Text>
        </View>

        {/* WELLBEING */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Your wellbeing matters
          </Text>

          <Text style={styles.infoDescription}>
            Feeling homesick, isolated or overwhelmed can happen while
            adjusting to a new environment. You can use the Resource
            Hub to find counselling, self-care and stress-management
            support.
          </Text>
        </View>

        {/* AUT WELLBEING BUTTON */}
        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>
            Need wellbeing support?
          </Text>

          <Text style={styles.supportDescription}>
            You can also use AUT Wellbeing Support for counselling,
            health and wellbeing services.
          </Text>

          <Link href="/resources/aut-support" asChild>
            <Pressable style={styles.supportButton}>
              <Text style={styles.supportButtonText}>
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

  linkButton: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },

  linkText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.coral,
  },

  infoCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  infoTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.ink2,
    marginBottom: 7,
  },

  infoDescription: {
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
});