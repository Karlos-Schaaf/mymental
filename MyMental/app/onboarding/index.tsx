import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, spacing, radius } from '../../src/constants/theme';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoCircle}>
            <Ionicons name="heart-outline" size={48} color={colors.teal} />
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.title}>Welcome to MyMental</Text>

            <Text style={styles.subtitle}>
              A safe space to reflect, understand your emotions, and support
              your wellbeing.
            </Text>
          </View>

          <View style={styles.features}>
            <Feature
              icon="book-outline"
              title="Reflect"
              description="Write about your thoughts and feelings."
            />

            <Feature
              icon="happy-outline"
              title="Understand"
              description="Keep track of your mood and wellbeing."
            />

            <Feature
              icon="heart-outline"
              title="Support"
              description="Find helpful wellbeing resources when you need them."
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/onboarding/name')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={22} color={colors.teal} />
      </View>

      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
  },

  content: {
    alignItems: 'center',
  },

  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },

  textBlock: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },

  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 28,
    color: colors.ink,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 330,
  },

  features: {
    width: '100%',
    gap: spacing.md,
  },

  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  featureText: {
    flex: 1,
    gap: 2,
  },

  featureTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
  },

  featureDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },

  button: {
    backgroundColor: colors.teal,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },

  buttonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.white,
  },
});