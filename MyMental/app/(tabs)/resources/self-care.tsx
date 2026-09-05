import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import ScreenHeader from '../../../src/components/ScreenHeader';

const activities = [
  {
    icon: 'water-outline' as const,
    title: 'Take care of the basics',
    description:
      'Drink some water, eat something nourishing and give yourself time to rest.',
  },
  {
    icon: 'walk-outline' as const,
    title: 'Move your body',
    description:
      'A short walk, gentle stretching or a few minutes outside can help reset your day.',
  },
  {
    icon: 'moon-outline' as const,
    title: 'Protect your rest',
    description:
      'Try to keep a consistent sleep routine and give yourself time to wind down.',
  },
  {
    icon: 'people-outline' as const,
    title: 'Stay connected',
    description:
      'Reach out to someone you trust when you are feeling isolated or overwhelmed.',
  },
];

export default function SelfCareScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Self-Care"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="leaf-outline"
              size={28}
              color={colors.teal}
            />
          </View>

          <Text style={styles.heroTitle}>
            Everyday Self-Care
          </Text>

          <Text style={styles.heroDescription}>
            Small, realistic actions can support your wellbeing and help you
            feel more grounded.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Simple things you can try
        </Text>

        <View style={styles.listCard}>
          {activities.map((activity, index) => (
            <View
              key={activity.title}
              style={[
                styles.activityItem,
                index !== activities.length - 1 &&
                  styles.activityBorder,
              ]}
            >
              <View style={styles.activityIcon}>
                <Ionicons
                  name={activity.icon}
                  size={21}
                  color={colors.teal}
                />
              </View>

              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  {activity.title}
                </Text>

                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.pauseCard}>
          <Ionicons
            name="pause-circle-outline"
            size={24}
            color={colors.accent}
          />

          <View style={styles.pauseContent}>
            <Text style={styles.pauseTitle}>
              Give yourself permission to pause
            </Text>

            <Text style={styles.pauseDescription}>
              You do not have to solve everything at once. A short break can
              help you return with more clarity.
            </Text>
          </View>
        </View>

        <View style={styles.reminderCard}>
          <Ionicons
            name="heart-outline"
            size={22}
            color={colors.coral}
          />

          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>
              Self-care is not a replacement for support
            </Text>

            <Text style={styles.reminderDescription}>
              If things feel difficult for a long time or become overwhelming,
              consider reaching out to wellbeing or professional support.
            </Text>
          </View>
        </View>
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
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },

  heroCard: {
    backgroundColor: colors.tealLight,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },

  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 25,
    color: colors.ink,
  },

  heroDescription: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink2,
    lineHeight: 21,
    marginTop: spacing.sm,
  },

  sectionTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  listCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    gap: spacing.md,
  },

  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  activityIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  activityDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  pauseCard: {
    flexDirection: 'row',
    backgroundColor: colors.accentLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },

  pauseContent: {
    flex: 1,
  },

  pauseTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  pauseDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink2,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  reminderCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },

  reminderContent: {
    flex: 1,
  },

  reminderTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  reminderDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
});