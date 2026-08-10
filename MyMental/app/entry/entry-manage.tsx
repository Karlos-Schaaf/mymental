import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useJournalEntries } from '../../src/hooks/useJournalEntries';

const Colors = {
  primary: '#0A9B45',
  background: '#FFFFFF',
  border: '#E6E6E6',
  text: '#1E1E1E',
  secondary: '#7A7A7A',
  error: '#E74C3C',
};

const Spacing = { xs: 4, sm: 8, md: 16, lg: 24 };
const Radius = { sm: 10, lg: 16 };

export default function EntryManageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { entries, updateEntry, deleteEntry } = useJournalEntries();

  const entry = entries.find((e) => e.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(entry?.content ?? '');

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centred}>
          <Text style={styles.errorText}>Entry not found.</Text>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = new Date(entry.date).toLocaleDateString('en-NZ', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const formattedTime = new Date(entry.date).toLocaleTimeString('en-NZ', {
    hour: '2-digit', minute: '2-digit',
  });

  // Trello Card #7 - save edits
  const handleSave = () => {
    if (!editedContent.trim()) {
      Alert.alert('Empty Entry', 'Entry cannot be empty.', [{ text: 'OK' }]);
      return;
    }
    // Acceptance Test: updated content replaces previous version
    updateEntry({ ...entry, content: editedContent.trim() });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(entry.content);
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
            onPress={() => {
              router.dismissAll();
              router.replace('/(tabs)/journal');
            }} 
            accessibilityLabel="Go back to Journal"
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
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.headerBtn} accessibilityLabel="Edit entry">
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              {/* Trello Card #2 — Delete */}
              <TouchableOpacity onPress={handleDelete} style={styles.headerBtn} accessibilityLabel="Delete entry">
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Date & Time */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.timeText}>{formattedTime}</Text>
        </View>

        {/* Entry Content — Trello Card #14: full entry displayed */}
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {isEditing ? (
            // Trello Card #7: existing content becomes editable
            <TextInput
              style={styles.editInput}
              value={editedContent}
              onChangeText={setEditedContent}
              multiline
              autoFocus
              textAlignVertical="top"
              maxLength={1000}
              accessibilityLabel="Edit journal entry"
            />
          ) : (
            <Text style={styles.entryContent}>{entry.content}</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton:       { fontSize: 15, color: Colors.secondary },
  headerActions:    { flexDirection: 'row', gap: Spacing.md },
  headerBtn:        { minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  editText:         { fontSize: 15, fontWeight: '600', color: Colors.primary },
  deleteText:       { fontSize: 15, fontWeight: '600', color: Colors.error },
  saveText:         { fontSize: 15, fontWeight: '600', color: Colors.primary },
  cancelText:       { fontSize: 15, color: Colors.secondary },
  dateBadge:        { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  dateText:         { fontSize: 16, fontWeight: '600', color: Colors.text },
  timeText:         { fontSize: 13, color: Colors.secondary, marginTop: Spacing.xs },
  contentContainer: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  entryContent:     { fontSize: 15, color: Colors.text, lineHeight: 26 },
  editInput:        { fontSize: 15, color: Colors.text, lineHeight: 26, minHeight: 300 },
  centred:          { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText:        { fontSize: 16, color: Colors.secondary, marginBottom: Spacing.md },
  linkText:         { fontSize: 15, color: Colors.primary },
});
