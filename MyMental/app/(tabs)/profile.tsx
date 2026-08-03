import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';

import { colors, fonts, spacing, radius } from '../../src/constants/theme';
import { auth } from '../../src/firebase/auth';
import ScreenHeader from '../../src/components/ScreenHeader';

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  isLast?: boolean;
};

function MenuItem({ icon, label, onPress, isLast }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, !isLast && styles.menuItemBorder]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={22} color={colors.ink2} />
        <Text style={styles.menuItemLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const user = auth.currentUser;
  const displayName = user?.displayName ?? 'Your Name';
  const email = user?.email ?? '';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to log out. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Profile" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.profileEmail} numberOfLines={1}>
              {email}
            </Text>
          </View>
        </View>

        {/* Menu list */}
        <View style={styles.menuCard}>
          <MenuItem
            icon="person-outline"
            label="Personal Information"
            onPress={() => router.push('/profile/personal-information')}
          />
          <MenuItem
            icon="lock-closed-outline"
            label="Privacy & Security"
            onPress={() => router.push('/profile/privacy-security')}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notification Settings"
            onPress={() => router.push('/profile/notifications')}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => router.push('/profile/help-support')}
          />
          <MenuItem
            icon="information-circle-outline"
            label="About MyMental"
            onPress={() => router.push('/profile/about')}
            isLast
          />
        </View>

        {/* Log out */}
        <TouchableOpacity
          style={styles.logOutButton}
          onPress={handleLogOut}
          activeOpacity={0.7}
        >
          <Text style={styles.logOutText}>Log Out</Text>
        </TouchableOpacity>
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
    gap: spacing.xl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tealLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 22,
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 17,
    color: colors.ink,
  },
  profileEmail: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuItemLabel: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
  },
  logOutButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  logOutText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.coral,
  },
});
