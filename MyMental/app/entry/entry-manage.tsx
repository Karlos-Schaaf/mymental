import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, Alert, ScrollView, KeyboardAvoidingView, Platform,
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

export default function EntryManageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { entries, updateEntry, deleteEntry } = useJournalEntries();

  const entry = entries.find((e) => e.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(entry?.title ?? '');
  const [editedContent, setEditedContent] = useState(entry?.content ?? '');
  const [editedMood, setEditedMood] = useState<MoodLevel | undefined>(entry?.mood);

useEffect(() => {
  if (entry) {
    setEditedTitle(entry.title ?? '');
    setEditedContent(entry.content);
    setEditedMood(entry.mood);
  }
}, [entry]);

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centred}>
          <Text style={styles.errorText}>Entry not found.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = entry.createdAt && !isNaN(new Date(entry.createdAt).getTime())
    ? new Date(entry.createdAt).toLocaleDateString('en-NZ', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'No date';

  const formattedTime = entry.createdAt && !isNaN(new Date(entry.createdAt).getTime())
    ? new Date(entry.createdAt).toLocaleTimeString('en-NZ', {
        hour: '2-digit', minute: '2-digit',
      })
    : 'No time';

  // Trello Card #7 - save edits including mood
  const handleSave = () => {
    if (!editedContent.trim()) {
      Alert.alert('Empty Entry', 'Entry cannot be empty.', [{ text: 'OK' }]);
      return;
    }
    // Acceptance Test: updated content replaces previous version
    updateEntry({
      ...entry,
      title: editedTitle.trim() || undefined,
      content: editedContent.trim(),
      mood: editedMood,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(entry.title ?? '');
    setEditedContent(entry.content);
    setEditedMood(entry.mood);
    setIsEditing(false);
  };

  // Trello Card #2 - delete with confirmation
  const handleDelete = () => {
    // Acceptance Test: confirmation prompt before deletion
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          // Acceptance Test: entry removed from journal history on confirm
          onPress: () => {
            deleteEntry(entry.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            style={styles.headerBtn}
          >
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>

          {isEditing ? (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleCancelEdit} style={styles.headerBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.headerActions}>
              {/* Trello Card #7 — Edit */}
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={styles.headerBtn}
                accessibilityLabel="Edit entry"
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              {/* Trello Card #2 — Delete */}
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.headerBtn}
                accessibilityLabel="Delete entry"
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Date & Time */}
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{formattedDate}</Text>
            <Text style={styles.timeText}>{formattedTime}</Text>
          </View>

          {/* Mood Display / Edit */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Mood</Text>
            {isEditing ? (
              // Editable mood selector
              <View style={styles.moodRow}>
                {MOODS.map(({ level, emoji, label }) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.moodBtn,
                      editedMood === level && styles.moodBtnSelected,
                    ]}
                    onPress={() => setEditedMood(level)}
                    accessibilityLabel={`Mood: ${label}`}
                  >
                    <Text style={styles.moodEmoji}>{emoji}</Text>
                    <Text style={[
                      styles.moodLabel,
                      editedMood === level && styles.moodLabelSelected,
                    ]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              // Mood display
              entry.mood ? (
                <View style={[styles.moodBadge, { backgroundColor: getMoodColor(entry.mood) }]}>
                  <Text style={styles.moodBadgeEmoji}>{getMoodEmoji(entry.mood)}</Text>
                  <Text style={styles.moodBadgeText}>
                    {MOODS.find(m => m.level === entry.mood)?.label ?? entry.mood}
                  </Text>
                </View>
              ) : (
                <View style={styles.noMood}>
                  <Text style={styles.noMoodText}>No mood recorded</Text>
                </View>
              )
            )}
          </View>

          {/* Entry Content */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Entry</Text>
            {isEditing ? (
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.titleInput}
                  value={editedTitle}
                  onChangeText={setEditedTitle}
                  placeholder="Entry title..."
                  placeholderTextColor={Colors.secondary}
                  maxLength={80}
                  accessibilityLabel="Edit entry title"
                />
                <View style={styles.divider} />
                <TextInput
                  style={styles.contentInput}
                  value={editedContent}
                  onChangeText={setEditedContent}
                  multiline
                  autoFocus
                  textAlignVertical="top"
                  maxLength={1000}
                  accessibilityLabel="Edit journal entry content"
                />
              </View>
            ) : (
              <View style={styles.contentDisplay}>
                {entry.title ? (
                  <Text style={styles.displayTitle}>{entry.title}</Text>
                ) : null}
                <Text style={styles.displayContent}>{entry.content}</Text>
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.background },
  scroll:         { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBtn:      { minWidth: 44, minHeight: 44, justifyContent: 'center' },
  headerActions:  { flexDirection: 'row', gap: Spacing.md },
  backButton:     { fontSize: 15, color: Colors.secondary },
  editText:       { fontSize: 15, fontWeight: '600', color: Colors.primary },
  deleteText:     { fontSize: 15, fontWeight: '600', color: Colors.error },
  saveText:       { fontSize: 15, fontWeight: '600', color: Colors.primary },
  cancelText:     { fontSize: 15, color: Colors.secondary },
  dateBadge:      { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  dateText:       { fontSize: 16, fontWeight: '600', color: Colors.text },
  timeText:       { fontSize: 13, color: Colors.secondary, marginTop: Spacing.xs },
  section:        { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  sectionLabel:   { fontSize: 14, fontWeight: '600', color: Colors.secondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Mood display
  moodRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  moodBtn: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 44,
    minHeight: 44,
  },
  moodBtnSelected: { borderColor: Colors.primary, backgroundColor: Colors.softGreen },
  moodEmoji:      { fontSize: 24, marginBottom: 2 },
  moodLabel:      { fontSize: 10, color: Colors.secondary, textAlign: 'center' },
  moodLabelSelected: { color: Colors.primary, fontWeight: '600' },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    gap: Spacing.sm,
    alignSelf: 'flex-start',
  },
  moodBadgeEmoji: { fontSize: 24 },
  moodBadgeText:  { fontSize: 15, fontWeight: '600', color: Colors.text },
  noMood: {
    padding: Spacing.md,
    backgroundColor: Colors.softGreen,
    borderRadius: Radius.lg,
    alignSelf: 'flex-start',
  },
  noMoodText:     { fontSize: 14, color: Colors.secondary },

  // Entry content
  inputBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.md,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },
  divider:        { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  contentInput:   { fontSize: 15, color: Colors.text, lineHeight: 24, minHeight: 200 },
  contentDisplay: { paddingTop: Spacing.xs },
  displayTitle:   { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  displayContent: { fontSize: 15, color: Colors.text, lineHeight: 26 },

  centred:        { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText:      { fontSize: 16, color: Colors.secondary, marginBottom: Spacing.md },
  linkText:       { fontSize: 15, color: Colors.primary },
});
