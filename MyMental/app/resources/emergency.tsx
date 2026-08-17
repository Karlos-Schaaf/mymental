import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Linking,
} from 'react-native';

import { Link } from 'expo-router';
import { colors, fonts, spacing } from '../../src/constants/theme';

export default function EmergencyScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View pointerEvents="none" style={styles.headerDecorCircle} />

        <Link href="/resources" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backText}>‹ Resources</Text>
          </Pressable>
        </Link>

        <Text style={styles.headerLabel}>URGENT SUPPORT</Text>

        <Text style={styles.headerTitle}>
          Emergency{'\n'}
          <Text style={styles.headerTitleItalic}>Contacts</Text>
        </Text>

        <Text style={styles.headerDescription}>
          Find immediate and confidential support when you or someone else
          needs help.
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Immediate Danger */}
        <View style={styles.emergencyBox}>
          <View style={styles.emergencyIcon}>
            <Text style={styles.emergencyIconText}>!</Text>
          </View>

          <Text style={styles.emergencyTitle}>Immediate danger</Text>

          <Text style={styles.emergencyDescription}>
            If you or someone else is in immediate danger, call New Zealand
            emergency services.
          </Text>

          <Pressable
            style={styles.whiteButton}
            onPress={() => Linking.openURL('tel:111')}
          >
            <Text style={styles.whiteButtonText}>Call 111</Text>
          </Pressable>
        </View>

        {/* Mental Health Support */}
        <Text style={styles.sectionLabel}>Mental health support</Text>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>♡</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>1737 Need to Talk?</Text>

            <Text style={styles.cardDescription}>
              Free, confidential support from trained counsellors is available
              24 hours a day, every day of the week.
            </Text>

            <View style={styles.buttonRow}>
              <Pressable
                style={styles.primaryButton}
                onPress={() => Linking.openURL('tel:1737')}
              >
                <Text style={styles.primaryButtonText}>Call 1737</Text>
              </Pressable>

              <Pressable
                style={styles.outlineButton}
                onPress={() => Linking.openURL('sms:1737')}
              >
                <Text style={styles.outlineButtonText}>Text 1737</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.websiteButton}
              onPress={() => Linking.openURL('https://1737.org.nz/')}
            >
              <Text style={styles.websiteText}>Visit 1737 website →</Text>
            </Pressable>
          </View>
        </View>

        {/* Help Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Not sure what kind of help you need?
          </Text>

          <Text style={styles.infoDescription}>
            You can use 1737 for brief emotional support and information about
            other services that may be appropriate for you.
          </Text>
        </View>

        {/* AUT Support */}
        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>Looking for AUT support?</Text>

          <Text style={styles.supportDescription}>
            For non-emergency counselling, health and wellbeing services,
            return to AUT Wellbeing Support.
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
    color: colors.coralMid,
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

  emergencyBox: {
    backgroundColor: colors.coral,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },

  emergencyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  emergencyIconText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 20,
    color: colors.white,
  },

  emergencyTitle: {
    fontFamily: fonts.serif,
    fontSize: 21,
    color: colors.white,
    marginBottom: 8,
  },

  emergencyDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.white,
    lineHeight: 20,
  },

  whiteButton: {
    backgroundColor: colors.white,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 11,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
  },

  whiteButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.coral,
  },

  sectionLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },

  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
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

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.md,
  },

  primaryButton: {
    backgroundColor: colors.coral,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  primaryButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.white,
  },

  outlineButton: {
    borderWidth: 1,
    borderColor: colors.coral,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  outlineButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.coral,
  },

  websiteButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
  },

  websiteText: {
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
    backgroundColor: colors.ink,
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.sm,
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