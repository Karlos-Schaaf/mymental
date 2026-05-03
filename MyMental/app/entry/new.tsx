import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEntriesStore } from '../../store/entriesStore';
import { getDailyPrompt } from '../src/constants/prompts';
import { colors, fonts, spacing, radius, moods } from '../src/constants/theme';
import MoodChip from '../src/components/MoodChip';
import Slider from '@react-native-community/slider';

export default function NewEntryScreen() {
  const router = useRouter();
  const { addEntry } = useEntriesStore();
  const prompt = getDailyPrompt();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState(5);

  const today = new Date().toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const handleSave = () => {
    if (!body.trim()) {
      Alert.alert('Nothing to save', 'Write a little something first.');
      return;
    }
    addEntry({
      title: title.trim() || prompt.slice(0, 40),
      body: body.trim(),
      mood,
      energy: Math.round(energy),
      prompt,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerLabel}>New entry</Text>
            <Text style={styles.headerDate}>{today}</Text>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Prompt */}
          <View style={styles.promptCard}>
            <Text style={styles.promptText}>{prompt}</Text>
          </View>

          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Title (optional)</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Give this entry a name…"
              placeholderTextColor={colors.mutedLight}
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />
          </View>

          {/* Body */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Your reflection</Text>
            <TextInput
              style={styles.bodyInput}
              placeholder="Start writing… there's no wrong answer here."
              placeholderTextColor={colors.mutedLight}
              value={body}
              onChangeText={setBody}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Mood */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>How are you feeling?</Text>
            <View style={styles.moodRow}>
              {moods.map((m) => (
                <MoodChip
                  key={m.label}
                  label={m.label}
                  selected={mood === m.label}
                  onPress={() => setMood(mood === m.label ? '' : m.label)}
                />
              ))}
            </View>
          </View>

          {/* Energy */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Energy level</Text>
            <View style={styles.energyRow}>
              <Text style={styles.energyEndLabel}>Low</Text>
              <Slider
                style={{ flex: 1 }}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={energy}
                onValueChange={setEnergy}
                minimumTrackTintColor={colors.coral}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.coral}
              />
              <Text style={styles.energyEndLabel}>High</Text>
              <Text style={styles.energyVal}>{Math.round(energy)}</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  header: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(253,248,243,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(253,248,243,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 16,
    color: colors.paper,
  },
  headerText: {
    flex: 1,
  },
  headerLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: '#A09890',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  headerDate: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.paper,
  },
  saveBtn: {
    backgroundColor: colors.coral,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveBtnText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.paper,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 48,
    gap: spacing.xl,
  },
  promptCard: {
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: '#D0CCF0',
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  promptText: {
    fontFamily: fonts.serif,
    fontSize: 16,
    color: colors.accent,
    lineHeight: 23,
  },
  field: {
    gap: spacing.sm,
  },
  fieldLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  titleInput: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
  },
  bodyInput: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 22,
    minHeight: 140,
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  energyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  energyEndLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedLight,
  },
  energyVal: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.coral,
    minWidth: 22,
    textAlign: 'right',
  },
});
