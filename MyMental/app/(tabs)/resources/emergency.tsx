import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import {
  colors,
  fonts,
  spacing,
  radius,
} from '../../../src/constants/theme';

export default function EmergencyScreen() {
  const callNumber = async (number: string) => {
    try {
      await Linking.openURL(`tel:${number}`);
    } catch (error) {
      console.error('Unable to place call:', error);
    }
  };

  const textNumber = async (number: string) => {
    try {
      await Linking.openURL(`sms:${number}`);
    } catch (error) {
      console.error('Unable to open messages:', error);
    }
  };

  const openWebsite = async () => {
    try {
      await Linking.openURL('https://1737.org.nz/');
    } catch (error) {
      console.error('Unable to open website:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.6}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.ink}
            />
            <Text style={styles.backText}>Resources</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Emergency Contacts
          </Text>

          <Text style={styles.headerDescription}>
            Find immediate and confidential support when you or someone else
            needs help.
          </Text>
        </View>

        {/* Immediate danger */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyIcon}>
            <Ionicons
              name="warning-outline"
              size={28}
              color={colors.coral}
            />
          </View>

          <Text style={styles.emergencyTitle}>
            Immediate danger
          </Text>

          <Text style={styles.emergencyDescription}>
            If you or someone else is in immediate danger, call New Zealand
            emergency services.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.7}
            onPress={() => callNumber('111')}
          >
            <Ionicons
              name="call-outline"
              size={18}
              color={colors.white}
            />
            <Text style={styles.primaryButtonText}>
              Call 111
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>
          Mental Health Support
        </Text>

        {/* 1737 */}
        <View style={styles.supportCard}>
          <View style={styles.supportHeader}>
            <View style={styles.supportIcon}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={22}
                color={colors.teal}
              />
            </View>

            <View style={styles.supportHeadingContent}>
              <Text style={styles.supportTitle}>
                1737 Need to Talk?
              </Text>

              <Text style={styles.supportSubtitle}>
                Free and confidential, 24/7
              </Text>
            </View>
          </View>

          <Text style={styles.supportDescription}>
            Free, confidential support from trained counsellors is available
            24 hours a day, every day of the week.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.callButton}
              activeOpacity={0.7}
              onPress={() => callNumber('1737')}
            >
              <Ionicons
                name="call-outline"
                size={17}
                color={colors.white}
              />
              <Text style={styles.callButtonText}>
                Call 1737
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.textButton}
              activeOpacity={0.7}
              onPress={() => textNumber('1737')}
            >
              <Ionicons
                name="chatbubble-outline"
                size={17}
                color={colors.teal}
              />
              <Text style={styles.textButtonText}>
                Text 1737
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.websiteButton}
            activeOpacity={0.6}
            onPress={openWebsite}
          >
            <Text style={styles.websiteText}>
              Visit 1737 website
            </Text>

            <Ionicons
              name="open-outline"
              size={16}
              color={colors.teal}
            />
          </TouchableOpacity>
        </View>

        {/* Help info */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={colors.teal}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Not sure what kind of help you need?
            </Text>

            <Text style={styles.infoDescription}>
              You can use 1737 for brief emotional support and information
              about other services that may be appropriate for you.
            </Text>
          </View>
        </View>

        {/* AUT support */}
        <TouchableOpacity
          style={styles.autCard}
          activeOpacity={0.7}
          onPress={() => router.push('/resources/aut-support')}
        >
          <View style={styles.autIcon}>
            <Ionicons
              name="heart-outline"
              size={21}
              color={colors.teal}
            />
          </View>

          <View style={styles.autContent}>
            <Text style={styles.autTitle}>
              Looking for AUT support?
            </Text>

            <Text style={styles.autDescription}>
              Find non-emergency counselling, health and wellbeing services.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.mutedLight}
          />
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

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },

  header: {
    paddingTop: spacing.sm,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },

  backText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink,
  },

  headerTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 24,
    color: colors.ink,
  },

  headerDescription: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 21,
    marginTop: spacing.xs,
  },

  emergencyCard: {
    backgroundColor: colors.coralLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  emergencyIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  emergencyTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    color: colors.ink,
  },

  emergencyDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink2,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.teal,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },

  primaryButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.white,
  },

  sectionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
  },

  supportCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  supportIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  supportHeadingContent: {
    flex: 1,
  },

  supportTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.ink,
  },

  supportSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },

  supportDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: spacing.md,
  },

  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.teal,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  callButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.white,
  },

  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.teal,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  textButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.teal,
  },

  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    marginTop: spacing.lg,
  },

  websiteText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.teal,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  infoDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  autCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tealLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  autIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  autContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  autTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  autDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
});
