import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import { useJournalEntries } from '../../src/hooks/useJournalEntries';
import { useTrackingOptions } from '../../src/hooks/useTrackingOptions';
import { scoreForMood } from '../../src/constants/moodScore';
import { colors, fonts, spacing, radius } from '../../src/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = Math.max(0, SCREEN_WIDTH - spacing.lg * 2 - spacing.lg * 2 - 2);
const CHART_HEIGHT = 160;
const DAY_MS = 24 * 60 * 60 * 1000;

// ── Confidence thresholds ─────────────────────────────────────────────────────
// Patterns need a minimum amount of data before we say anything.
const PATTERN_WINDOW_DAYS = 90; // drivers + weekday patterns look back this far
const MIN_PAIRS = 6;            // entries with both mood and a metric
const ESTABLISHED_PAIRS = 12;   // below this a driver is labelled "Emerging"
const MIN_LINK = 0.25;          // |correlation| needed to call something a driver
const STRONG_LINK = 0.5;

// ── Types ─────────────────────────────────────────────────────────────────────

type TimeFilter = 'week' | 'month' | '3months' | '6months' | 'year';

type Entry = {
  id: string;
  moodKey: string;
  mood: number; // 1-5
  createdAt: Date;
  metrics: Record<string, number>;
};

type ChartPoint = { label: string; score: number | null };

type MetricDef = {
  key: string;      // field name on the entry
  option: string;   // id used in Journaling Settings
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  high: string;     // phrase for the "more of it" group
  low: string;      // phrase for the "less of it" group
};

type Driver = {
  metric: MetricDef;
  r: number;
  n: number;
  highMood: number;
  lowMood: number;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const MOOD_SCORE: Record<string, number> = {
  very_bad: 1, bad: 2, neutral: 3, good: 4, great: 5,
};

const MOOD_COLOR: Record<string, string> = {
  great: colors.teal,
  good: '#6BBF8E',
  neutral: colors.neutral,
  bad: colors.coralMid,
  very_bad: colors.coral,
};

const MOOD_LABEL: Record<string, string> = {
  great: 'Great', good: 'Good', neutral: 'Neutral', bad: 'Bad', very_bad: 'Very Bad',
};

const MOOD_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  very_bad: 'sad',
  bad: 'sad-outline',
  neutral: 'remove-circle-outline',
  good: 'happy-outline',
  great: 'happy',
};

const MOOD_ORDER = ['very_bad', 'bad', 'neutral', 'good', 'great'] as const;

const PERIOD_SHORT: Record<TimeFilter, string> = {
  week: 'Last 7 days',
  month: 'This month',
  '3months': 'Last 3 months',
  '6months': 'Last 6 months',
  year: 'Last year',
};

const FILTER_LABELS: { key: TimeFilter; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: '3months', label: '3M' },
  { key: '6months', label: '6M' },
  { key: 'year', label: '1Y' },
];

const PERIOD_PHRASE: Record<TimeFilter, string> = {
  week: 'over the last 7 days',
  month: 'so far this month',
  '3months': 'over the last 3 months',
  '6months': 'over the last 6 months',
  year: 'over the last year',
};

// NOTE: sleep is stored as `sleepHours` but selected as `sleep` in settings.
const METRICS: MetricDef[] = [
  { key: 'energy', option: 'energy', label: 'Energy', icon: 'flash-outline',
    high: 'higher-energy days', low: 'lower-energy days' },
  { key: 'stress', option: 'stress', label: 'Stress', icon: 'pulse-outline',
    high: 'higher-stress days', low: 'calmer days' },
  { key: 'sleepHours', option: 'sleep', label: 'Sleep', icon: 'moon-outline',
    high: 'days you slept more', low: 'days you slept less' },
  { key: 'productivity', option: 'productivity', label: 'Productivity', icon: 'checkmark-done-outline',
    high: 'more productive days', low: 'less productive days' },
  { key: 'physicalActivity', option: 'physicalActivity', label: 'Physical activity', icon: 'walk-outline',
    high: 'more active days', low: 'less active days' },
  { key: 'socialInteraction', option: 'socialInteraction', label: 'Social time', icon: 'people-outline',
    high: 'more social days', low: 'quieter days' },
  { key: 'screenTime', option: 'screenTime', label: 'Screen time', icon: 'phone-portrait-outline',
    high: 'high screen-time days', low: 'low screen-time days' },
];

const WEEKDAYS_ABBR = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKDAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getStartDate(filter: TimeFilter, now: Date): Date {
  switch (filter) {
    case 'week': return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    case 'month': return new Date(now.getFullYear(), now.getMonth(), 1);
    case '3months': return new Date(now.getFullYear(), now.getMonth() - 3, 1);
    case '6months': return new Date(now.getFullYear(), now.getMonth() - 6, 1);
    case 'year': return new Date(now.getFullYear() - 1, now.getMonth(), 1);
  }
}

function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// ── Stats helpers ─────────────────────────────────────────────────────────────

function mean(values: number[]): number {
  return values.reduce((s, n) => s + n, 0) / values.length;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function pearson(xs: number[], ys: number[]): number | null {
  const n = xs.length;
  if (n < 3) return null;
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  if (dx === 0 || dy === 0) return null;
  return num / Math.sqrt(dx * dy);
}

// ── Insight builders ──────────────────────────────────────────────────────────

/** For each tracked metric: how does mood differ between high and low days? */
function computeDrivers(entries: Entry[]): Driver[] {
  const out: Driver[] = [];

  METRICS.forEach((metric) => {
    const pairs = entries
      .filter((e) => typeof e.metrics[metric.key] === 'number')
      .map((e) => ({ x: e.metrics[metric.key], y: e.mood }));

    if (pairs.length < MIN_PAIRS) return;

    const r = pearson(pairs.map((p) => p.x), pairs.map((p) => p.y));
    if (r === null) return;

    // Split at the person's own median so "high" and "low" are relative to them.
    const med = median(pairs.map((p) => p.x));
    let hi = pairs.filter((p) => p.x > med);
    let lo = pairs.filter((p) => p.x <= med);
    if (hi.length < 2 || lo.length < 2) {
      hi = pairs.filter((p) => p.x >= med);
      lo = pairs.filter((p) => p.x < med);
    }
    if (hi.length < 2 || lo.length < 2) return;

    out.push({
      metric,
      r,
      n: pairs.length,
      highMood: mean(hi.map((p) => p.y)),
      lowMood: mean(lo.map((p) => p.y)),
    });
  });

  return out.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
}

function computeWeekdays(entries: Entry[]) {
  const buckets: number[][] = Array.from({ length: 7 }, () => []);
  entries.forEach((e) => {
    buckets[(e.createdAt.getDay() + 6) % 7].push(e.mood);
  });
  return buckets.map((scores) => ({
    count: scores.length,
    avg: scores.length ? mean(scores) : null,
  }));
}

function buildLinePoints(entries: Entry[], filter: TimeFilter, startDate: Date, now: Date): ChartPoint[] {
  if (entries.length === 0) return [];
  const points: ChartPoint[] = [];
  const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  if (filter === 'week') {
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const key = dayKey(day);
      const dayEntries = entries.filter((e) => dayKey(e.createdAt) === key);
      points.push({
        label: day.toLocaleDateString('en-NZ', { weekday: 'narrow' }),
        score: dayEntries.length
          ? Math.round(mean(dayEntries.map((e) => e.mood)) * 10) / 10
          : null,
      });
    }
  } else {
    const monthMap: Record<string, number[]> = {};
    entries.forEach((e) => {
      const key = `${e.createdAt.getFullYear()}-${e.createdAt.getMonth()}`;
      (monthMap[key] ??= []).push(e.mood);
    });
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);
    while (current <= end) {
      const scores = monthMap[`${current.getFullYear()}-${current.getMonth()}`];
      points.push({
        label: current.toLocaleDateString('en-NZ', { month: 'short' }),
        score: scores?.length ? Math.round(mean(scores) * 10) / 10 : null,
      });
      current.setMonth(current.getMonth() + 1);
    }
  }
  return points;
}

function buildDistribution(entries: Entry[]) {
  const counts: Record<string, number> = {};
  entries.forEach((e) => { counts[e.moodKey] = (counts[e.moodKey] ?? 0) + 1; });
  const total = entries.length;
  if (total === 0) return [];
  return Object.entries(counts)
    .map(([mood, count]) => ({ mood, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);
}

function buildSummary(
  current: Entry[],
  filter: TimeFilter,
  delta: number | null,
  topDriver?: Driver,
): string {
  const avg = mean(current.map((e) => e.mood));
  const key = MOOD_ORDER[Math.min(4, Math.max(0, Math.round(avg) - 1))];
  const word = MOOD_LABEL[key].toLowerCase();

  let text = `You've been feeling mostly ${word} ${PERIOD_PHRASE[filter]}`;

  if (delta !== null) {
    if (delta > 0.2) text += ', a lift on the previous period';
    else if (delta < -0.2) text += ', lower than the previous period';
    else text += ', much like the previous period';
  }
  text += '.';

  if (topDriver) {
    text += ` ${topDriver.metric.label} seems to have the clearest link to how you feel.`;
  } else if (current.length < 5) {
    text += ' Keep logging to build a clearer picture.';
  }
  return text;
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function InsightsScreen() {
  const [filter, setFilter] = useState<TimeFilter>('week');

  const {
  entries: journalEntries,
  loading,
  refresh,
} = useJournalEntries();

useFocusEffect(
  useCallback(() => {
    refresh();
  }, [refresh]),
);
  const trackedOptions = useTrackingOptions();
  const now = useNow();

  const all: Entry[] = useMemo(
    () =>
      (journalEntries ?? [])
        .filter((e) => e.mood && MOOD_SCORE[e.mood as string] !== undefined)
        .map((e) => {
          const raw = e as unknown as Record<string, unknown>;
          const metrics: Record<string, number> = {};
          METRICS.forEach((m) => {
            const v = raw[m.key];
            if (typeof v === 'number' && !Number.isNaN(v)) metrics[m.key] = v;
          });
          return {
            id: e.id,
            moodKey: e.mood as string,
            mood: MOOD_SCORE[e.mood as string],
            createdAt: new Date(e.createdAt),
            metrics,
          };
        }),
    [journalEntries],
  );

  // Period-based views (summary, trend, distribution)
  const startDate = useMemo(() => getStartDate(filter, now), [filter, now]);
  const current = useMemo(() => all.filter((e) => e.createdAt >= startDate), [all, startDate]);
  const previous = useMemo(() => {
    const duration = now.getTime() - startDate.getTime();
    const prevStart = new Date(startDate.getTime() - duration);
    return all.filter((e) => e.createdAt >= prevStart && e.createdAt < startDate);
  }, [all, startDate, now]);

  // Pattern views always use the last 90 days so there's enough data
  // regardless of which period pill is selected.
  const recent = useMemo(() => {
    const cutoff = new Date(now.getTime() - PATTERN_WINDOW_DAYS * DAY_MS);
    return all.filter((e) => e.createdAt >= cutoff);
  }, [all, now]);

  const drivers = useMemo(() => computeDrivers(recent), [recent]);
  const helping = drivers.filter((d) => d.r >= MIN_LINK).slice(0, 3);
  const weighing = drivers.filter((d) => d.r <= -MIN_LINK).slice(0, 3);

  // Metrics the user tracks but we can't analyse yet.
  const stillLearning = useMemo(
    () =>
      METRICS.filter((m) => trackedOptions.includes(m.option as never)).filter(
        (m) => recent.filter((e) => typeof e.metrics[m.key] === 'number').length < MIN_PAIRS,
      ),
    [trackedOptions, recent],
  );

  const weekdays = useMemo(() => computeWeekdays(recent), [recent]);
  const weekdayReady = recent.length > 0;

  const linePoints = useMemo(
    () => buildLinePoints(current, filter, startDate, now),
    [current, filter, startDate, now],
  );
  const realPoints = linePoints.filter((p) => p.score !== null).length;
  const distribution = useMemo(() => buildDistribution(current), [current]);

  const delta =
    current.length > 0 && previous.length >= 3
      ? mean(current.map((e) => e.mood)) - mean(previous.map((e) => e.mood))
      : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>MY MENTAL</Text>
          <Text style={styles.headerTitle}>Insights</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Period pills */}
        <View style={styles.filterRow}>
          {FILTER_LABELS.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterPill, filter === key && styles.filterPillActive]}
              onPress={() => setFilter(key)}
            >
              <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.centred}>
            <ActivityIndicator color={colors.teal} size="large" />
          </View>
        ) : all.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Not enough data yet</Text>
            <Text style={styles.emptyText}>
              Log mood check-ins in your journal to see insights here.
            </Text>
          </View>
        ) : (
          <>
            {/* 1. Hero summary */}
            {current.length > 0 ? (
              <MoodHero
                entries={current}
                filter={filter}
                delta={delta}
                summary={buildSummary(
                  current,
                  filter,
                  delta,
                  [...helping, ...weighing].sort(
                    (a, b) => Math.abs(b.r) - Math.abs(a.r),
                  )[0],
                )}
              />
            ) : (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>No check-ins in this period</Text>
                <Text style={styles.emptyTextLeft}>
                  Try a longer range, or log a check-in to get started.
                </Text>
              </View>
            )}

            {/* 2. Drivers */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>What&apos;s shaping your mood</Text>
              <Text style={styles.cardSubtitle}>
                Based on your last {PATTERN_WINDOW_DAYS} days · {recent.length} check-in
                {recent.length === 1 ? '' : 's'}
              </Text>

              {helping.length === 0 && weighing.length === 0 ? (
                <Text style={styles.emptyTextLeft}>
                  No clear patterns yet. As you log more energy, sleep, stress and other
                  details, links to your mood will show up here.
                </Text>
              ) : null}

              {helping.length > 0 ? (
                <>
                  <Text style={[styles.groupLabel, { color: colors.teal }]}>HELPING</Text>
                  {helping.map((d) => <DriverRow key={d.metric.key} driver={d} positive />)}
                </>
              ) : null}

              {weighing.length > 0 ? (
                <>
                  <Text style={[styles.groupLabel, { color: colors.coral }]}>WEIGHING ON YOU</Text>
                  {weighing.map((d) => <DriverRow key={d.metric.key} driver={d} positive={false} />)}
                </>
              ) : null}

              {stillLearning.length > 0 ? (
                <Text style={styles.learningText}>
                  Still building a picture for {stillLearning.map((m) => m.label.toLowerCase()).join(', ')}
                  . A few more check-ins and these will unlock.
                </Text>
              ) : null}

              <Text style={styles.disclaimer}>
                These are patterns, not causes. They show what tends to go together in your
                data.
              </Text>
            </View>

            {/* 3. Weekday pattern */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Your week</Text>
              <Text style={styles.cardSubtitle}>
                Your average mood on each day of the week, from the last {PATTERN_WINDOW_DAYS} days.
                A longer bar means a better mood.
              </Text>
              {weekdayReady ? (
                <WeekdayChart weekdays={weekdays} todayIndex={(now.getDay() + 6) % 7} />
              ) : (
                <Text style={styles.emptyTextLeft}>
                  Log a check-in to start seeing your week.
                </Text>
              )}
            </View>

            {/* 4. Trend */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Mood trend</Text>
              {realPoints < 2 ? (
                <Text style={styles.emptyTextLeft}>Add more entries to see a trend.</Text>
              ) : (
                <LineChart points={linePoints} />
              )}
            </View>

            {/* 5. Distribution */}
            {distribution.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Mood distribution</Text>
                <Text style={styles.cardSubtitle}>
                  Based on {recent.length} entr{recent.length === 1 ? 'y' : 'ies'}
                </Text>
                <View style={styles.distContainer}>
                  {distribution.map(({ mood, pct }) => (
                    <View key={mood} style={styles.distRow}>
                      <View style={styles.distLabelRow}>
                        <View style={[styles.distDot, { backgroundColor: MOOD_COLOR[mood] }]} />
                        <Text style={styles.distLabel}>{MOOD_LABEL[mood]}</Text>
                        <Text style={styles.distPct}>{pct}%</Text>
                      </View>
                      <View style={styles.distBarBg}>
                        <View
                          style={[styles.distBarFill, { width: `${pct}%`, backgroundColor: MOOD_COLOR[mood] }]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Mood hero ─────────────────────────────────────────────────────────────────

function MoodHero({
  entries,
  filter,
  delta,
  summary,
}: {
  entries: Entry[];
  filter: TimeFilter;
  delta: number | null;
  summary: string;
}) {
  const avg5 = mean(entries.map((e) => e.mood));
  const key = MOOD_ORDER[Math.min(4, Math.max(0, Math.round(avg5) - 1))];
  const color = MOOD_COLOR[key];

  // The number is shown on the same /10 scale as the dashboard.
  const scores10 = entries
    .map((e) => scoreForMood(e.moodKey as never))
    .filter((s): s is number => typeof s === 'number');
  const avg10 = scores10.length ? mean(scores10) : null;

  const trend =
    delta === null
      ? null
      : delta > 0.2
        ? { icon: 'arrow-up' as const, text: 'Up on last period', fg: colors.teal, bg: colors.tealLight }
        : delta < -0.2
          ? { icon: 'arrow-down' as const, text: 'Down on last period', fg: colors.coral, bg: colors.coralLight }
          : { icon: 'remove' as const, text: 'Steady', fg: colors.muted, bg: colors.paperDim };

  return (
    <View style={styles.heroCard}>
      {/* Mood-coloured accent along the left edge */}
      <View style={[styles.heroAccent, { backgroundColor: color }]} />

      <View style={styles.heroTop}>
        <View style={[styles.heroBubble, { backgroundColor: color }]}>
          <Ionicons name={MOOD_ICON[key]} size={30} color={colors.white} />
        </View>

        <View style={styles.heroTopText}>
          <Text style={styles.heroLabel}>{PERIOD_SHORT[filter].toUpperCase()}</Text>
          <Text style={styles.heroMood}>{MOOD_LABEL[key]}</Text>
        </View>
      </View>

      <Text style={styles.summaryText}>{summary}</Text>

      <View style={styles.heroFooter}>
        {trend ? (
          <View style={[styles.deltaChip, { backgroundColor: trend.bg }]}>
            <Ionicons name={trend.icon} size={13} color={trend.fg} />
            <Text style={[styles.deltaText, { color: trend.fg }]}>{trend.text}</Text>
          </View>
        ) : (
          <View />
        )}

        {avg10 !== null ? (
          <View style={styles.scorePill}>
            <Text style={styles.scoreValue}>{avg10.toFixed(1)}</Text>
            <Text style={styles.scoreOutOf}>/10 avg</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

// ── Driver row ────────────────────────────────────────────────────────────────

function DriverRow({ driver, positive }: { driver: Driver; positive: boolean }) {
  const { metric, r, n, highMood, lowMood } = driver;
  const tone = positive ? colors.teal : colors.coral;
  const toneBg = positive ? colors.tealLight : colors.coralLight;

  const confidence =
    n < ESTABLISHED_PAIRS ? 'Emerging' : Math.abs(r) >= STRONG_LINK ? 'Strong link' : 'Moderate link';

  return (
    <View style={styles.driverRow}>
      <View style={[styles.driverIcon, { backgroundColor: toneBg }]}>
        <Ionicons name={metric.icon} size={18} color={tone} />
      </View>

      <View style={styles.driverBody}>
        <View style={styles.driverTop}>
          <Text style={styles.driverTitle}>{metric.label}</Text>
          <Text style={[styles.driverConfidence, { color: tone }]}>{confidence}</Text>
        </View>

        <Text style={styles.driverText}>
          Mood averages {highMood.toFixed(1)} on {metric.high}, vs {lowMood.toFixed(1)} on{' '}
          {metric.low}.
        </Text>
      </View>
    </View>
  );
}

// ── Weekday chart ─────────────────────────────────────────────────────────────

function moodKeyFromAvg(avg: number) {
  return MOOD_ORDER[Math.min(4, Math.max(0, Math.round(avg) - 1))];
}

function DayTile({ title, day, avg }: { title: string; day: string; avg: number }) {
  const key = moodKeyFromAvg(avg);
  const color = MOOD_COLOR[key];

  return (
    <View style={[styles.dayTile, { borderLeftColor: color }]}>
      <Text style={styles.dayTileTitle}>{title}</Text>
      <Text style={styles.dayTileDay}>{day}</Text>
      <View style={styles.dayTileMood}>
        <Ionicons name={MOOD_ICON[key]} size={16} color={color} />
        <Text style={[styles.dayTileMoodText, { color }]}>{MOOD_LABEL[key]}</Text>
      </View>
    </View>
  );
}

function WeekdayChart({
  weekdays,
  todayIndex,
}: {
  weekdays: { count: number; avg: number | null }[];
  todayIndex: number;
}) {
  // A single log is enough for a day to show its average.
  const logged = weekdays
    .map((d, i) => ({ ...d, i }))
    .filter((d) => d.avg !== null) as { avg: number; count: number; i: number }[];

  // Brightest / toughest only make sense once two different days have logs.
  const best = logged.length >= 2 ? logged.reduce((a, b) => (b.avg > a.avg ? b : a)) : null;
  const worst = logged.length >= 2 ? logged.reduce((a, b) => (b.avg < a.avg ? b : a)) : null;
  const hasPattern = !!best && !!worst && best.i !== worst.i && best.avg - worst.avg >= 0.3;

  return (
    <View>
      {hasPattern ? (
        <View style={styles.weekdayHighlights}>
          <DayTile title="BRIGHTEST DAY" day={WEEKDAYS_FULL[best!.i]} avg={best!.avg} />
          <DayTile title="TOUGHEST DAY" day={WEEKDAYS_FULL[worst!.i]} avg={worst!.avg} />
        </View>
      ) : logged.length >= 2 ? (
        <Text style={styles.weekdaySummary}>Your mood is fairly steady across the week.</Text>
      ) : null}

      <View style={styles.weekdayList}>
        {weekdays.map((d, i) => {
          const key = d.avg !== null ? moodKeyFromAvg(d.avg) : null;
          const pct = d.avg !== null ? Math.max(8, ((d.avg - 1) / 4) * 100) : 0;
          const isToday = i === todayIndex;

          return (
            <View key={i} style={styles.weekdayItem}>
              <Text style={[styles.weekdayName, isToday && styles.weekdayNameToday]}>
                {WEEKDAYS_ABBR[i]}
              </Text>

              <View style={styles.weekdayTrack}>
                {key ? (
                  <View
                    style={[styles.weekdayFill, { width: `${pct}%`, backgroundColor: MOOD_COLOR[key] }]}
                  />
                ) : null}
              </View>

              <Text style={[styles.weekdayMood, !key && styles.weekdayMoodMuted]}>
                {key ? MOOD_LABEL[key] : 'No log'}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ── Line chart (pure React Native) ────────────────────────────────────────────

function LineChart({ points }: { points: ChartPoint[] }) {
  const minScore = 1;
  const maxScore = 5;
  const range = maxScore - minScore;
  const w = CHART_WIDTH;
  const h = CHART_HEIGHT;
  const padL = 32;
  const padR = 8;
  const padT = 8;
  const padB = 24;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const n = points.length;
  const getX = (i: number) => (n <= 1 ? padL + innerW / 2 : padL + (i / (n - 1)) * innerW);
  const getY = (score: number) => padT + ((maxScore - score) / range) * innerH;

  const dotPositions = points
    .map((p, i) => ({ x: getX(i), y: p.score === null ? null : getY(p.score) }))
    .filter((p): p is { x: number; y: number } => p.y !== null);

  const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (a.score !== null && b.score !== null) {
      segments.push({ x1: getX(i), y1: getY(a.score), x2: getX(i + 1), y2: getY(b.score) });
    }
  }

  const yLabels = [
    { score: 5, label: 'Great' },
    { score: 4, label: 'Good' },
    { score: 3, label: 'OK' },
    { score: 2, label: 'Bad' },
    { score: 1, label: 'V.Bad' },
  ];

  return (
    <View style={{ height: h + 8, marginTop: spacing.md }}>
      <View style={{ width: w, height: h, position: 'relative' }}>
        {yLabels.map(({ score, label }) => (
          <View
            key={score}
            style={{
              position: 'absolute',
              top: getY(score) - 8,
              left: 0,
              right: 0,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={styles.axisLabel}>{label}</Text>
            <View style={styles.gridLine} />
          </View>
        ))}

        {segments.map((s, i) => {
          const dx = s.x2 - s.x1;
          const dy = s.y2 - s.y1;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const midX = (s.x1 + s.x2) / 2;
          const midY = (s.y1 + s.y2) / 2;
          return (
            <View
              key={`line-${i}`}
              style={{
                position: 'absolute',
                left: midX - length / 2,
                top: midY - 1.25,
                width: length,
                height: 2.5,
                backgroundColor: colors.teal,
                transform: [{ rotate: `${angle}deg` }],
              }}
            />
          );
        })}

        {dotPositions.map((p, i) => (
          <View
            key={`dot-${i}`}
            style={{
              position: 'absolute',
              left: p.x - 5,
              top: p.y - 5,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: colors.teal,
              borderWidth: 2,
              borderColor: colors.white,
            }}
          />
        ))}
      </View>

      <View style={{ flexDirection: 'row', paddingLeft: padL, paddingRight: padR, marginTop: 4 }}>
        {points.map((p, i) => (
          <Text
            key={i}
            numberOfLines={1}
            style={[
              styles.axisLabelX,
              {
                flex: 1,
                textAlign: i === 0 ? 'left' : i === points.length - 1 ? 'right' : 'center',
              },
            ]}
          >
            {p.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },

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
  headerTitle: { fontFamily: fonts.serif, fontSize: 30, color: colors.ink },

  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },

  filterRow: { flexDirection: 'row', gap: spacing.sm },
  filterPill: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  filterPillActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  filterText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.muted },
  filterTextActive: { color: colors.white },

  centred: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: spacing.xl },
  emptyTitle: { fontFamily: fonts.sansSemiBold, fontSize: 18, color: colors.ink, marginBottom: spacing.sm },
  emptyText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 22 },
  emptyTextLeft: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, lineHeight: 22 },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: colors.ink, marginBottom: spacing.xs },
  cardSubtitle: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: spacing.md },

  heroCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    paddingLeft: spacing.lg + 6,
    gap: spacing.md,
    overflow: 'hidden',
  },
  heroAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  heroBubble: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTopText: { flex: 1 },
  heroLabel: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 1.2, color: colors.muted },
  heroMood: { fontFamily: fonts.serif, fontSize: 34, lineHeight: 40, color: colors.ink },
  summaryText: { fontFamily: fonts.sans, fontSize: 14, color: colors.ink2, lineHeight: 22 },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deltaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
  },
  deltaText: { fontFamily: fonts.sansSemiBold, fontSize: 12 },
  scorePill: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  scoreValue: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: colors.ink },
  scoreOutOf: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },

  groupLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    letterSpacing: 1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  driverRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  driverIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverBody: { flex: 1, gap: 2 },
  driverTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  driverTitle: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.ink },
  driverConfidence: { fontFamily: fonts.sansMedium, fontSize: 11 },
  driverText: { fontFamily: fonts.sans, fontSize: 13, color: colors.ink2, lineHeight: 19 },
  learningText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  disclaimer: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedLight,
    lineHeight: 17,
    marginTop: spacing.md,
  },

  weekdaySummary: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink2,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  weekdayHighlights: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  dayTile: {
    flex: 1,
    borderLeftWidth: 3,
    paddingLeft: spacing.md,
    gap: 2,
  },
  dayTileTitle: { fontFamily: fonts.sansSemiBold, fontSize: 10, letterSpacing: 1, color: colors.muted },
  dayTileDay: { fontFamily: fonts.serif, fontSize: 20, color: colors.ink },
  dayTileMood: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  dayTileMoodText: { fontFamily: fonts.sansSemiBold, fontSize: 13 },

  weekdayList: { gap: spacing.sm },
  weekdayItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  weekdayName: { width: 34, fontFamily: fonts.sansMedium, fontSize: 13, color: colors.muted },
  weekdayNameToday: { fontFamily: fonts.sansSemiBold, color: colors.ink },
  weekdayTrack: {
    flex: 1,
    height: 12,
    borderRadius: radius.full,
    backgroundColor: colors.paperDim,
    overflow: 'hidden',
  },
  weekdayFill: { height: 12, borderRadius: radius.full },
  weekdayMood: {
    width: 62,
    textAlign: 'right',
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink2,
  },
  weekdayMoodMuted: { color: colors.mutedLight },

  axisLabel: { fontFamily: fonts.sans, fontSize: 10, color: colors.muted, width: 30, textAlign: 'right', marginRight: 4 },
  axisLabelX: { fontFamily: fonts.sans, fontSize: 10, color: colors.muted },
  gridLine: { flex: 1, height: 1, backgroundColor: colors.border, opacity: 0.6 },

  distContainer: { gap: spacing.md },
  distRow: { gap: spacing.xs },
  distLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  distDot: { width: 10, height: 10, borderRadius: 5 },
  distLabel: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink, flex: 1 },
  distPct: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.ink },
  distBarBg: { height: 8, backgroundColor: colors.paperDim, borderRadius: radius.full },
  distBarFill: { height: 8, borderRadius: radius.full },
});