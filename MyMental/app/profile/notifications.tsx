import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { colors, fonts, spacing, radius } from '../../src/constants/theme';
import { auth } from '../../src/firebase/auth';
import { db } from '../../src/firebase/config';
import ScreenHeader from '../../src/components/ScreenHeader';
import SettingsToggleRow from '../../src/components/SettingsToggleRow';

type NotificationPrefs = {
  dailyReminder: boolean;
  streakReminder: boolean;
  weeklyInsights: boolean;
  resourceUpdates: boolean;
};

const DEFAULT_PREFS: NotificationPrefs = {
  dailyReminder: true,
  streakReminder: true,
  weeklyInsights: false,
  resourceUpdates: false,
};

export default function NotificationsScreen() {
  const user = auth.currentUser;
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPrefs = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const stored = snap.data()?.preferences?.notifications;
        if (isMounted && stored) {
          setPrefs({ ...DEFAULT_PREFS, ...stored });
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPrefs();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const updatePref = async (key: keyof NotificationPrefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);

    if (!user) return;
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        { preferences: { notifications: next } },
        { merge: true },
      );
    } catch (error) {
      console.error(error);
      // Revert on failure so the UI reflects what's actually saved
      setPrefs(prefs);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Notification Settings" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.coral} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Notification Settings" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Journaling</Text>
        <View style={styles.card}>
          <SettingsToggleRow
            label="Daily Reminder"
            description="A gentle nudge to journal each day"
            value={prefs.dailyReminder}
            onValueChange={(v) => updatePref('dailyReminder', v)}
          />
          <SettingsToggleRow
            label="Streak Reminder"
            description="Alerts before your streak resets"
            value={prefs.streakReminder}
            onValueChange={(v) => updatePref('streakReminder', v)}
            isLast
          />
        </View>

        <Text style={styles.sectionLabel}>Updates</Text>
        <View style={styles.card}>
          <SettingsToggleRow
            label="Weekly Insights"
            description="A summary of your mood trends"
            value={prefs.weeklyInsights}
            onValueChange={(v) => updatePref('weeklyInsights', v)}
          />
          <SettingsToggleRow
            label="Resource Updates"
            description="New articles and support resources"
            value={prefs.resourceUpdates}
            onValueChange={(v) => updatePref('resourceUpdates', v)}
            isLast
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  sectionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
    marginTop: spacing.md,
    marginBottom: -spacing.xs,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
