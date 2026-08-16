import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useJournalEntries, getMoodColor, getMoodEmoji} from '../../src/hooks/useJournalEntries';

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

export default function DayViewScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { entries } = useJournalEntries();

  const selectedDate = new Date(date);
  const dateKey = selectedDate.toISOString().split('T')[0];

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

  const formattedDate = selectedDate.toLocaleDateString('en-NZ', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Get mood for this day — use first entry's mood or undefined
  // TODO: replace with real mood store lookup when teammate's feature is ready
  const dayMood = dayEntries[0]?.mood;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            router.dismissAll();
            router.replace('/(tabs)/journal');
          }} 
          accessibilityLabel="Go back to Journal"
>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{formattedDate}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Mood Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mood</Text>
          {dayMood ? (
            <View style={[styles.moodBadge, { backgroundColor: getMoodColor(dayMood) }]}>
              <Text style={styles.moodEmoji}>{getMoodEmoji(dayMood)}</Text>
              <Text style={styles.moodText}>
                {dayMood.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </Text>
            </View>
          ) : (
            // TODO: once mood store is connected, this will show real mood data
            <View style={styles.emptyMood}>
              <Text style={styles.emptyText}>No mood logged for this day.</Text>
            </View>
          )}
        </View>

        {/* Journal Entries Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Journal</Text>
          {dayEntries.length === 0 ? (
            <View style={styles.emptyJournal}>
              <Text style={styles.emptyText}>No journal entry for this day.</Text>
              <TouchableOpacity
                style={styles.addEntryBtn}
                onPress={() => router.push('/entry/new-journal')}
              >
                <Text style={styles.addEntryText}>+ Add Entry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            dayEntries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.entryCard}
                onPress={() => router.push(`/entry/entry-manage?id=${entry.id}`)}
                accessibilityLabel="View journal entry"
              >
                <Text style={styles.entryContent} numberOfLines={4}>
                  {entry.content}
                </Text>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  backButton:   { fontSize: 15, color: Colors.secondary, minWidth: 60 },
  title:        { fontSize: 16, fontWeight: '600', color: Colors.text, textAlign: 'center', flex: 1 },
  scroll:       { flex: 1 },
  section:      { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  sectionLabel: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    gap: Spacing.sm,
  },
  moodEmoji:    { fontSize: 28 },
  moodText:     { fontSize: 16, fontWeight: '600', color: Colors.text },
  emptyMood: {
    padding: Spacing.md,
    backgroundColor: Colors.softGreen,
    borderRadius: Radius.lg,
  },
  emptyJournal: {
    padding: Spacing.md,
    backgroundColor: Colors.softGreen,
    borderRadius: Radius.lg,
    alignItems: 'flex-start',
  },
  emptyText:    { fontSize: 15, color: Colors.secondary },
  addEntryBtn:  { marginTop: Spacing.sm },
  addEntryText: { fontSize: 15, color: Colors.primary, fontWeight: '600' },
  entryCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  entryContent: { fontSize: 15, color: Colors.text, lineHeight: 24 },
  entryTime:    { fontSize: 13, color: Colors.secondary, marginTop: Spacing.sm },
});
