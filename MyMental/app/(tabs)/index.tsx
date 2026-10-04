import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  router,
  useFocusEffect,
} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import {
  colors,
  fonts,
  spacing,
  radius,
} from '../../src/constants/theme';

import { scoreForMood } from '../../src/constants/moodScore';

import { auth } from '../../src/firebase/auth';

import {
  useJournalEntries,
  JournalEntry,
} from '../../src/hooks/useJournalEntries';

import MoodRing from '../../src/components/MoodRing';
import TrackingWidgets from '../../src/components/trackingWidgets';
import { useTrackingOptions } from '../../src/hooks/useTrackingOptions';
import MoodCalendar from '../../src/components/MoodCalendar';

const DAY_MS = 24 * 60 * 60 * 1000;

function average(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  return (
    values.reduce(
      (sum, value) => sum + value,
      0,
    ) / values.length
  );
}
function useDashboardStats(
  entries: JournalEntry[],
  now: number,
) {
  return useMemo(() => {
    const thisWeek = entries.filter(
      (entry) =>
        now -
          new Date(entry.createdAt).getTime() <=
        7 * DAY_MS,
    );

    const lastWeek = entries.filter((entry) => {
      const diff =
        now -
        new Date(entry.createdAt).getTime();

      return (
        diff > 7 * DAY_MS &&
        diff <= 14 * DAY_MS
      );
    });

    const today = new Date(now);

    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    const hasEntryToday = entries.some(
      (entry) => {
        const entryDate = new Date(
          entry.createdAt,
        );

        return (
          entryDate.getFullYear() === todayYear &&
          entryDate.getMonth() === todayMonth &&
          entryDate.getDate() === todayDate
        );
      },
    );

    const moodScores = (
      list: JournalEntry[],
    ) =>
      list
        .map((entry) =>
          scoreForMood(entry.mood),
        )
        .filter(
          (score): score is number =>
            score !== null,
        );

    const thisWeekMoodAvg = average(
      moodScores(thisWeek),
    );

    const lastWeekMoodAvg = average(
      moodScores(lastWeek),
    );

    const overallMoodAvg = average(
      moodScores(entries),
    );

    const displayedMood =
      thisWeekMoodAvg ?? overallMoodAvg;

    let moodTrend:
      | 'up'
      | 'down'
      | 'flat'
      | null = null;

    if (
      thisWeekMoodAvg !== null &&
      lastWeekMoodAvg !== null
    ) {
      const diff =
        thisWeekMoodAvg -
        lastWeekMoodAvg;

      moodTrend =
        diff > 0.3
          ? 'up'
          : diff < -0.3
            ? 'down'
            : 'flat';
    }

    return {
      hasAnyEntries: entries.length > 0,
      hasEntryToday,
      totalEntries: entries.length,
      displayedMood,
      moodTrend,
      checkins: thisWeek.length,
    };
  }, [entries, now]);
}
// Ticks `now` on a fixed interval so week boundaries stay
// fresh without calling Date.now() during render.
function useNow(
  intervalMs = 60_000,
): number {
  const [now, setNow] = useState(
    () => Date.now(),
  );

  useEffect(() => {
    const id = setInterval(
      () => setNow(Date.now()),
      intervalMs,
    );

    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

export default function HomeScreen() {
  const user = auth.currentUser;

  const firstName = (
    user?.displayName ?? 'there'
  ).split(' ')[0];

  const {
    entries,
    loading,
    error,
    refresh,
  } = useJournalEntries();

  // Refresh the dashboard whenever the screen
  // becomes active again.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const trackingOptions = useTrackingOptions();

  const now = useNow();

  const stats = useDashboardStats(
    entries,
    now,
  );

  const [refreshing, setRefreshing] =
    useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    await refresh();

    setRefreshing(false);
  };

  // Derived: full-screen loader only on the very first
  // load with no data yet.
  const showFullScreenLoader =
    loading &&
    entries.length === 0 &&
    !refreshing;

  const hour = new Date().getHours();

  const timeGreeting =
    hour < 12
      ? 'morning'
      : hour < 18
        ? 'afternoon'
        : 'evening';

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      {/* Header (fixed, matches Journal) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            MY MENTAL
          </Text>

          <Text style={styles.headerTitle}>
            Dashboard
          </Text>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
          accessibilityLabel="Open profile"
        >
          <Ionicons
            name="person"
            size={22}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* Greeting */}
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>
            Good {timeGreeting},{' '}
            {firstName}
          </Text>

          <Text
            style={
              styles.greetingSubtitle
            }
          >
            How are you feeling today?
          </Text>
        </View>

        {showFullScreenLoader ? (
          <View
            style={styles.loadingBlock}
          >
            <ActivityIndicator
              color={colors.teal}
            />
          </View>
        ) : error ? (
          <View
            style={styles.errorCard}
          >
            <Text
              style={styles.errorText}
            >
              {error}
            </Text>

            <TouchableOpacity
              onPress={refresh}
              style={styles.errorRetry}
            >
              <Text
                style={
                  styles.errorRetryText
                }
              >
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Mood Calendar */}
            <MoodCalendar
              entries={entries}
              onDayPress={(date) => {
                router.push({
                  pathname: '/journal',
                  params: { date },
                });
              }}
            />

            {/* Average Mood */}
            <View
              style={styles.moodCard}
            >
              <View
                style={
                  styles.moodCardLeft
                }
              >
                <View
                  style={
                    styles.moodLabelRow
                  }
                >
                  <Ionicons
                    name="happy-outline"
                    size={16}
                    color={colors.teal}
                  />

                  <Text
                    style={
                      styles.cardLabel
                    }
                  >
                    Average Mood
                  </Text>
                </View>

                <Text
                  style={styles.moodValue}
                >
                  {stats.displayedMood !==
                  null
                    ? `${stats.displayedMood.toFixed(
                        1,
                      )}/10`
                    : '—'}
                </Text>

                {stats.hasAnyEntries ? (
                  stats.moodTrend ? (
                    <View
                      style={
                        styles.trendRow
                      }
                    >
                      <Ionicons
                        name={
                          stats.moodTrend ===
                          'up'
                            ? 'arrow-up'
                            : stats.moodTrend ===
                                'down'
                              ? 'arrow-down'
                              : 'remove'
                        }
                        size={14}
                        color={
                          stats.moodTrend ===
                          'up'
                            ? colors.teal
                            : stats.moodTrend ===
                                'down'
                              ? colors.coral
                              : colors.muted
                        }
                      />

                      <Text
                        style={[
                          styles.trendText,
                          {
                            color:
                              stats.moodTrend ===
                              'up'
                                ? colors.teal
                                : stats.moodTrend ===
                                    'down'
                                  ? colors.coral
                                  : colors.muted,
                          },
                        ]}
                      >
                        {stats.moodTrend ===
                        'up'
                          ? 'Improved from last week'
                          : stats.moodTrend ===
                              'down'
                            ? 'Down from last week'
                            : 'Steady from last week'}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={
                        styles.moodHint
                      }
                    >
                      Log a few more entries
                      to see a trend
                    </Text>
                  )
                ) : (
                  <Text
                    style={
                      styles.moodHint
                    }
                  >
                    Start journaling to see
                    your mood trends
                  </Text>
                )}
              </View>

              <MoodRing
                value={
                  stats.hasAnyEntries
                    ? stats.displayedMood
                    : null
                }
              />
            </View>
            

                {/* Daily Reflection */}
<View style={styles.reflectionCard}>
  <View style={styles.reflectionLeft}>
    <Text style={styles.reflectionTitle}>
      Daily Reflection
    </Text>

    {stats.hasEntryToday ? (
      <>
        <Text style={styles.reflectionSubtitle}>
          You&apos;ve logged your journal for today.
        </Text>

        <Text style={styles.reflectionCount}>
          {stats.totalEntries}{' '}
          {stats.totalEntries === 1
            ? 'journal'
            : 'journals'} logged
        </Text>

        <TouchableOpacity
          style={styles.reflectionButton}
          onPress={() =>
            router.navigate('/journal')
          }
          activeOpacity={0.85}
        >
          <Text style={styles.reflectionButtonText}>
            View Journal
          </Text>
        </TouchableOpacity>
      </>
    ) : (
      <>
        <Text style={styles.reflectionSubtitle}>
          You haven&apos;t logged a journal today.
        </Text>

        <Text style={styles.reflectionCount}>
          {stats.totalEntries}{' '}
          {stats.totalEntries === 1
            ? 'journal'
            : 'journals'} logged
        </Text>

        <TouchableOpacity
          style={styles.reflectionButton}
          onPress={() =>
            router.navigate('/journal')
          }
          activeOpacity={0.85}
        >
          <Text style={styles.reflectionButtonText}>
            Log Today&apos;s Journal
          </Text>
        </TouchableOpacity>
      </>
    )}
  </View>

  <View style={styles.reflectionIllustration}>
    <Ionicons
      name={
        stats.hasEntryToday
          ? 'checkmark-circle-outline'
          : 'book-outline'
      }
      size={30}
      color={colors.teal}
    />
  </View>
</View>

            {/* Tracking widgets (selected options, excl. mood + journal) */}
            <TrackingWidgets
              entries={entries}
              selected={trackingOptions}
              now={now}
              checkins={stats.checkins}
            />
          </>
        )}


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  header: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  eyebrow: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.muted,
    marginBottom: spacing.xs,
  },

  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: colors.ink,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
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





  reflectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },

  reflectionLeft: {
    flex: 1,
    gap: spacing.xs,
  },

  reflectionCount: {
  fontFamily: fonts.sansMedium,
  fontSize: 12,
  color: colors.muted,
  marginBottom: spacing.xs,
},
  
  reflectionTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.ink,
    padding: 4,
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