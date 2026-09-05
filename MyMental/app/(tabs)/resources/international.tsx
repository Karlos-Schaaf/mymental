import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import ScreenHeader from '../../../src/components/ScreenHeader';

export default function InternationalSupportScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="International Support"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="globe-outline"
              size={28}
              color={colors.accent}
            />
          </View>

          <Text style={styles.heroTitle}>
            International Student Support
          </Text>

          <Text style={styles.heroDescription}>
            Find guidance and support for studying, living and adjusting to
            life in New Zealand.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>AUT support</Text>

        <View style={styles.listCard}>
          <SupportItem
            icon="school-outline"
            title="International Student Support"
            description="Find AUT guidance for international students, studying and settling into New Zealand."
            onPress={() =>
              Linking.openURL(
                'https://www.aut.ac.nz/international/international-student-support'
              )
            }
          />

          <SupportItem
            icon="people-outline"
            title="Student Hub"
            description="Get help with general student questions and finding the right AUT service."
            onPress={() =>
              Linking.openURL(
                'https://www.aut.ac.nz/student-life/support-services/student-hub'
              )
            }
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>
          Helpful guidance
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="home-outline"
              size={20}
              color={colors.accent}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Settling into New Zealand
            </Text>

            <Text style={styles.infoDescription}>
              Moving to a new country can involve changes in culture,
              routines, language and social connections. Asking for support
              early can make the adjustment easier.
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="book-outline"
              size={20}
              color={colors.accent}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Study support
            </Text>

            <Text style={styles.infoDescription}>
              If you are finding study difficult, AUT support services can
              help you identify academic, wellbeing or practical support.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.wellbeingCard}
          activeOpacity={0.7}
          onPress={() => router.push('/resources/aut-support')}
        >
          <View style={styles.wellbeingIcon}>
            <Ionicons
              name="heart-outline"
              size={21}
              color={colors.teal}
            />
          </View>

          <View style={styles.wellbeingContent}>
            <Text style={styles.wellbeingTitle}>
              Need wellbeing support?
            </Text>

            <Text style={styles.wellbeingDescription}>
              Find counselling, health and wellbeing support through AUT.
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

function SupportItem({
  icon,
  title,
  description,
  onPress,
  isLast,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        !isLast && styles.itemBorder,
      ]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.itemIcon}>
        <Ionicons
          name={icon}
          size={22}
          color={colors.accent}
        />
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDescription}>
          {description}
        </Text>
      </View>

      <Ionicons
        name="open-outline"
        size={18}
        color={colors.mutedLight}
      />
    </TouchableOpacity>
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
    backgroundColor: colors.accentLight,
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
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },

  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  itemContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  itemTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
  },

  itemDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    marginTop: spacing.xs,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.accentLight,
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

  wellbeingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tealLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  wellbeingIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  wellbeingContent: {
    flex: 1,
  },

  wellbeingTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  wellbeingDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    marginTop: spacing.xs,
  },
});