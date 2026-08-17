import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';

import { router } from 'expo-router';
import { colors, fonts, spacing } from '../../src/constants/theme';

const resources = [
  {
    id: 'aut',
    symbol: '◉',
    title: 'AUT Wellbeing Support',
    description:
      'Counselling, wellbeing services and support available through AUT.',
  },
  {
    id: 'emergency',
    symbol: '!',
    title: 'Emergency Contacts',
    description:
      'Find urgent support and emergency contact information.',
    emergency: true,
  },
  {
    id: 'international',
    symbol: '◎',
    title: 'International Student Support',
    description:
      'Support and guidance for international students at AUT.',
  },
  {
    id: 'self-care',
    symbol: '♡',
    title: 'Self-Care Resources',
    description:
      'Simple guidance and activities to support your everyday wellbeing.',
  },
  {
    id: 'stress',
    symbol: '◇',
    title: 'Stress Management',
    description:
      'Practical strategies for managing stress and feeling overwhelmed.',
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
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View
          pointerEvents="none"
          style={styles.headerDecorCircle}
        />

        <View
          pointerEvents="none"
          style={styles.headerDecorCircle2}
        />

        <Text style={styles.headerLabel}>
          WELLBEING SUPPORT
        </Text>

        <Text style={styles.headerTitle}>
          Resource{'\n'}
          <Text style={styles.headerTitleItalic}>
            Hub
          </Text>
        </Text>

        <Text style={styles.headerDescription}>
          Find trusted support, practical guidance and wellbeing resources.
        </Text>
      </View>

      {/* Resources */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>
          Browse resources
        </Text>

        <View style={styles.resourceList}>
          {resources.map((resource) => (
            <Pressable
              key={resource.id}
              onPress={() => openResource(resource.id)}
              style={({ pressed }) => [
                styles.resourceCard,
                resource.emergency && styles.emergencyCard,
                pressed && styles.pressedCard,
              ]}
            >
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  resource.emergency &&
                    styles.emergencyIconContainer,
                ]}
              >
                <Text
                  style={[
                    styles.icon,
                    resource.emergency &&
                      styles.emergencyIcon,
                  ]}
                >
                  {resource.symbol}
                </Text>
              </View>

              {/* Information */}
              <View style={styles.resourceInformation}>
                <Text
                  style={[
                    styles.resourceTitle,
                    resource.emergency &&
                      styles.emergencyTitle,
                  ]}
                >
                  {resource.title}
                </Text>

                <Text style={styles.resourceDescription}>
                  {resource.description}
                </Text>
              </View>

              {/* Arrow */}
              <Text style={styles.arrow}>
                ›
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Emergency reminder */}
        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>
            Need urgent help?
          </Text>

          <Text style={styles.supportDescription}>
            If you or someone else may be in immediate danger,
            use the Emergency Contacts section above to find
            urgent support.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ink,
  },

  /* HEADER */

  header: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },

  headerDecorCircle: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.coral,
    opacity: 0.18,
  },

  headerDecorCircle2: {
    position: 'absolute',
    bottom: -20,
    left: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    opacity: 0.22,
  },

  headerLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: '#A09890',
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: colors.paper,
    lineHeight: 36,
  },

  headerTitleItalic: {
    fontFamily: fonts.serifItalic,
    color: colors.coralMid,
  },

  headerDescription: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: '#D4C8C0',
    lineHeight: 21,
    marginTop: 12,
    maxWidth: 320,
  },

  /* CONTENT */

  scroll: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 40,
  },

  sectionLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },

  resourceList: {
    gap: spacing.sm + 2,
  },

  /* RESOURCE CARDS */

  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.md,
  },

  emergencyCard: {
    borderColor: colors.coral,
  },

  pressedCard: {
    opacity: 0.65,
  },

  /* ICON */

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  icon: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 20,
    color: colors.ink2,
  },

  emergencyIconContainer: {
    backgroundColor: 'rgba(220, 100, 90, 0.12)',
  },

  emergencyIcon: {
    color: colors.coral,
  },

  /* RESOURCE TEXT */

  resourceInformation: {
    flex: 1,
  },

  resourceTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink2,
    marginBottom: 4,
  },

  emergencyTitle: {
    color: colors.coral,
  },

  resourceDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },

  arrow: {
    fontFamily: fonts.sans,
    fontSize: 26,
    color: colors.mutedLight,
    marginLeft: spacing.sm,
  },

  /* SUPPORT BOX */

  supportBox: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.ink,
  },

  supportTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.paper,
    marginBottom: 6,
  },

  supportDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: '#D4C8C0',
    lineHeight: 20,
  },
});