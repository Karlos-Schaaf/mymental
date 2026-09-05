import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import {
  colors,
  fonts,
  spacing,
  radius,
} from '../../../src/constants/theme';

type ResourceItem = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  route:
    | '/resources/aut-support'
    | '/resources/emergency'
    | '/resources/international'
    | '/resources/self-care'
    | '/resources/stress';
};

const resources: ResourceItem[] = [
  {
    title: 'AUT Wellbeing Support',
    description:
      'Counselling, health and wellbeing services available through AUT.',
    icon: 'heart-outline',
    iconColor: colors.teal,
    iconBackground: colors.tealLight,
    route: '/resources/aut-support',
  },
  {
    title: 'Emergency Contacts',
    description:
      'Urgent support and emergency contact information.',
    icon: 'alert-circle-outline',
    iconColor: colors.coral,
    iconBackground: colors.coralLight,
    route: '/resources/emergency',
  },
  {
    title: 'International Student Support',
    description:
      'Guidance and support for international students at AUT.',
    icon: 'globe-outline',
    iconColor: colors.accent,
    iconBackground: colors.accentLight,
    route: '/resources/international',
  },
  {
    title: 'Self-Care Resources',
    description:
      'Simple activities and guidance for everyday wellbeing.',
    icon: 'leaf-outline',
    iconColor: colors.teal,
    iconBackground: colors.tealLight,
    route: '/resources/self-care',
  },
  {
    title: 'Stress Management',
    description:
      'Practical strategies for stress and feeling overwhelmed.',
    icon: 'pulse-outline',
    iconColor: colors.amber,
    iconBackground: colors.amberLight,
    route: '/resources/stress',
  },
];

export default function ResourcesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Resources</Text>

          <Text style={styles.subtitle}>
            Find support, practical guidance and tools for your wellbeing.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Ionicons
              name="sparkles-outline"
              size={26}
              color={colors.coral}
            />
          </View>

          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>
              Support when you need it
            </Text>

            <Text style={styles.featureDescription}>
              Browse trusted wellbeing resources and find the right support
              for your situation.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Browse resources</Text>

        <View style={styles.listCard}>
          {resources.map((resource, index) => (
            <TouchableOpacity
              key={resource.title}
              style={[
                styles.resourceItem,
                index !== resources.length - 1 &&
                  styles.resourceItemBorder,
              ]}
              activeOpacity={0.6}
              onPress={() => router.push(resource.route)}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: resource.iconBackground },
                ]}
              >
                <Ionicons
                  name={resource.icon}
                  size={22}
                  color={resource.iconColor}
                />
              </View>

              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>
                  {resource.title}
                </Text>

                <Text style={styles.resourceDescription}>
                  {resource.description}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.mutedLight}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.reminderCard}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={colors.coral}
          />

          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>
              Need urgent help?
            </Text>

            <Text style={styles.reminderDescription}>
              Use Emergency Contacts if you or someone else needs immediate
              support.
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },

  header: {
    marginBottom: spacing.xl,
  },

  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    color: colors.ink,
  },

  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 21,
    marginTop: spacing.sm,
    maxWidth: 420,
  },

  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.coralLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: spacing.xs,
  },

  featureDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink2,
    lineHeight: 19,
  },

  sectionTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
    marginBottom: spacing.md,
  },

  listCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },

  resourceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  resourceContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  resourceTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
    marginBottom: spacing.xs,
  },

  resourceDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },

  reminderCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.xl,
  },

  reminderContent: {
    flex: 1,
  },

  reminderTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
    marginBottom: spacing.xs,
  },

  reminderDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },
});