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

const strategies = [
  {
    icon: 'timer-outline' as const,
    title: 'Pause for one minute',
    description:
      'Slow down and give yourself a short moment before deciding what to do next.',
  },
  {
    icon: 'list-outline' as const,
    title: 'Break it into smaller steps',
    description:
      'Choose one manageable task instead of trying to deal with everything at once.',
  },
  {
    icon: 'walk-outline' as const,
    title: 'Move and reset',
    description:
      'A short walk or stretch can help release tension and create some mental space.',
  },
  {
    icon: 'chatbubble-ellipses-outline' as const,
    title: 'Talk to someone',
    description:
      'Sharing what is happening with someone you trust can make stress feel more manageable.',
  },
];

export default function StressScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Stress Management"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="pulse-outline"
              size={28}
              color={colors.amber}
            />
          </View>

          <Text style={styles.heroTitle}>
            Managing Stress
          </Text>

          <Text style={styles.heroDescription}>
            Stress can build quickly. Simple strategies can help you slow
            things down and regain a sense of control.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Try these strategies
        </Text>

        <View style={styles.listCard}>
          {strategies.map((strategy, index) => (
            <View
              key={strategy.title}
              style={[
                styles.strategyItem,
                index !== strategies.length - 1 &&
                  styles.strategyBorder,
              ]}
            >
              <View style={styles.strategyIcon}>
                <Ionicons
                  name={strategy.icon}
                  size={21}
                  color={colors.amber}
                />
              </View>

              <View style={styles.strategyContent}>
                <Text style={styles.strategyTitle}>
                  {strategy.title}
                </Text>

                <Text style={styles.strategyDescription}>
                  {strategy.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.breathingCard}>
          <View style={styles.breathingHeader}>
            <Ionicons
              name="cloud-outline"
              size={23}
              color={colors.teal}
            />

            <Text style={styles.breathingTitle}>
              Quick breathing reset
            </Text>
          </View>

          <Text style={styles.breathingDescription}>
            Try breathing in slowly for four seconds, pause briefly, then
            breathe out slowly. Repeat a few times at a comfortable pace.
          </Text>
        </View>

        <View style={styles.supportCard}>
          <Ionicons
            name="heart-outline"
            size={22}
            color={colors.coral}
          />

          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>
              When stress feels too much
            </Text>

            <Text style={styles.supportDescription}>
              If stress is affecting your daily life or feels difficult to
              manage, consider talking with someone or using wellbeing support.
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
    backgroundColor: colors.amberLight,
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

  strategyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    gap: spacing.md,
  },

  strategyBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  strategyIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.amberLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  strategyContent: {
    flex: 1,
  },

  strategyTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  strategyDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  breathingCard: {
    backgroundColor: colors.tealLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  breathingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  breathingTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  breathingDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink2,
    lineHeight: 19,
    marginTop: spacing.md,
  },

  supportCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },

  supportContent: {
    flex: 1,
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