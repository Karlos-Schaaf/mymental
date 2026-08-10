import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useJournalEntries, getMoodColor, getMoodEmoji } from '../../src/hooks/useJournalEntries';
import MoodCalendar from '../../src/components/MoodCalendar';

const Colors = {
  primary: '#0A9B45',
  softGreen: '#EAF8EF',
  background: '#FFFFFF',
  border: '#E6E6E6',
  text: '#1E1E1E',
  secondary: '#7A7A7A',
};
const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const Radius = { md: 12, lg: 16 };

export default function JournalHomeScreen() {
  const router = useRouter();
  const { entries } = useJournalEntries();

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recentEntries = sortedEntries.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Journal</Text>
          <Text style={styles.subtitle}>A private space for your thoughts and reflections.</Text>
        </View>

        {/* Quick Write Box */}
        <TouchableOpacity
          style={styles.quickBox}
          onPress={() => router.push('/entry/new-journal')}
          accessibilityLabel="Start writing a new journal entry"
        >
          <Text style={styles.quickPlaceholder}>Start writing... How are you feeling today?</Text>
          <Text style={styles.charCount}>0/1000</Text>
        </TouchableOpacity>

        {/* Recent Entries */}
        <Text style={styles.sectionLabel}>Recent Entries</Text>

        {recentEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No entries yet. Tap above to start writing!</Text>
          </View>
        ) : (
          recentEntries.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.entryRow}
              onPress={() => router.push(`/entry/entry-manage?id=${item.id}`)}
              accessibilityLabel={`Journal entry: ${item.title}`}
            >
              <View style={[styles.emojiBox, { backgroundColor: getMoodColor(item.mood) }]}>
                <Text style={styles.emojiText}>{getMoodEmoji(item.mood)}</Text>
              </View>
              <View style={styles.entryText}>
                <Text style={styles.entryTitle} numberOfLines={1}>
                  {item.title ?? item.content.slice(0, 40) + (item.content.length > 40 ? '…' : '')}
                </Text>
                <Text style={styles.entryDate}>
                  {new Date(item.date).toLocaleDateString('en-NZ', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))
        )}

        {/* Mood Calendar */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>Mood Calendar</Text>
        <MoodCalendar
          entries={entries}
          onDayPress={(date) =>
            router.push({ pathname: '/entry/day-view', params: { date } })
          }
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* New Entry Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.newEntryButton}
          onPress={() => router.push('/entry/new-journal')}
          accessibilityLabel="Create a new journal entry"
        >
          <Text style={styles.newEntryText}>+ New Entry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.background },
  scroll:         { paddingBottom: Spacing.xl },
  header:         { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title:          { fontSize: 32, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.xs },
  subtitle:       { fontSize: 15, color: Colors.secondary },
  quickBox: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: Spacing.md,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  quickPlaceholder: { fontSize: 15, color: Colors.secondary },
  charCount:      { fontSize: 13, color: Colors.secondary, textAlign: 'right', marginTop: Spacing.xs },
  sectionLabel:   { fontSize: 16, fontWeight: '600', color: Colors.text, paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 44,
  },
  emojiBox: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.md,
  },
  emojiText:      { fontSize: 18 },
  entryText:      { flex: 1 },
  entryTitle:     { fontSize: 15, fontWeight: '500', color: Colors.text },
  entryDate:      { fontSize: 13, color: Colors.secondary, marginTop: 2 },
  chevron:        { fontSize: 20, color: Colors.secondary },
  emptyState:     { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  emptyText:      { fontSize: 15, color: Colors.secondary },
  footer: {
    position: 'absolute', bottom: Spacing.xl,
    left: Spacing.lg, right: Spacing.lg,
  },
  newEntryButton: {
    backgroundColor: Colors.primary, height: 52,
    borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  newEntryText:   { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});