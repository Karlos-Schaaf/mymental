// app/entry/day-view.tsx
// Opens when user taps a day on the MoodCalendar
// Shows all entries for that day with mood

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useJournalEntries, getMoodColor, getMoodEmoji, MoodLevel } from '../../src/hooks/useJournalEntries';

const Colors = {
  primary: '#0A9B45',
  softGreen: '#EAF8EF',
  background: '#FFFFFF',
  border: '#E6E6E6',
  text: '#1E1E1E',
  secondary: '#7A7A7A',
};

const Spacing = { xs: 4, sm: 8, md: 16, lg: 24 };
const Radius = { lg: 16 };

const MOOD_LABELS: Record<string, string> = {
  very_bad: 'Very Bad',
  bad: 'Bad',
  neutral: 'Neutral',
  good: 'Good',
  great: 'Great',
};

export default function DayViewScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { entries } = useJournalEntries();

  const selectedDate = new Date(date);
  const dateKey = toDateKey(date);

  const dayEntries = entries.filter((e) => {
    try {
      if (!e.createdAt) return false;
      const d = new Date(e.createdAt);
      if (isNaN(d.getTime())) return false;
      return d.toISOString().split('T')[0] === dateKey;
    } catch {
      return false;
    }
  });

  const formattedDate = !isNaN(selectedDate.getTime())
    ? selectedDate.toLocaleDateString('en-NZ', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'Selected Day';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          style={styles.headerBtn}
        >
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{formattedDate}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {dayEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No entries for this day</Text>
            <Text style={styles.emptyText}>Go back to the journal to add one.</Text>
          </View>
        ) : (
          dayEntries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() => router.push(`/entry/entry-manage?id=${entry.id}`)}
              accessibilityLabel="View journal entry"
            >
              {/* Mood badge */}
              {entry.mood && (
                <View style={[styles.moodBadge, { backgroundColor: getMoodColor(entry.mood) }]}>
                  <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
                  <Text style={styles.moodLabel}>
                    {MOOD_LABELS[entry.mood] ?? entry.mood}
                  </Text>
                </View>
              )}

              {/* Title */}
              {entry.title ? (
                <Text style={styles.entryTitle}>{entry.title}</Text>
              ) : null}

              {/* Content preview */}
              <Text style={styles.entryContent} numberOfLines={4}>
                {entry.content}
              </Text>

              {/* Time */}
              <Text style={styles.entryTime}>
                {entry.createdAt && !isNaN(new Date(entry.createdAt).getTime())
                  ? new Date(entry.createdAt).toLocaleTimeString('en-NZ', {
                      hour: '2-digit', minute: '2-digit',
                    })
                  : 'No time'}
              </Text>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
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
  container:    { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBtn:    { minWidth: 44, minHeight: 44, justifyContent: 'center' },
  backButton:   { fontSize: 15, color: Colors.secondary },
  title:        { fontSize: 15, fontWeight: '600', color: Colors.text, flex: 1, textAlign: 'center' },
  scroll:       { flex: 1, padding: Spacing.lg },
  emptyState:   { alignItems: 'center', paddingTop: 60 },
  emptyTitle:   { fontSize: 18, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  emptyText:    { fontSize: 15, color: Colors.secondary },
  entryCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
    gap: 4,
  },
  moodEmoji:    { fontSize: 16 },
  moodLabel:    { fontSize: 13, fontWeight: '600', color: Colors.text },
  entryTitle:   { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  entryContent: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  entryTime:    { fontSize: 12, color: Colors.secondary, marginTop: Spacing.sm },
});
