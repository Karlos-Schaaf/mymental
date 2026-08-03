import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, spacing, radius } from '../../src/constants/theme';
import ScreenHeader from '../../src/components/ScreenHeader';

const LINKS = [
  {
    label: 'Privacy Policy',
    url: 'https://mymental.app/privacy',
    icon: 'document-text-outline' as const,
  },
  {
    label: 'Terms of Service',
    url: 'https://mymental.app/terms',
    icon: 'document-outline' as const,
  },
  {
    label: 'Rate MyMental',
    url: 'https://mymental.app/rate',
    icon: 'star-outline' as const,
  },
];

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="About MyMental" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf-outline" size={32} color={colors.teal} />
          </View>
          <Text style={styles.appName}>MyMental</Text>
          <Text style={styles.version}>Version {version}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.missionText}>
            MyMental is a space to check in with yourself. We built it to
            make daily reflection simple, private, and a little more
            beautiful — helping you notice patterns in your mood over time
            and find resources when you need them.
          </Text>
        </View>

        <View style={styles.card}>
          {LINKS.map((link, index) => (
            <TouchableOpacity
              key={link.label}
              style={[
                styles.linkRow,
                index !== LINKS.length - 1 && styles.linkRowBorder,
              ]}
              onPress={() => Linking.openURL(link.url)}
              activeOpacity={0.6}
            >
              <View style={styles.linkLeft}>
                <Ionicons name={link.icon} size={20} color={colors.ink2} />
                <Text style={styles.linkLabel}>{link.label}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.mutedLight}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footer}>Made with care, for your wellbeing.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  logoSection: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  appName: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.ink,
  },
  version: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  missionText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink2,
    lineHeight: 21,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  linkRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  linkLabel: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
  },
  footer: {
    textAlign: 'center',
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedLight,
    marginTop: spacing.sm,
  },
});
