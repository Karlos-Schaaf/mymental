import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useEntriesStore } from '../../store/entriesStore';
import { colors, fonts, spacing, radius, moods } from '../src/constants/theme';

export default function InsightsScreen() {
  const { entries } = useEntriesStore();

  if (entries.length < 3) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View style={styles.headerDecor} />
          <Text style={styles.headerTitle}>Insights</Text>
          <Text style={styles.headerSub}>Patterns in your reflections</Text>
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Keep writing</Text>
          <Text style={styles.emptyBody}>
            After a few more entries, you'll start to see patterns in your mood,
            energy, and themes.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mood frequency
  const moodCount: Record<string, number> = {};
  entries.forEach((e) => {
    if (e.mood) moodCount[e.mood] = (moodCount[e.mood] ?? 0) + 1;
  });
  const topMoods = Object.entries(moodCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Average energy
  const validEnergy = entries.filter((e) => e.energy > 0);
  const avgEnergy =
    validEnergy.length > 0
      ? validEnergy.reduce((s, e) => s + e.energy, 0) / validEnergy.length
      : 0;

  // Last 7 days energy
  const last7: { label: string; energy: number | null }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toDateString();
    const dayEntry = entries.find(
      (e) => new Date(e.createdAt).toDateString() === dateStr
    );
    last7.push({
      label: d.toLocaleDateString('en-NZ', { weekday: 'short' }),
      energy: dayEntry?.energy ?? null,
    });
  }

  const totalEntries = entries.length;
  const thisWeek = entries.filter((e) => {
    const d = new Date(e.createdAt);
    const now = new Date();
    return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerDecor} />
        <Text style={styles.headerTitle}>Insights</Text>
        <Text style={styles.headerSub}>Patterns in your reflections</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statName}>Total entries</Text>
            <Text style={styles.statNum}>{totalEntries}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statName}>This week</Text>
            <Text style={[styles.statNum, { color: colors.teal }]}>{thisWeek}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statName}>Avg energy</Text>
            <Text style={[styles.statNum, { color: colors.coral }]}>
              {avgEnergy.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Energy this week */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Energy — last 7 days</Text>
          <View style={styles.barChart}>
            {last7.map((day, i) => (
              <View key={i} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: day.energy ? `${day.energy * 10}%` : '0%',
                        backgroundColor: day.energy ? colors.coral : colors.border,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{day.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mood breakdown */}
        {topMoods.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Mood breakdown</Text>
            <View style={styles.moodList}>
              {topMoods.map(([label, count]) => {
                const meta = moods.find((m) => m.label === label);
                const pct = Math.round((count / totalEntries) * 100);
                return (
                  <View key={label} style={styles.moodRow}>
                    <View style={[styles.moodDot, { backgroundColor: meta?.color ?? colors.muted }]} />
                    <Text style={styles.moodLabel}>{label}</Text>
                    <View style={styles.moodTrack}>
                      <View
                        style={[
                          styles.moodBar,
                          {
                            width: `${pct}%`,
                            backgroundColor: meta?.color ?? colors.muted,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.moodPct}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  header: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecor: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.teal,
    opacity: 0.18,
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: colors.paper,
  },
  headerSub: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: '#A09890',
    marginTop: 4,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 48,
    gap: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statName: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.mutedLight,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
    textAlign: 'center',
  },
  statNum: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 22,
    color: colors.ink,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  cardLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: spacing.lg,
  },
  barChart: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-end',
    height: 100,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    height: '100%',
  },
  barTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.paperDim,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.mutedLight,
  },
  moodList: {
    gap: spacing.md,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moodLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink2,
    width: 72,
  },
  moodTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.paperDim,
    borderRadius: 3,
    overflow: 'hidden',
  },
  moodBar: {
    height: '100%',
    borderRadius: 3,
  },
  moodPct: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    width: 32,
    textAlign: 'right',
  },
  emptyWrap: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.ink,
    marginBottom: 10,
  },
  emptyBody: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
