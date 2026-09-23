import React, { useEffect, useMemo, useState } from 'react';
import { useJournalEntries } from '../../src/hooks/useJournalEntries';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, ActivityIndicator, Dimensions,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../../src/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = Math.max(0, SCREEN_WIDTH - spacing.xl * 4);
const CHART_HEIGHT = 160;

// ── Types ─────────────────────────────────────────────────────────────────────

type TimeFilter = 'week' | 'month' | '3months' | '6months' | 'year';

type Entry = {
  id: string;
  mood?: string;
  createdAt: Date;
};

type ChartPoint = { label: string; score: number | null };

// ── Constants ─────────────────────────────────────────────────────────────────

const MOOD_SCORE: Record<string, number> = {
  very_bad: 1, bad: 2, neutral: 3, good: 4, great: 5,
};

const MOOD_COLOR: Record<string, string> = {
  great:    colors.teal,
  good:     '#6BBF8E',
  neutral:  colors.amber,
  bad:      colors.coralMid,
  very_bad: colors.coral,
};

const MOOD_LABEL: Record<string, string> = {
  great: 'Great', good: 'Good', neutral: 'Neutral', bad: 'Bad', very_bad: 'Very Bad',
};

const FILTER_LABELS: { key: TimeFilter; label: string }[] = [
  { key: 'week',    label: 'Week' },
  { key: 'month',   label: 'Month' },
  { key: '3months', label: '3M' },
  { key: '6months', label: '6M' },
  { key: 'year',    label: '1Y' },
];

function getStartDate(filter: TimeFilter, now: Date): Date {
  switch (filter) {
    case 'week':    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    case 'month':   return new Date(now.getFullYear(), now.getMonth(), 1);
    case '3months': return new Date(now.getFullYear(), now.getMonth() - 3, 1);
    case '6months': return new Date(now.getFullYear(), now.getMonth() - 6, 1);
    case 'year':    return new Date(now.getFullYear() - 1, now.getMonth(), 1);
  }
}

// Ticks `now` on an interval so time-based filters stay fresh without
// calling Date.now() during render (React purity rule).
function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function InsightsScreen() {
  const [filter, setFilter] = useState<TimeFilter>('week');

  const { entries: journalEntries, loading } = useJournalEntries();
  const now = useNow();

  // Derive entries — no effect, no local state copy.
  const entries: Entry[] = useMemo(
    () =>
      (journalEntries ?? [])
        .filter((e) => e.mood)
        .map((e) => ({
          id: e.id,
          mood: e.mood,
          createdAt: new Date(e.createdAt),
        })),
    [journalEntries],
  );

  const startDate = useMemo(() => getStartDate(filter, now), [filter, now]);

  const filtered = useMemo(
    () => entries.filter((e) => e.createdAt >= startDate),
    [entries, startDate],
  );

  const hasData = filtered.length > 0;
  const linePoints = useMemo(
    () => buildLinePoints(filtered, filter, startDate, now),
    [filtered, filter, startDate, now],
  );
  const distribution = useMemo(() => buildDistribution(filtered), [filtered]);

  // Count only real (non-null) data points for the "enough to chart" check.
  const realPoints = linePoints.filter((p) => p.score !== null).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
        </View>

        {/* Filter pills */}
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
        ) : !hasData ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Not enough data yet</Text>
            <Text style={styles.emptyText}>
              Log mood check-ins in your journal to see analytics here.
            </Text>
          </View>
        ) : (
          <>
            {/* Mood Trends Line Chart */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Mood Trends</Text>
              {realPoints < 2 ? (
                <Text style={styles.emptyText}>Add more entries to see a trend.</Text>
              ) : (
                <LineChart points={linePoints} />
              )}
            </View>

            {/* Mood Distribution */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Mood Distribution</Text>
              <Text style={styles.cardSubtitle}>
                Based on {filtered.length} entr{filtered.length === 1 ? 'y' : 'ies'}
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
                        style={[styles.distBarFill, {
                          width: `${pct}%`,
                          backgroundColor: MOOD_COLOR[mood],
                        }]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Summary */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Summary</Text>
              <Text style={styles.summaryText}>
                {buildSummary(filtered, filter)}
              </Text>
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Line Chart (pure React Native) ────────────────────────────────────────────

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
  const getX = (i: number) =>
    n <= 1 ? padL + innerW / 2 : padL + (i / (n - 1)) * innerW;
  const getY = (score: number) => padT + ((maxScore - score) / range) * innerH;

  // Dots: only real (non-null) points.
  const dotPositions = points
    .map((p, i) => ({
      x: getX(i),
      y: p.score === null ? null : getY(p.score),
      score: p.score,
    }))
    .filter((p): p is { x: number; y: number; score: number } => p.y !== null);

  // Line segments between *adjacent* real points only — nulls break the line.
  const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (a.score !== null && b.score !== null) {
      segments.push({
        x1: getX(i),     y1: getY(a.score),
        x2: getX(i + 1), y2: getY(b.score),
      });
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

        {/* Y axis labels + gridlines */}
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

        {/* Line segments — rotate around each segment's own center.
            (RN's default transform origin is center; using `left center`
            is not supported on RN < 0.74 and silently breaks the chart.) */}
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

        {/* Dots */}
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

      {/* X axis labels */}
      <View style={{ flexDirection: 'row', paddingLeft: padL, paddingRight: padR, marginTop: 4 }}>
        {points.map((p, i) => (
          <Text
            key={i}
            numberOfLines={1}
            style={[
              styles.axisLabelX,
              {
                flex: 1,
                textAlign:
                  i === 0 ? 'left'
                  : i === points.length - 1 ? 'right'
                  : 'center',
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

// ── Data builders ─────────────────────────────────────────────────────────────

function buildLinePoints(
  entries: Entry[],
  filter: TimeFilter,
  startDate: Date,
  now: Date,
): ChartPoint[] {
  if (entries.length === 0) return [];
  const points: ChartPoint[] = [];
  const dayKey = (d: Date) =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  if (filter === 'week') {
    // Always emit 7 buckets (startDate .. startDate+6); score is null if no data.
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const key = dayKey(day);
      const dayEntries = entries.filter((e) => dayKey(e.createdAt) === key);
      const score =
        dayEntries.length > 0
          ? Math.round(
              (dayEntries.reduce((s, e) => s + (MOOD_SCORE[e.mood ?? ''] ?? 3), 0) /
                dayEntries.length) * 10,
            ) / 10
          : null;
      points.push({
        label: day.toLocaleDateString('en-NZ', { weekday: 'narrow' }),
        score,
      });
    }
  } else {
    // Group by year-month, then walk month-by-month from startDate to now.
    const monthMap: Record<string, number[]> = {};
    entries.forEach((e) => {
      const key = `${e.createdAt.getFullYear()}-${e.createdAt.getMonth()}`;
      if (!monthMap[key]) monthMap[key] = [];
      monthMap[key].push(MOOD_SCORE[e.mood ?? ''] ?? 3);
    });

    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);
    while (current <= end) {
      const key = `${current.getFullYear()}-${current.getMonth()}`;
      const scores = monthMap[key];
      const score =
        scores && scores.length > 0
          ? Math.round((scores.reduce((s, n) => s + n, 0) / scores.length) * 10) / 10
          : null;
      points.push({
        label: current.toLocaleDateString('en-NZ', { month: 'short' }),
        score,
      });
      current.setMonth(current.getMonth() + 1);
    }
  }
  return points;
}

function buildDistribution(entries: Entry[]) {
  const counts: Record<string, number> = {};
  entries.forEach((e) => {
    if (e.mood) counts[e.mood] = (counts[e.mood] ?? 0) + 1;
  });
  const total = entries.length;
  if (total === 0) return [];
  return Object.entries(counts)
    .map(([mood, count]) => ({ mood, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);
}

function buildSummary(entries: Entry[], filter: TimeFilter): string {
  if (entries.length === 0) return 'No data available for this period.';
  const scores = entries.map((e) => MOOD_SCORE[e.mood ?? ''] ?? 3);
  const avg = scores.reduce((s, n) => s + n, 0) / scores.length;
  const filterLabel = FILTER_LABELS.find((f) => f.key === filter)?.label ?? '';
  const moodWord = avg >= 4.5 ? 'great' : avg >= 3.5 ? 'good' : avg >= 2.5 ? 'mixed' : avg >= 1.5 ? 'low' : 'difficult';
  const top = buildDistribution(entries)[0];
  const topLabel = top ? MOOD_LABEL[top.mood] : '';
  return `Over this ${filterLabel.toLowerCase()}, your mood has been mostly ${moodWord}. ` +
    `Your most recorded mood was ${topLabel} (${top?.pct ?? 0}% of entries). ` +
    `Keep logging to build a clearer picture of your wellbeing over time.`;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: colors.paper },
  scroll:           { paddingBottom: spacing.xl },
  header:           { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  title:            { fontFamily: fonts.serif, fontSize: 32, color: colors.ink },
  filterRow:        { flexDirection: 'row', paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, gap: spacing.sm },
  filterPill: {
    flex: 1, paddingVertical: spacing.sm, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white,
    alignItems: 'center',
  },
  filterPillActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  filterText:       { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.muted },
  filterTextActive: { color: colors.white },
  centred:          { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyState:       { alignItems: 'center', paddingTop: 60, paddingHorizontal: spacing.xl },
  emptyTitle:       { fontFamily: fonts.sansSemiBold, fontSize: 18, color: colors.ink, marginBottom: spacing.sm },
  emptyText:        { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 22 },
  card: {
    marginHorizontal: spacing.xl, marginBottom: spacing.xl,
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.xl, borderWidth: 1, borderColor: colors.border,
  },
  cardTitle:        { fontFamily: fonts.sansSemiBold, fontSize: 16, color: colors.ink, marginBottom: spacing.xs },
  cardSubtitle:     { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: spacing.lg },
  axisLabel:        { fontFamily: fonts.sans, fontSize: 10, color: colors.muted, width: 30, textAlign: 'right', marginRight: 4 },
  axisLabelX:       { fontFamily: fonts.sans, fontSize: 10, color: colors.muted },
  gridLine:         { flex: 1, height: 1, backgroundColor: colors.border, opacity: 0.6 },
  distContainer:    { marginTop: spacing.md, gap: spacing.md },
  distRow:          { gap: spacing.xs },
  distLabelRow:     { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  distDot:          { width: 10, height: 10, borderRadius: 5 },
  distLabel:        { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink, flex: 1 },
  distPct:          { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.ink },
  distBarBg:        { height: 8, backgroundColor: colors.paperDim, borderRadius: radius.full },
  distBarFill:      { height: 8, borderRadius: radius.full },
  summaryText:      { fontFamily: fonts.sans, fontSize: 14, color: colors.ink2, lineHeight: 22 },
});