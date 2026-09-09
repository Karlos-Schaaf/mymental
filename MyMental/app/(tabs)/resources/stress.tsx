import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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

export default function StressManagementScreen() {
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
            Stress Management
          </Text>

          <Text style={styles.headerDescription}>
            Practical strategies to help you slow down, organise your thoughts
            and respond to stressful moments.
          </Text>
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="pulse-outline"
              size={28}
              color={colors.teal}
            />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Manage the pressure
            </Text>

            <Text style={styles.heroDescription}>
              Small, practical steps can help you regain focus when stress
              starts to feel overwhelming.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          Practical Strategies
        </Text>

        <StrategyCard
          icon="cloud-outline"
          title="Slow your breathing"
          description="Take a few slow breaths and focus your attention on each inhale and exhale. Slowing down for a moment can help you create space before deciding what to do next."
        />

        <StrategyCard
          icon="list-outline"
          title="Break tasks into smaller steps"
          description="Large assignments or responsibilities can feel overwhelming. Choose one small, specific action and focus on completing that before moving to the next."
        />

        <StrategyCard
          icon="walk-outline"
          title="Take short breaks"
          description="Step away from study or work for a few minutes. Stretch, move, get some water or change your surroundings before returning."
        />

        <StrategyCard
          icon="checkmark-circle-outline"
          title="Decide what matters most"
          description="Write down what you need to do and identify what is genuinely urgent. Not everything has to be completed at the same time."
        />

        <StrategyCard
          icon="chatbubble-ellipses-outline"
          title="Talk to someone"
          description="Reaching out to a trusted friend, family member, classmate or support service can help when stress feels difficult to manage alone."
        />

        <Text style={styles.sectionLabel}>
          A Quick Reset
        </Text>

        {/* 3-step reset */}
        <View style={styles.resetCard}>
          <View style={styles.resetHeader}>
            <View style={styles.resetHeaderIcon}>
              <Ionicons
                name="refresh-outline"
                size={22}
                color={colors.teal}
              />
            </View>

            <Text style={styles.resetTitle}>
              Try the 3-step reset
            </Text>
          </View>

          <ResetStep
            number="1"
            title="Pause"
            description="Stop what you are doing for a moment and notice how you feel."
          />

          <ResetStep
            number="2"
            title="Breathe"
            description="Take a few slow breaths and allow your attention to settle."
          />

          <ResetStep
            number="3"
            title="Choose one next step"
            description="Pick one small and manageable action you can take next."
            isLast
          />
        </View>

        {/* Self-care */}
        <TouchableOpacity
          style={styles.supportCard}
          activeOpacity={0.7}
          onPress={() => router.push('/resources/self-care')}
        >
          <View style={styles.supportIcon}>
            <Ionicons
              name="leaf-outline"
              size={21}
              color={colors.teal}
            />
          </View>

          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>
              Build regular self-care
            </Text>

            <Text style={styles.supportDescription}>
              Find everyday habits and simple activities that can support your
              wellbeing.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.mutedLight}
          />
        </TouchableOpacity>

        {/* AUT support */}
        <TouchableOpacity
          style={styles.secondaryCard}
          activeOpacity={0.7}
          onPress={() => router.push('/resources/aut-support')}
        >
          <View style={styles.secondaryIcon}>
            <Ionicons
              name="heart-outline"
              size={21}
              color={colors.teal}
            />
          </View>

          <View style={styles.secondaryContent}>
            <Text style={styles.secondaryTitle}>
              Stress becoming hard to manage?
            </Text>

            <Text style={styles.secondaryDescription}>
              Explore AUT counselling and wellbeing support if stress is
              affecting your daily life, study or wellbeing.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.mutedLight}
          />
        </TouchableOpacity>

        {/* Emergency */}
        <TouchableOpacity
          style={styles.emergencyCard}
          activeOpacity={0.7}
          onPress={() => router.push('/resources/emergency')}
        >
          <View style={styles.emergencyIcon}>
            <Ionicons
              name="warning-outline"
              size={21}
              color={colors.teal}
            />
          </View>

          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>
              Need urgent support?
            </Text>

            <Text style={styles.emergencyDescription}>
              If you or someone else needs immediate help, open Emergency
              Contacts.
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

function StrategyCard({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons
          name={icon}
          size={22}
          color={colors.teal}
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {title}
        </Text>

        <Text style={styles.cardDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

function ResetStep({
  number,
  title,
  description,
  isLast,
}: {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <View
      style={[
        styles.step,
        !isLast && styles.stepBorder,
      ]}
    >
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>
          {number}
        </Text>
      </View>

      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>
          {title}
        </Text>

        <Text style={styles.stepDescription}>
          {description}
        </Text>
      </View>
    </View>
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

  resetCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },

  resetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },

  resetHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resetTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.ink,
  },

  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.lg,
  },

  stepBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  stepNumberText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.teal,
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  stepDescription: {
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

  secondaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  secondaryIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  secondaryContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  secondaryTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  secondaryDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tealLight,
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
