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

export default function AUTSupportScreen() {
  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Unable to open link:', error);
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
            AUT Wellbeing Support
          </Text>

          <Text style={styles.headerDescription}>
            Find counselling, health and wellbeing support available to AUT
            students.
          </Text>
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="heart-outline"
              size={28}
              color={colors.teal}
            />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Support for your wellbeing
            </Text>

            <Text style={styles.heroDescription}>
              AUT offers a range of services to support your mental,
              physical and overall wellbeing.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          Available Support
        </Text>

        {/* Counselling */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="chatbubbles-outline"
              size={22}
              color={colors.teal}
            />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Counselling & Mental Health
            </Text>

            <Text style={styles.cardDescription}>
              AUT provides counselling and mental health support for students
              who need someone to talk to or additional wellbeing assistance.
            </Text>

            <TouchableOpacity
              style={styles.linkButton}
              activeOpacity={0.6}
              onPress={() =>
                openLink(
                  'https://www.aut.ac.nz/student-life/student-health-and-wellbeing'
                )
              }
            >
              <Text style={styles.linkText}>
                View AUT support
              </Text>

              <Ionicons
                name="open-outline"
                size={16}
                color={colors.teal}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Medical */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="medical-outline"
              size={22}
              color={colors.teal}
            />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Student Medical Centre
            </Text>

            <Text style={styles.cardDescription}>
              AUT students can access health and medical services through
              AUT&apos;s student medical centres.
            </Text>

            <TouchableOpacity
              style={styles.linkButton}
              activeOpacity={0.6}
              onPress={() =>
                openLink(
                  'https://www.aut.ac.nz/student-life/student-health-and-wellbeing'
                )
              }
            >
              <Text style={styles.linkText}>
                View medical services
              </Text>

              <Ionicons
                name="open-outline"
                size={16}
                color={colors.teal}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Student support */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="people-outline"
              size={22}
              color={colors.teal}
            />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Student Support
            </Text>

            <Text style={styles.cardDescription}>
              Explore AUT services designed to support students throughout
              their studies and university experience.
            </Text>

            <TouchableOpacity
              style={styles.linkButton}
              activeOpacity={0.6}
              onPress={() =>
                openLink(
                  'https://www.aut.ac.nz/student-life/support-services'
                )
              }
            >
              <Text style={styles.linkText}>
                Explore student support
              </Text>

              <Ionicons
                name="open-outline"
                size={16}
                color={colors.teal}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency */}
        <TouchableOpacity
          style={styles.emergencyCard}
          activeOpacity={0.7}
          onPress={() => router.push('/resources/emergency')}
        >
          <View style={styles.emergencyIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={22}
              color={colors.coral}
            />
          </View>

          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>
              Looking for urgent help?
            </Text>

            <Text style={styles.emergencyDescription}>
              Open Emergency Contacts for immediate and urgent support.
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

  heroCard: {
    flexDirection: 'row',
    backgroundColor: colors.tealLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
  },

  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroContent: {
    flex: 1,
  },

  heroTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.ink,
  },

  heroDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink2,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  sectionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
  },

  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
  },

  cardDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },

  linkText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.teal,
  },

  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.coralLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  emergencyIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  emergencyContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  emergencyTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  emergencyDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
});
