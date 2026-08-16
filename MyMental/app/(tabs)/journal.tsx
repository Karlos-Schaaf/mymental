// app/(tabs)/journal.tsx
// Trello Card #19 - View Journal Home
// Inline mood selector + journal entry creation, recent entries list, mood calendar

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useJournalEntries, getMoodColor, getMoodEmoji, MoodLevel } from '../../src/hooks/useJournalEntries';
import MoodCalendar from '../../src/components/MoodCalendar';

const Colors = {
  primary: '#0A9B45',
  softGreen: '#EAF8EF',
  background: '#FFFFFF',
  border: '#E6E6E6',
  text: '#1E1E1E',
  secondary: '#7A7A7A',
  error: '#E74C3C',
};
const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const Radius = { sm: 10, md: 12, lg: 16 };

const MOODS: { level: MoodLevel; emoji: string; label: string }[] = [
  { level: 'very_bad', emoji: '😞', label: 'Very Bad' },
  { level: 'bad',      emoji: '😔', label: 'Bad' },
  { level: 'neutral',  emoji: '😐', label: 'Neutral' },
  { level: 'good',     emoji: '😊', label: 'Good' },
  { level: 'great',    emoji: '😁', label: 'Great' },
];

export default function JournalHomeScreen() {
  const router = useRouter();
  const { entries, addEntry } = useJournalEntries();

  const [selectedMood, setSelectedMood] = useState<MoodLevel | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const recentEntries = sortedEntries.slice(0, 3);

  const handleSave = () => {
    if (!content.trim()) {
      Alert.alert(
        'Empty Entry',
        'Please write something before saving.',
        [{ text: 'OK' }]
      );
      return;
    }
    addEntry({
      title: title.trim() || undefined,
      content: content.trim(),
      mood: selectedMood,
      createdAt: new Date().toISOString(),
    });
    setTitle('');
    setContent('');
    setSelectedMood(undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Journal</Text>
            <Text style={styles.subtitle}>A private space for your thoughts and reflections.</Text>
          </View>

          {/* Mood Selector */}
          <View style={styles.moodSection}>
            <Text style={styles.moodQuestion}>How are you feeling right now?</Text>
            <Text style={styles.moodSubtitle}>Your check-ins help you understand your emotional patterns.</Text>
            <View style={styles.moodRow}>
              {MOODS.map(({ level, emoji, label }) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.moodBtn,
                    selectedMood === level && styles.moodBtnSelected,
                  ]}
                  onPress={() => setSelectedMood(level)}
                  accessibilityLabel={`Mood: ${label}`}
                >
                  <Text style={styles.moodEmoji}>{emoji}</Text>
                  <Text style={[
                    styles.moodLabel,
                    selectedMood === level && styles.moodLabelSelected,
                  ]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Entry Input */}
          <View style={styles.entrySection}>
            <Text style={styles.entryHeading}>What's on your mind?</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.titleInput}
                placeholder="Entry title..."
                placeholderTextColor={Colors.secondary}
                value={title}
                onChangeText={setTitle}
                maxLength={80}
                accessibilityLabel="Journal entry title"
              />
              <View style={styles.divider} />
              <TextInput
                style={styles.contentInput}
                placeholder="Start writing... How are you feeling today?"
                placeholderTextColor={Colors.secondary}
                multiline
                value={content}
                onChangeText={setContent}
                textAlignVertical="top"
                maxLength={1000}
                accessibilityLabel="Journal entry content"
              />
              <Text style={styles.charCount}>{content.length}/1000</Text>
            </View>
          </View>

          {/* Save Entry Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            accessibilityLabel="Save journal entry"
          >
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>

          {/* Recent Entries */}
          <Text style={styles.sectionLabel}>Recent Entries</Text>
          {recentEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No entries yet. Start writing above!</Text>
            </View>
          ) : (
            recentEntries.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.entryRow}
                onPress={() => router.push(`/entry/entry-manage?id=${item.id}`)}
                accessibilityLabel={`Journal entry: ${item.title ?? item.content.slice(0, 30)}`}
              >
                <View style={[styles.emojiBox, { backgroundColor: getMoodColor(item.mood) }]}>
                  <Text style={styles.emojiText}>{getMoodEmoji(item.mood)}</Text>
                </View>
                <View style={styles.entryText}>
                  <Text style={styles.entryTitle} numberOfLines={1}>
                    {item.title ?? item.content.slice(0, 40) + (item.content.length > 40 ? '…' : '')}
                  </Text>
                  <Text style={styles.entryDate}>
                    {item.createdAt && !isNaN(new Date(item.createdAt).getTime())
                      ? new Date(item.createdAt).toLocaleDateString('en-NZ', {
                          month: 'long', day: 'numeric', year: 'numeric',
                        })
                      : 'No date'}
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

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.background },
  scroll:         { paddingBottom: Spacing.xl },
  header:         { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title:          { fontSize: 32, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.xs },
  subtitle:       { fontSize: 15, color: Colors.secondary },

  // Mood selector
  moodSection:    { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  moodQuestion:   { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  moodSubtitle:   { fontSize: 13, color: Colors.secondary, marginBottom: Spacing.md },
  moodRow:        { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 44,
    minHeight: 44,
  },
  moodBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.softGreen,
  },
  moodEmoji:      { fontSize: 28, marginBottom: Spacing.xs },
  moodLabel:      { fontSize: 11, color: Colors.secondary, textAlign: 'center' },
  moodLabelSelected: { color: Colors.primary, fontWeight: '600' },

  // Entry input
  entrySection:   { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  entryHeading:   { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  inputBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    backgroundColor: Colors.background,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },
  divider:        { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  contentInput: {
    fontSize: 15,
    color: Colors.text,
    minHeight: 120,
    lineHeight: 22,
  },
  charCount:      { fontSize: 12, color: Colors.secondary, textAlign: 'right', marginTop: Spacing.xs },

  // Save button
  saveButton: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },

  // Recent entries
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
});
