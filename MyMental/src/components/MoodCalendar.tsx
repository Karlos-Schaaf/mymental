import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getMoodColor, getMoodEmoji, MoodLevel } from '../hooks/useJournalEntries';

const Colors = {
  primary: '#0A9B45',
  softGreen: '#EAF8EF',
  background: '#FFFFFF',
  border: '#E6E6E6',
  text: '#1E1E1E',
  secondary: '#7A7A7A',
};

const Spacing = { xs: 4, sm: 8, md: 16, lg: 24 };
const Radius = { sm: 10, lg: 16 };

export type JournalEntry = {
  id: string;
  content: string;
  createdAt: string;
  mood?: MoodLevel;
};

export type MoodEntry = {
  createdAt: string;
  mood: MoodLevel;
};

type Props = {
  entries: JournalEntry[];
  moodEntries?: MoodEntry[];
  onDayPress: (date: string) => void;
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MoodCalendar({ entries, moodEntries = [], onDayPress }: Props) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString('en-NZ', {
    month: 'long',
    year: 'numeric',
  });

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const moodMap: Record<string, MoodLevel> = {};

  moodEntries.forEach((m) => {
    const key = toDateKey(m.createdAt);
    if (key) moodMap[key] = m.mood;
  });

  entries.forEach((e) => {
    const key = toDateKey(e.createdAt);
    if (key && e.mood) moodMap[key] = e.mood;
  });

  // Mark days that have entries even without mood
  const entryDays: Record<string, boolean> = {};
  entries.forEach((e) => {
    const key = toDateKey(e.createdAt);
    if (key) entryDays[key] = true;
  });

  const goToPrev = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };

  const goToNext = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        <TouchableOpacity onPress={goToPrev} style={styles.navBtn}>
          <Text style={styles.navArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity onPress={goToNext} style={styles.navBtn}>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dayLabelsRow}>
        {DAYS.map((d) => (
          <Text key={d} style={styles.dayLabel}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, index) => {
          if (day === null) return <View key={`blank-${index}`} style={styles.cell} />;

          const dateStr = toDateKey(new Date(currentYear, currentMonth, day).toISOString());
          const mood = moodMap[dateStr];
          const hasEntry = entryDays[dateStr];
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.cell,
                hasEntry && !mood && { backgroundColor: '#E6E6E6' },
                mood && { backgroundColor: getMoodColor(mood) },
                isToday && styles.todayCell,
              ]}
              onPress={() => onDayPress(new Date(currentYear, currentMonth, day).toISOString())}
            >
              <Text style={[styles.dayNumber, isToday && styles.todayText]}>{day}</Text>
              {mood && <Text style={styles.moodDot}>{getMoodEmoji(mood)}</Text>}
              {hasEntry && !mood && <Text style={styles.moodDot}>📝</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.legend}>
        {[
          { mood: 'very_bad' as MoodLevel, label: 'Very Bad' },
          { mood: 'bad' as MoodLevel, label: 'Bad' },
          { mood: 'neutral' as MoodLevel, label: 'Neutral' },
          { mood: 'good' as MoodLevel, label: 'Good' },
          { mood: 'great' as MoodLevel, label: 'Great' },
        ].map(({ mood, label }) => (
          <View key={label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getMoodColor(mood) }]} />
            <Text style={styles.legendLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function toDateKey(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
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
  navRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  navBtn:       { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  navArrow:     { fontSize: 24, color: Colors.primary, fontWeight: '600' },
  monthLabel:   { fontSize: 16, fontWeight: '600', color: Colors.text },
  dayLabelsRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  dayLabel:     { flex: 1, textAlign: 'center', fontSize: 12, color: Colors.secondary, fontWeight: '500' },
  grid:         { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 2,
  },
  todayCell:    { borderWidth: 2, borderColor: Colors.primary },
  dayNumber:    { fontSize: 13, color: Colors.text },
  todayText:    { fontWeight: 'bold', color: Colors.primary },
  moodDot:      { fontSize: 10, marginTop: 1 },
  legend:       { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md, flexWrap: 'wrap', gap: Spacing.xs },
  legendItem:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot:    { width: 10, height: 10, borderRadius: 5 },
  legendLabel:  { fontSize: 11, color: Colors.secondary },
});