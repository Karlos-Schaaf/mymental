import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useJournalEntries } from '../../src/hooks/useJournalEntries';

const Colors = {
  primary: '#0A9B45',
  background: '#FFFFFF',
  border: '#E6E6E6',
  text: '#1E1E1E',
  secondary: '#7A7A7A',
};

const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const Radius = { sm: 10, md: 12 };

export default function NewJournalScreen() {
  const router = useRouter();
  const { prefill } = useLocalSearchParams<{ prefill?: string }>();
  const { addEntry } = useJournalEntries();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(prefill ?? '');

  const handleSave = () => {
    // Acceptance Test: prompt if no content
    if (!content.trim()) {
      Alert.alert(
        'Empty Entry',
        'Please write something before saving, or discard this entry.',
        [
          { text: 'Keep Writing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
      return;
    }

    // Acceptance Test: entry stored with date and time
    const now = new Date();
            addEntry({
      title: title.trim() || undefined,
      content: content.trim(),
      date: now.toISOString(),
    });

    router.back();
  };

  const handleDiscard = () => {
    if (content.trim()) {
      Alert.alert('Discard Entry', 'Are you sure you want to discard this entry?', [
        { text: 'Keep Writing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleDiscard} accessibilityLabel="Go back">
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Entry</Text>
          <TouchableOpacity onPress={handleSave} accessibilityLabel="Save journal entry">
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Date */}
        <Text style={styles.dateLabel}>
          {new Date().toLocaleDateString('en-NZ', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </Text>

        {/* Input */}
        <ScrollView style={styles.inputContainer} keyboardShouldPersistTaps="handled">
          <TextInput
            style={styles.titleInput}
            placeholder="Title (optional)"
            placeholderTextColor={Colors.secondary}
            value={title}
            onChangeText={setTitle}
            maxLength={80}
            accessibilityLabel="Journal entry title"
          />
          <TextInput
            style={styles.input}
            placeholder="Start writing... How are you feeling today?"
            placeholderTextColor={Colors.secondary}
            multiline
            value={content}
            onChangeText={setContent}
            autoFocus
            textAlignVertical="top"
            maxLength={1000}
            accessibilityLabel="Journal entry text input"
          />
        </ScrollView>

        <Text style={styles.charCount}>{content.length}/1000</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton:     { fontSize: 15, color: Colors.secondary },
  title:          { fontSize: 18, fontWeight: '600', color: Colors.text },
  saveButton:     { fontSize: 16, fontWeight: '600', color: Colors.primary },
  dateLabel:      { fontSize: 13, color: Colors.secondary, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  inputContainer: { flex: 1, paddingHorizontal: Spacing.lg },
  input:          { fontSize: 15, color: Colors.text, lineHeight: 24, minHeight: 300, paddingTop: Spacing.sm },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  charCount:      { fontSize: 13, color: Colors.secondary, textAlign: 'right', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
});
