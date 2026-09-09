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

export default function InternationalSupportScreen() {
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
            International Support
          </Text>

          <Text style={styles.headerDescription}>
            Find support and guidance for studying, living and adjusting to
            life in New Zealand as an international student.
          </Text>
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="globe-outline"
              size={28}
              color={colors.teal}
            />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              International Student Support
            </Text>

            <Text style={styles.heroDescription}>
              Find AUT services and practical guidance to help you settle,
              study and feel supported in New Zealand.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          AUT Support
        </Text>

        {/* AUT International */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="school-outline"
              size={22}
              color={colors.teal}
            />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              AUT International Student Support
            </Text>

            <Text style={styles.cardDescription}>
              AUT provides support for international students with studying,
              settling into life in New Zealand and accessing university
              services.
            </Text>

            <TouchableOpacity
              style={styles.linkButton}
              activeOpacity={0.6}
              onPress={() =>
                openLink(
                  'https://www.aut.ac.nz/international/international-student-support'
                )
              }
            >
              <Text style={styles.linkText}>
                Visit AUT International
              </Text>

              <Ionicons
                name="open-outline"
                size={16}
                color={colors.teal}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Student Hub */}
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
              Student Hub
            </Text>

            <Text style={styles.cardDescription}>
              The Student Hub can help with general student support, study
              questions and finding the right AUT service.
            </Text>

            <TouchableOpacity
              style={styles.linkButton}
              activeOpacity={0.6}
              onPress={() =>
                openLink(
                  'https://www.aut.ac.nz/student-life/support-services/student-hub'
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

        <Text style={styles.sectionLabel}>
          Helpful Guidance
        </Text>

        {/* Settling */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="home-outline"
              size={21}
              color={colors.teal}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Settling into New Zealand
            </Text>

            <Text style={styles.infoDescription}>
              Moving to a new country can involve changes in culture, study
              expectations, language, routines and social connections. Using
              university support early can make the adjustment easier.
            </Text>
          </View>
        </View>

        {/* Study */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="book-outline"
              size={21}
              color={colors.teal}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Study support
            </Text>

            <Text style={styles.infoDescription}>
              If you are finding study difficult, ask for help early. AUT
              support services can help you identify academic, wellbeing or
              practical support that may be useful.
            </Text>
          </View>
        </View>

        {/* Wellbeing */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="heart-outline"
              size={21}
              color={colors.teal}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Your wellbeing matters
            </Text>

            <Text style={styles.infoDescription}>
              Feeling homesick, isolated or overwhelmed can happen while
              adjusting to a new environment. You can use the Resource Hub to
              find counselling, self-care and stress-management support.
            </Text>
          </View>
        </View>

        {/* AUT wellbeing */}
        <TouchableOpacity
          style={styles.supportCard}
          activeOpacity={0.7}
          onPress={() => router.push('/resources/aut-support')}
        >
          <View style={styles.supportIcon}>
            <Ionicons
              name="heart-outline"
              size={21}
              color={colors.teal}
            />
          </View>

          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>
              Need wellbeing support?
            </Text>

            <Text style={styles.supportDescription}>
              Find counselling, health and wellbeing services through AUT.
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
    alignItems: 'center',
    backgroundColor: colors.tealLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
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

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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

  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tealLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  supportIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  supportContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  supportTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  supportDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
});
