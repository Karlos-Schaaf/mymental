import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
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

const resources = [
  {
    id: 'aut',
    icon: 'heart-outline' as const,
    title: 'AUT Wellbeing Support',
    description:
      'Counselling, wellbeing services and support available through AUT.',
    color: colors.teal,
    background: colors.tealLight,
  },
  {
    id: 'emergency',
    icon: 'alert-circle-outline' as const,
    title: 'Emergency Contacts',
    description:
      'Find urgent support and emergency contact information.',
    color: colors.coral,
    background: colors.coralLight,
  },
  {
    id: 'international',
    icon: 'globe-outline' as const,
    title: 'International Student Support',
    description:
      'Support and guidance for international students at AUT.',
    color: colors.accent,
    background: colors.accentLight,
  },
  {
    id: 'self-care',
    icon: 'leaf-outline' as const,
    title: 'Self-Care Resources',
    description:
      'Simple guidance and activities to support your everyday wellbeing.',
    color: colors.teal,
    background: colors.tealLight,
  },
  {
    id: 'stress',
    icon: 'pulse-outline' as const,
    title: 'Stress Management',
    description:
      'Practical strategies for managing stress and feeling overwhelmed.',
    color: colors.amber,
    background: colors.amberLight,
  },
];

export default function ResourcesScreen() {
  const openResource = (id: string) => {
    switch (id) {
      case 'aut':
        router.push('/resources/aut-support');
        break;
      case 'emergency':
        router.push('/resources/emergency');
        break;
      case 'international':
        router.push('/resources/international');
        break;
      case 'self-care':
        router.push('/resources/self-care');
        break;
      case 'stress':
        router.push('/resources/stress');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Resources</Text>
          <Text style={styles.headerDescription}>
            Find trusted support, practical guidance and tools for your wellbeing.
          </Text>
        </View>

        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons
              name="heart-outline"
              size={26}
              color={colors.teal}
            />
          </View>

          <View style={styles.introContent}>
            <Text style={styles.introTitle}>
              Support when you need it
            </Text>

            <Text style={styles.introDescription}>
              Browse wellbeing resources and find the right support for your situation.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          Browse Resources
        </Text>

        <View style={styles.resourceList}>
          {resources.map((resource) => (
            <Pressable
              key={resource.id}
              onPress={() => openResource(resource.id)}
              style={({ pressed }) => [
                styles.resourceCard,
                pressed && styles.pressedCard,
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: resource.background },
                ]}
              >
                <Ionicons
                  name={resource.icon}
                  size={22}
                  color={resource.color}
                />
              </View>

              <View style={styles.resourceInformation}>
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
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => router.push('/resources/emergency')}
          style={({ pressed }) => [
            styles.supportBox,
            pressed && styles.pressedCard,
          ]}
        >
          <View style={styles.supportIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={22}
              color={colors.coral}
            />
          </View>

          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>
              Need urgent help?
            </Text>

            <Text style={styles.supportDescription}>
              If you or someone else may be in immediate danger, open Emergency Contacts for urgent support.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.mutedLight}
          />
        </Pressable>
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
    paddingTop: spacing.md,
    gap: spacing.xs,
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
    maxWidth: 360,
  },

  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tealLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },

  introIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: spacing.xs,
  },

  introDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink2,
    lineHeight: 19,
  },

  sectionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
  },

  resourceList: {
    gap: spacing.md,
  },

  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  pressedCard: {
    opacity: 0.65,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  resourceInformation: {
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
    lineHeight: 19,
  },

  supportBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.coralLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  supportIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: spacing.xs,
  },

  supportDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },
});
