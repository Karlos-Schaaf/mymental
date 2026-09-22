import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  getMoodColor,
  MoodLevel,
  JournalEntry,
} from '../hooks/useJournalEntries';

const Colors = {
  primary: '#0A9B45',
  softGreen: '#EAF8EF',
  background: '#FFFFFF',
  border: '#E6E6E6',
  text: '#1E1E1E',
  secondary: '#7A7A7A',
};

const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
};

const Radius = {
  lg: 16,
};

type Props = {
  entries: JournalEntry[];
  onDayPress: (date: string) => void;
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MoodCalendar({ entries, onDayPress }: Props) {
  // `today` is stable for the lifetime of a render pass. We use it to
  // seed state below, and derive a plain string key for memoization.
  const today = new Date();
  const todayKey = createDateKeyFromDate(today);

  const [expanded, setExpanded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  /*
   * Build: dateKey -> moods for that day
   * { "2026-09-22": ["good", "great"] }
   */
  const dayMoodsMap = useMemo(() => {
    const map: Record<string, MoodLevel[]> = {};
    entries.forEach((entry) => {
      const key = toDateKey(entry.createdAt);
      if (!key) return;
      if (!map[key]) map[key] = [];
      if (map[key].length < 3) {
        map[key].push(entry.mood ?? 'neutral');
      }
    });
    return map;
  }, [entries]);

  /*
   * Build the 7 dates of the current week (Mon..Sun).
   *
   * Depends only on `todayKey`, a primitive string, so the memo is
   * meaningful — it recomputes only when the calendar day changes.
   */
  const weekDays = useMemo(() => {
    const base = parseDateKey(todayKey);
    const day = base.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
    const daysSinceMonday = day === 0 ? 6 : day - 1;
    base.setDate(base.getDate() - daysSinceMonday);

    return Array.from({ length: 7 }, (_, index) => {
      const weekDate = new Date(base);
      weekDate.setDate(base.getDate() + index);
      return weekDate;
    });
  }, [todayKey]);

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString(
    'en-NZ',
    { month: 'long', year: 'numeric' },
  );

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const mondayFirstOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthCells: (number | null)[] = [
    ...Array(mondayFirstOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const goToPrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((year) => year - 1);
    } else {
      setCurrentMonth((month) => month - 1);
    }
  };

  const goToNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((year) => year + 1);
    } else {
      setCurrentMonth((month) => month + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mood</Text>
          {!expanded && <Text style={styles.weekLabel}>This week</Text>}
        </View>

        <TouchableOpacity
          onPress={() => setExpanded((value) => !value)}
          style={styles.expandButton}
          activeOpacity={0.7}
          accessibilityLabel={
            expanded ? 'Collapse calendar' : 'Expand calendar'
          }
        >
          <Text style={styles.expandText}>
            {expanded ? 'Collapse' : 'Expand'}
          </Text>
          <Text style={styles.expandArrow}>{expanded ? '⌃' : '⌄'}</Text>
        </TouchableOpacity>
      </View>

      {!expanded ? (
        /* COMPACT WEEK VIEW */
        <View style={styles.weekContainer}>
          <View style={styles.weekLabelsRow}>
            {DAYS.map((day) => (
              <Text key={day} style={styles.weekDayLabel}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.weekDatesRow}>
            {weekDays.map((date) => {
              const dateKey = createDateKeyFromDate(date);
              const moods = dayMoodsMap[dateKey] ?? [];
              const isToday = dateKey === todayKey;

              return (
                <TouchableOpacity
                  key={dateKey}
                  style={[styles.weekDay, isToday && styles.weekDayToday]}
                  onPress={() => onDayPress(dateKey)}
                  activeOpacity={0.7}
                  accessibilityLabel={`${formatAccessibleDate(date)}${
                    moods.length > 0
                      ? `, ${moods.length} ${
                          moods.length === 1 ? 'entry' : 'entries'
                        }`
                      : ''
                  }`}
                >
                  <Text
                    style={[
                      styles.weekDateNumber,
                      isToday && styles.weekDateNumberToday,
                    ]}
                  >
                    {date.getDate()}
                  </Text>

                  <View style={styles.dotsRow}>
                    {moods.map((mood, index) => (
                      <View
                        key={`${mood}-${index}`}
                        style={[
                          styles.dot,
                          { backgroundColor: getMoodColor(mood) },
                        ]}
                      />
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        /* EXPANDED MONTH VIEW */
        <>
          <View style={styles.navRow}>
            <TouchableOpacity
              onPress={goToPrev}
              style={styles.navBtn}
              accessibilityLabel="Previous month"
              activeOpacity={0.7}
            >
              <Text style={styles.navArrow}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.monthLabel}>{monthLabel}</Text>

            <TouchableOpacity
              onPress={goToNext}
              style={styles.navBtn}
              accessibilityLabel="Next month"
              activeOpacity={0.7}
            >
              <Text style={styles.navArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dayLabelsRow}>
            {DAYS.map((day) => (
              <Text key={day} style={styles.dayLabel}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {monthCells.map((day, index) => {
              if (day === null) {
                return <View key={`blank-${index}`} style={styles.cell} />;
              }

              const dateKey = createDateKey(currentYear, currentMonth, day);
              const moods = dayMoodsMap[dateKey] ?? [];
              const hasEntries = moods.length > 0;
              const isToday = dateKey === todayKey;

              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.cell, isToday && styles.todayCell]}
                  onPress={() => onDayPress(dateKey)}
                  accessibilityLabel={`${day} ${monthLabel}${
                    hasEntries
                      ? `, ${moods.length} entr${
                          moods.length === 1 ? 'y' : 'ies'
                        }`
                      : ''
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      isToday && styles.todayText,
                    ]}
                  >
                    {day}
                  </Text>

                  {hasEntries && (
                    <View style={styles.dotsRow}>
                      {moods.map((mood, moodIndex) => (
                        <View
                          key={`${mood}-${moodIndex}`}
                          style={[
                            styles.dot,
                            { backgroundColor: getMoodColor(mood) },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        {(
          [
            { mood: 'very_bad', label: 'Very Bad' },
            { mood: 'bad', label: 'Bad' },
            { mood: 'neutral', label: 'Neutral' },
            { mood: 'good', label: 'Good' },
            { mood: 'great', label: 'Great' },
          ] as { mood: MoodLevel; label: string }[]
        ).map(({ mood, label }) => (
          <View key={label} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: getMoodColor(mood) },
              ]}
            />
            <Text style={styles.legendLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * Converts a stored journal date into a local YYYY-MM-DD date key.
 */
function toDateKey(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return createDateKeyFromDate(date);
  } catch {
    return '';
  }
}

/**
 * Creates YYYY-MM-DD from a local Date.
 * Does not use toISOString(), avoiding timezone shifts around midnight.
 */
function createDateKeyFromDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Creates YYYY-MM-DD from explicit calendar values.
 */
function createDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Parses a YYYY-MM-DD key into a *local* Date at midnight.
 * (new Date('2026-09-22') would parse as UTC and can shift the day.)
 */
function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatAccessibleDate(date: Date): string {
  return date.toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  title: { fontSize: 16, fontWeight: '600', color: Colors.text },
  weekLabel: { marginTop: 2, fontSize: 11, color: Colors.secondary },
  expandButton: {
    minHeight: 40,
    paddingHorizontal: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  expandArrow: { fontSize: 16, color: Colors.primary, fontWeight: '600' },
  weekContainer: { width: '100%' },
  weekLabelsRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  weekDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '500',
  },
  weekDatesRow: { flexDirection: 'row' },
  weekDay: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 2,
  },
  weekDayToday: { backgroundColor: Colors.softGreen },
  weekDateNumber: { fontSize: 15, color: Colors.text },
  weekDateNumberToday: { fontWeight: 'bold', color: Colors.primary },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  navBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: { fontSize: 24, color: Colors.primary, fontWeight: '600' },
  monthLabel: { fontSize: 16, fontWeight: '600', color: Colors.text },
  dayLabelsRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '500',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: '14.28%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 8,
  },
  todayCell: { backgroundColor: Colors.softGreen },
  dayNumber: { fontSize: 13, color: Colors.text },
  todayText: { fontWeight: 'bold', color: Colors.primary },
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 3,
    flexWrap: 'wrap',
    justifyContent: 'center',
    minHeight: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendLabel: { fontSize: 10, color: Colors.secondary },
});