import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Timestamp } from 'firebase/firestore';

import { colors, fonts, spacing, radius } from '../../src/constants/theme';
import { scoreForMood } from '../../src/constants/moodScore';
import { auth } from '../../src/firebase/auth';
import { Entry } from '../../src/types/entry';
import { useJournalEntries } from '../../src/hooks/useJournalEntries';
import MoodRing from '../../src/components/MoodRing';

const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(value: Timestamp | Date): Date {
  return value instanceof Date ? value : value.toDate();
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function stressBucket(value: number) {
  if (value <= 3) return { label: 'Low', color: colors.teal };
  if (value <= 6) return { label: 'Moderate', color: colors.amber };
  return { label: 'High', color: colors.coral };
}

function useDashboardStats(entries: Entry[] | null) {
  return useMemo(() => {
    if (!entries) return null;

    const now = Date.now();
    const thisWeek = entries.filter(
      (e) => now - toDate(e.createdAt).getTime() <= 7 * DAY_MS,
    );
    const lastWeek = entries.filter((e) => {
      const diff = now - toDate(e.createdAt).getTime();
      return diff > 7 * DAY_MS && diff <= 14 * DAY_MS;
    });

    const moodScores = (list: Entry[]) =>
      list
        .map((e) => scoreForMood(e.mood))
        .filter((s): s is number => s !== null);

    const thisWeekMoodAvg = average(moodScores(thisWeek));
    const lastWeekMoodAvg = average(moodScores(lastWeek));
    const overallMoodAvg = average(moodScores(entries));
    const displayedMood = thisWeekMoodAvg ?? overallMoodAvg;

    let moodTrend: 'up' | 'down' | 'flat' | null = null;
    if (thisWeekMoodAvg !== null && lastWeekMoodAvg !== null) {
      const diff = thisWeekMoodAvg - lastWeekMoodAvg;
      moodTrend = diff > 0.3 ? 'up' : diff < -0.3 ? 'down' : 'flat';
    }

    const stressValues = (list: Entry[]) =>
      list
        .map((e) => e.stress)
        .filter((s): s is number => typeof s === 'number');

    const stressValue =
      average(stressValues(thisWeek)) ?? average(stressValues(entries));

    return {
      hasAnyEntries: entries.length > 0,
      displayedMood,
      moodTrend,
      checkins: thisWeek.length,
      stressValue,
    };
  }, [entries]);
}

export default function HomeScreen() {
  const user = auth.currentUser;
  const firstName = (user?.displayName ?? 'there').split(' ')[0];

  const { entries, loading, refreshing, error, refresh } =
    useJournalEntries();
  const stats = useDashboardStats(entries);

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => Alert.alert('Menu', 'Coming soon.')}
            hitSlop={8}
          >
            <Ionicons name="menu-outline" size={26} color={colors.ink} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Dashboard</Text>

          <TouchableOpacity
            onPress={() => router.push('/profile/notifications')}
            hitSlop={8}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.ink}
            />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>
            Good {timeGreeting}, {firstName} 
          </Text>
          <Text style={styles.greetingSubtitle}>How are you feeling today?</Text>
        </View>

        {loading ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator color={colors.teal} />
          </View>
        ) : error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={refresh} style={styles.errorRetry}>
              <Text style={styles.errorRetryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Average Mood */}
            <View style={styles.moodCard}>
              <View style={styles.moodCardLeft}>
                <View style={styles.moodLabelRow}>
                  <Ionicons
                    name="happy-outline"
                    size={16}
                    color={colors.teal}
                  />
                  <Text style={styles.cardLabel}>Average Mood</Text>
                </View>

                <Text style={styles.moodValue}>
                  {stats?.displayedMood !== null && stats?.displayedMood !== undefined
                    ? `${stats.displayedMood.toFixed(1)}/10`
                    : '—'}
                </Text>

                {stats?.hasAnyEntries ? (
                  stats.moodTrend ? (
                    <View style={styles.trendRow}>
                      <Ionicons
                        name={
                          stats.moodTrend === 'up'
                            ? 'arrow-up'
                            : stats.moodTrend === 'down'
                              ? 'arrow-down'
                              : 'remove'
                        }
                        size={14}
                        color={
                          stats.moodTrend === 'up'
                            ? colors.teal
                            : stats.moodTrend === 'down'
                              ? colors.coral
                              : colors.muted
                        }
                      />
                      <Text
                        style={[
                          styles.trendText,
                          {
                            color:
                              stats.moodTrend === 'up'
                                ? colors.teal
                                : stats.moodTrend === 'down'
                                  ? colors.coral
                                  : colors.muted,
                          },
                        ]}
                      >
                        {stats.moodTrend === 'up'
                          ? 'Improved from last week'
                          : stats.moodTrend === 'down'
                            ? 'Down from last week'
                            : 'Steady from last week'}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.moodHint}>
                      Log a few more entries to see a trend
                    </Text>
                  )
                ) : (
                  <Text style={styles.moodHint}>
                    Start journaling to see your mood trends
                  </Text>
                )}
              </View>

              <MoodRing
                value={stats?.hasAnyEntries ? stats.displayedMood : null}
              />
            </View>

            {/* Stress + Check-ins */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Ionicons
                  name="trending-down"
                  size={18}
                  color={
                    stats?.stressValue != null
                      ? stressBucket(stats.stressValue).color
                      : colors.mutedLight
                  }
                />
                <Text style={styles.cardLabel}>Stress Level</Text>
                <Text style={styles.statValue}>
                  {stats?.stressValue != null
                    ? `${stats.stressValue.toFixed(1)}/10`
                    : '—'}
                </Text>
                <Text
                  style={[
                    styles.statSubtitle,
                    stats?.stressValue != null && {
                      color: stressBucket(stats.stressValue).color,
                      fontFamily: fonts.sansMedium,
                    },
                  ]}
                >
                  {stats?.stressValue != null
                    ? stressBucket(stats.stressValue).label
                    : 'Not tracked yet'}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="calendar-outline" size={18} color={colors.teal} />
                <Text style={styles.cardLabel}>Check-ins</Text>
                <Text style={styles.statValue}>{stats?.checkins ?? 0}</Text>
                <Text style={styles.statSubtitle}>This week</Text>
              </View>
            </View>
          </>
        )}

        {/* Daily Reflection */}
        <View style={styles.reflectionCard}>
          <View style={styles.reflectionLeft}>
            <Text style={styles.reflectionTitle}>Daily Reflection</Text>
            <Text style={styles.reflectionSubtitle}>
              {stats?.hasAnyEntries
                ? 'Take a moment for yourself.'
                : 'Write your first entry to get started.'}
            </Text>
            <TouchableOpacity
              style={styles.reflectionButton}
              onPress={() => router.navigate('/journal')}
              activeOpacity={0.85}
            >
              <Text style={styles.reflectionButtonText}>Start Journaling</Text>
            </TouchableOpacity>
          </View>

          {/* Placeholder for the Figma illustration — swap for an <Image>
              once the asset is added to src/assets */}
          <View style={styles.reflectionIllustration}>
            <Ionicons name="book-outline" size={30} color={colors.teal} />
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionLabel}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <QuickAction
            icon="book-outline"
            label="Journal"
            onPress={() => router.push('/journal')}
          />
          <QuickAction
            icon="happy-outline"
            label="Mood Check"
            onPress={() => router.push('/journal')}
          />
          <QuickAction
            icon="bulb-outline"
            label="AI Insights"
            onPress={() => router.push('/insights')}
          />
          <QuickAction
            icon="heart-outline"
            label="Resources"
            onPress={() => router.push('/resources')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.quickActionIcon}>
        <Ionicons name={icon} size={22} color={colors.teal} />
      </View>
      <Text style={styles.quickActionLabel} numberOfLines={1}>
        {label}
      </Text>
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
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    color: colors.ink,
  },
  greetingBlock: {
    gap: spacing.xs,
  },
  greeting: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 22,
    color: colors.ink,
  },
  greetingSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  loadingBlock: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  errorCard: {
    backgroundColor: colors.coralLight,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  errorText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.coral,
  },
  errorRetry: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  errorRetryText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.coral,
    textDecorationLine: 'underline',
  },
  moodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  moodCardLeft: {
    flex: 1,
    gap: spacing.xs,
  },
  moodLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
  },
  moodValue: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 30,
    color: colors.ink,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  trendText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
  },
  moodHint: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedLight,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  statValue: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 22,
    color: colors.ink,
  },
  statSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  reflectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.paperDim,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  reflectionLeft: {
    flex: 1,
    gap: spacing.xs,
  },
  reflectionTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.ink,
  },
  reflectionSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  reflectionButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.teal,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  reflectionButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.white,
  },
  reflectionIllustration: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing.xs,
    width: 72,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink2,
    textAlign: 'center',
  },
});
