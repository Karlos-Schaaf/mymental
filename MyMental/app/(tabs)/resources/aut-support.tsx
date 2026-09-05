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

export default function AUTSupportScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="AUT Wellbeing"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="heart-outline"
              size={28}
              color={colors.teal}
            />
          </View>

          <Text style={styles.heroTitle}>
            Wellbeing Support
          </Text>

          <Text style={styles.heroDescription}>
            Find counselling, health and wellbeing support available to AUT
            students.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Available support
        </Text>

        <View style={styles.listCard}>
          <SupportItem
            icon="chatbubbles-outline"
            title="Counselling & Mental Health"
            description="Talk with trained professionals and access mental health support."
            onPress={() =>
              openLink(
                'https://www.aut.ac.nz/student-life/student-health-and-wellbeing'
              )
            }
          />

          <SupportItem
            icon="medical-outline"
            title="Student Medical Centre"
            description="Access health and medical services through AUT."
            onPress={() =>
              openLink(
                'https://www.aut.ac.nz/student-life/student-health-and-wellbeing'
              )
            }
          />

          <SupportItem
            icon="people-outline"
            title="Student Support"
            description="Find services designed to support you throughout your studies."
            onPress={() =>
              openLink(
                'https://www.aut.ac.nz/student-life/support-services'
              )
            }
            isLast
          />
        </View>

        <TouchableOpacity
          style={styles.emergencyCard}
          activeOpacity={0.7}
          onPress={() => router.push('/resources/emergency')}
        >
          <View style={styles.emergencyIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={22}
              color={colors.coral}
            />
          </View>

          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>
              Looking for urgent help?
            </Text>

            <Text style={styles.emergencyDescription}>
              Open Emergency Contacts for immediate support.
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
          color={colors.teal}
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
    backgroundColor: colors.tealLight,
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

  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.coralLight,
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
    marginTop: spacing.xs,
  },
});