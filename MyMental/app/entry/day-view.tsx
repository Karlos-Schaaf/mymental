// app/entry/day-view.tsx
// Shows all entries for a selected day
// Allows adding a new entry for past dates (not future dates)

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, TextInput, Alert,
  KeyboardAvoidingView, Platform,
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
  error: '#E74C3C',
};
const Spacing = { xs: 4, sm: 8, md: 16, lg: 24 };
const Radius = { sm: 10, md: 12, lg: 16 };

const MOODS: { level: MoodLevel; emoji: string; label: string }[] = [
  { level: 'very_bad', emoji: '😞', label: 'Very Bad' },
  { level: 'bad',      emoji: '😔', label: 'Bad' },
  { level: 'neutral',  emoji: '😐', label: 'Neutral' },
  { level: 'good',     emoji: '😊', label: 'Good' },
  { level: 'great',    emoji: '😁', label: 'Great' },
];

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
  const { entries, addEntry, refresh } = useJournalEntries();

  const [showForm, setShowForm] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodLevel | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const isPastOrToday = selectedDate <= today;
  const isFuture = selectedDate > today;

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

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.', [{ text: 'OK' }]);
      return;
    }
    const entryDate = new Date(selectedDate);
    entryDate.setUTCHours(12, 0, 0, 0);
    console.log('Saving entry for date:', entryDate.toISOString());
    await addEntry({
      title: title.trim() || undefined,
      content: content.trim(),
      mood: selectedMood,
      createdAt: entryDate.toISOString(),
      updatedAt: entryDate.toISOString(),
    });
    setTitle('');
    setContent('');
    setSelectedMood(undefined);
    setShowForm(false);
  };

  const handleDiscard = () => {
    if (content.trim() || title.trim()) {
      Alert.alert('Discard Entry', 'Are you sure you want to discard this entry?', [
        { text: 'Keep Writing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            setTitle('');
            setContent('');
            setSelectedMood(undefined);
            setShowForm(false);
          },
        },
      ]);
    } else {
      setShowForm(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} accessibilityLabel="Go back">
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>{formattedDate}</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Existing entries */}
          {dayEntries.length === 0 && !showForm ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No entries for this day</Text>
              {isFuture ? (
                <Text style={styles.emptyText}>You can't add entries for future dates.</Text>
              ) : (
                <Text style={styles.emptyText}>Tap below to add an entry for this day.</Text>
              )}
            </View>
          ) : (
            dayEntries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.entryCard}
                onPress={() => router.push(`/entry/entry-manage?id=${entry.id}`)}
                accessibilityLabel="View journal entry"
              >
                {entry.mood && (
                  <View style={[styles.moodBadge, { backgroundColor: getMoodColor(entry.mood) }]}>
                    <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
                    <Text style={styles.moodLabel}>{MOOD_LABELS[entry.mood] ?? entry.mood}</Text>
                  </View>
                )}
                {entry.title ? <Text style={styles.entryTitle}>{entry.title}</Text> : null}
                <Text style={styles.entryContent} numberOfLines={4}>{entry.content}</Text>
                <Text style={styles.entryTime}>
                  {entry.createdAt && !isNaN(new Date(entry.createdAt).getTime())
                    ? new Date(entry.createdAt).toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' })
                    : 'No time'}
                </Text>
              </TouchableOpacity>
            ))
          )}

          {/* Add entry button — past/today only */}
          {isPastOrToday && !showForm && (
            <TouchableOpacity
              style={styles.addEntryBtn}
              onPress={() => setShowForm(true)}
              accessibilityLabel="Add journal entry for this day"
            >
              <Text style={styles.addEntryText}>+ Add Entry for This Day</Text>
            </TouchableOpacity>
          )}

          {/* Inline form */}
          {showForm && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>New Entry for {formattedDate}</Text>

              <Text style={styles.formLabel}>How were you feeling?</Text>
              <View style={styles.moodRow}>
                {MOODS.map(({ level, emoji, label }) => (
                  <TouchableOpacity
                    key={level}
                    style={[styles.moodBtn, selectedMood === level && styles.moodBtnSelected]}
                    onPress={() => setSelectedMood(level)}
                    accessibilityLabel={`Mood: ${label}`}
                  >
                    <Text style={styles.moodBtnEmoji}>{emoji}</Text>
                    <Text style={[styles.moodBtnLabel, selectedMood === level && styles.moodBtnLabelSelected]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputBox}>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Entry title..."
                  placeholderTextColor={Colors.secondary}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={80}
                />
                <View style={styles.divider} />
                <TextInput
                  style={styles.contentInput}
                  placeholder="What happened that day?"
                  placeholderTextColor={Colors.secondary}
                  multiline
                  value={content}
                  onChangeText={setContent}
                  textAlignVertical="top"
                  maxLength={1000}
                />
                <Text style={styles.charCount}>{content.length}/1000</Text>
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard}>
                  <Text style={styles.discardText}>Discard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveText}>Save Entry</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  container:            { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerBtn:            { minWidth: 44, minHeight: 44, justifyContent: 'center' },
  backButton:           { fontSize: 15, color: Colors.secondary },
  title:                { fontSize: 15, fontWeight: '600', color: Colors.text, flex: 1, textAlign: 'center' },
  scroll:               { flex: 1, padding: Spacing.lg },
  emptyState:           { alignItems: 'center', paddingTop: 40, paddingBottom: Spacing.lg },
  emptyTitle:           { fontSize: 18, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  emptyText:            { fontSize: 15, color: Colors.secondary, textAlign: 'center' },
  entryCard: {
    backgroundColor: Colors.background, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  moodBadge: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 4,
    paddingHorizontal: Spacing.sm, borderRadius: 20, alignSelf: 'flex-start',
    marginBottom: Spacing.sm, gap: 4,
  },
  moodEmoji:            { fontSize: 16 },
  moodLabel:            { fontSize: 13, fontWeight: '600', color: Colors.text },
  entryTitle:           { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  entryContent:         { fontSize: 15, color: Colors.text, lineHeight: 22 },
  entryTime:            { fontSize: 12, color: Colors.secondary, marginTop: Spacing.sm },
  addEntryBtn: {
    borderWidth: 1, borderColor: Colors.primary, borderRadius: Radius.md,
    padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm, marginBottom: Spacing.md,
  },
  addEntryText:         { fontSize: 15, fontWeight: '600', color: Colors.primary },
  formContainer: {
    marginTop: Spacing.md, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.lg, padding: Spacing.md,
  },
  formTitle:            { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md },
  formLabel:            { fontSize: 14, color: Colors.secondary, marginBottom: Spacing.sm },
  moodRow:              { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  moodBtn: {
    alignItems: 'center', padding: Spacing.sm, borderRadius: Radius.md,
    borderWidth: 2, borderColor: 'transparent', minWidth: 44, minHeight: 44,
  },
  moodBtnSelected:      { borderColor: Colors.primary, backgroundColor: Colors.softGreen },
  moodBtnEmoji:         { fontSize: 24, marginBottom: 2 },
  moodBtnLabel:         { fontSize: 10, color: Colors.secondary, textAlign: 'center' },
  moodBtnLabelSelected: { color: Colors.primary, fontWeight: '600' },
  inputBox: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  titleInput:           { fontSize: 16, fontWeight: '600', color: Colors.text, paddingVertical: Spacing.sm, minHeight: 44 },
  divider:              { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  contentInput:         { fontSize: 15, color: Colors.text, minHeight: 120, lineHeight: 22 },
  charCount:            { fontSize: 12, color: Colors.secondary, textAlign: 'right', marginTop: Spacing.xs },
  formActions:          { flexDirection: 'row', gap: Spacing.md },
  discardBtn: {
    flex: 1, height: 48, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  discardText:          { fontSize: 15, color: Colors.secondary },
  saveBtn: {
    flex: 2, height: 48, borderRadius: Radius.md,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  saveText:             { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
});
