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

export default function SelfCareScreen() {
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
            Self-Care
          </Text>

          <Text style={styles.headerDescription}>
            Small, practical actions can support your wellbeing during busy,
            stressful or difficult periods.
          </Text>
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="leaf-outline"
              size={28}
              color={colors.teal}
            />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Take care of yourself
            </Text>

            <Text style={styles.heroDescription}>
              Small everyday habits can help support your energy, mood and
              overall wellbeing.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          Everyday Self-Care
        </Text>

        <SelfCareCard
          icon="moon-outline"
          title="Sleep and rest"
          description="Try to keep a regular sleep routine and give yourself enough time to rest. Consistent sleep can support concentration, mood and energy."
        />

        <SelfCareCard
          icon="walk-outline"
          title="Move your body"
          description="Gentle movement, stretching, walking or exercise can help you reset after long periods of study or sitting."
        />

        <SelfCareCard
          icon="water-outline"
          title="Eat and hydrate regularly"
          description="Regular meals and enough water can support your energy and concentration throughout the day."
        />

        <SelfCareCard
          icon="people-outline"
          title="Stay connected"
          description="Spend time with people you trust. Talking with friends, family or supportive people can help when things feel difficult."
        />

        <SelfCareCard
          icon="pause-circle-outline"
          title="Take regular breaks"
          description="Step away from study or work for a few minutes when you can. Short breaks can help you reset your attention."
        />

        <Text style={styles.sectionLabel}>
          Quick Reset Ideas
        </Text>

        <View style={styles.tipCard}>
          <View style={styles.tipNumberCircle}>
            <Text style={styles.tipNumber}>01</Text>
          </View>

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
          <View style={styles.tipNumberCircle}>
            <Text style={styles.tipNumber}>02</Text>
          </View>

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
          <View style={styles.tipNumberCircle}>
            <Text style={styles.tipNumber}>03</Text>
          </View>

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

        {/* Stress management */}
        <TouchableOpacity
          style={styles.supportCard}
          activeOpacity={0.7}
          onPress={() => router.push('/resources/stress')}
        >
          <View style={styles.supportIcon}>
            <Ionicons
              name="pulse-outline"
              size={21}
              color={colors.teal}
            />
          </View>

          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>
              Feeling stressed?
            </Text>

            <Text style={styles.supportDescription}>
              Find practical strategies for managing pressure and feeling
              overwhelmed.
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
              Need more support?
            </Text>

            <Text style={styles.secondaryDescription}>
              Self-care can help, but AUT wellbeing services are also available
              if you need additional support.
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

function SelfCareCard({
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

  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },

  tipNumberCircle: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tipNumber: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.teal,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  tipDescription: {
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
});
