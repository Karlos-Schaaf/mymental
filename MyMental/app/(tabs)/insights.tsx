
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, ActivityIndicator, Dimensions,
} from 'react-native';
import { auth } from '../../src/firebase/auth';
import { getJournalEntries } from '../../src/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { colors, fonts, spacing, radius } from '../../src/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - spacing.xl * 2 - spacing.xl * 2;
const CHART_HEIGHT = 160;

// ── Types ─────────────────────────────────────────────────────────────────────

type MoodLevel = 'very_bad' | 'bad' | 'neutral' | 'good' | 'great';
type TimeFilter = 'week' | 'month' | '3months' | '6months' | 'year';

type Entry = {
  id: string;
  mood?: string;
  createdAt: Date;
};

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

function getStartDate(filter: TimeFilter): Date {
  const now = new Date();
  switch (filter) {
    case 'week':    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    case 'month':   return new Date(now.getFullYear(), now.getMonth(), 1);
    case '3months': return new Date(now.getFullYear(), now.getMonth() - 3, 1);
    case '6months': return new Date(now.getFullYear(), now.getMonth() - 6, 1);
    case 'year':    return new Date(now.getFullYear() - 1, now.getMonth(), 1);
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function InsightsScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TimeFilter>('week');
  const uid = auth.currentUser?.uid;

  const loadEntries = useCallback(async () => {
    if (!uid) { setLoading(false); return; }
    try {
      setLoading(true);
      const docs = await getJournalEntries(uid);
      setEntries(
        docs.filter((d) => d.mood).map((d) => ({
          id: d.id ?? '',
          mood: d.mood,
          createdAt:
            d.createdAt instanceof Timestamp ? d.createdAt.toDate() :
            d.createdAt instanceof Date ? d.createdAt : new Date(),
        }))
      );
    } catch (e) {
      console.error('InsightsScreen load error:', e);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const startDate = getStartDate(filter);
  const filtered = entries.filter((e) => e.createdAt >= startDate);
  const hasData = filtered.length > 0;
  const linePoints = buildLinePoints(filtered, filter, startDate);
  const distribution = buildDistribution(filtered);

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
              {linePoints.length < 2 ? (
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

type ChartPoint = { label: string; score: number };

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

  const getX = (i: number) => padL + (i / (points.length - 1)) * innerW;
  const getY = (score: number) => padT + ((maxScore - score) / range) * innerH;

  // Build SVG-style path using absolute positioning
  const dotPositions = points.map((p, i) => ({
    x: getX(i),
    y: getY(p.score),
    label: p.label,
    score: p.score,
  }));

  // Y axis labels
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

        {/* Line segments between dots */}
        {dotPositions.slice(0, -1).map((p, i) => {
          const next = dotPositions[i + 1];
          const dx = next.x - p.x;
          const dy = next.y - p.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View
              key={`line-${i}`}
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                width: length,
                height: 2.5,
                backgroundColor: colors.teal,
                transformOrigin: 'left center',
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
            style={[styles.axisLabelX, { flex: 1, textAlign: i === 0 ? 'left' : i === points.length - 1 ? 'right' : 'center' }]}
          >
            {p.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ── Data builders ─────────────────────────────────────────────────────────────

function buildLinePoints(entries: Entry[], filter: TimeFilter, startDate: Date): ChartPoint[] {
  if (entries.length === 0) return [];
  const now = new Date();
  const points: ChartPoint[] = [];

  if (filter === 'week') {
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const key = day.toISOString().split('T')[0];
      const dayEntries = entries.filter(
        (e) => e.createdAt.toISOString().split('T')[0] === key
      );
      if (dayEntries.length > 0) {
        const avg = dayEntries.reduce((s, e) => s + (MOOD_SCORE[e.mood ?? ''] ?? 3), 0) / dayEntries.length;
        points.push({
          label: day.toLocaleDateString('en-NZ', { weekday: 'short' }),
          score: Math.round(avg * 10) / 10,
        });
      }
    }
  } else {
    const monthMap: Record<string, number[]> = {};
    entries.forEach((e) => {
      const key = `${e.createdAt.getFullYear()}-${e.createdAt.getMonth()}`;
      if (!monthMap[key]) monthMap[key] = [];
      monthMap[key].push(MOOD_SCORE[e.mood ?? ''] ?? 3);
    });
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    while (current <= now) {
      const key = `${current.getFullYear()}-${current.getMonth()}`;
      const scores = monthMap[key];
      if (scores && scores.length > 0) {
        const avg = scores.reduce((s, n) => s + n, 0) / scores.length;
        points.push({
          label: current.toLocaleDateString('en-NZ', { month: 'short' }),
          score: Math.round(avg * 10) / 10,
        });
      }
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
