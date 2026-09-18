import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import WriteStep from '../../../src/components/entrySteps/WriteStep';
import { useNewEntry } from '../../../src/context/NewEntryContext';
import { useJournalEntries } from '../../../src/hooks/useJournalEntries';

export default function WriteStepScreen() {
  const { draft, updateDraft, resetDraft } = useNewEntry();
  const { addEntry } = useJournalEntries();
  const [saving, setSaving] = useState(false);

  const save = async (contentOverride?: string) => {
    if (!draft.mood) {
      // Shouldn't happen — the Mood step disables Continue until one is
      // picked — but guards against reaching this screen any other way,
      // and narrows draft.mood to MoodLevel (not MoodLevel | undefined)
      // for the addEntry call below.
      Alert.alert(
        'Missing mood',
        "Please go back and select how you're feeling first.",
      );
      return;
    }

    setSaving(true);
    try {
      await addEntry({
        title: draft.title?.trim() || undefined,
        content: (contentOverride ?? draft.content ?? '').trim(),
        mood: draft.mood,
        stress: draft.stress,
        energy: draft.energy,
        createdAt: new Date().toISOString(),
      });
      resetDraft();
      router.replace('/');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save your entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <StepScaffold
      stepKey="write"
      title="What's on your mind?"
      subtitle="Optional — write as much or as little as you like."
      skippable
      onSkip={() => save('')}
      onContinue={() => save()}
      continueLabel={saving ? 'Saving…' : 'Save Entry'}
      continueDisabled={saving}
    >
      <WriteStep
        title={draft.title ?? ''}
        content={draft.content ?? ''}
        onTitleChange={(title) => updateDraft({ title })}
        onContentChange={(content) => updateDraft({ content })}
      />
    </StepScaffold>
  );
}
