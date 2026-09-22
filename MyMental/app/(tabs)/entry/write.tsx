import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import WriteStep from '../../../src/components/entrySteps/WriteStep';
import { useNewEntry } from '../../../src/context/NewEntryContext';
import { useJournalEntries } from '../../../src/hooks/useJournalEntries';

function getEntryCreatedAt(entryDate?: string): string {
  if (!entryDate) {
    return new Date().toISOString();
  }

  const [year, month, day] = entryDate
    .split('-')
    .map(Number);

  const now = new Date();

  const localDate = new Date(
    year,
    month - 1,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  );

  return localDate.toISOString();
}

export default function WriteStepScreen() {
  const {
    draft,
    updateDraft,
    resetDraft,
  } = useNewEntry();

  const {
    addEntry,
    updateEntry,
  } = useJournalEntries();

  const [saving, setSaving] = useState(false);

  const save = async (contentOverride?: string) => {
    if (!draft.mood) {
      Alert.alert(
        'Missing mood',
        "Please go back and select how you're feeling first.",
      );
      return;
    }

    setSaving(true);

    try {
      const content =
        contentOverride ?? draft.content ?? '';

      if (draft.id) {
        // Editing an existing entry.
        // Keep its original timestamp so editing does not
        // accidentally move the entry to a different time/day.
        await updateEntry({
          id: draft.id,
          title: draft.title,
          content,
          mood: draft.mood,
          sleepHours: draft.sleepHours,
          physicalActivity: draft.physicalActivity,
          socialInteraction: draft.socialInteraction,
          productivity: draft.productivity,
          screenTime: draft.screenTime,
          stress: draft.stress,
          energy: draft.energy,
          createdAt:
            draft.createdAt ??
            getEntryCreatedAt(draft.entryDate),
        });
      } else {
        // Creating a new entry.
        await addEntry({
          title: draft.title,
          content,
          mood: draft.mood,
          sleepHours: draft.sleepHours,
          physicalActivity: draft.physicalActivity,
          socialInteraction: draft.socialInteraction,
          productivity: draft.productivity,
          screenTime: draft.screenTime,
          stress: draft.stress,
          energy: draft.energy,
          createdAt: getEntryCreatedAt(
            draft.entryDate,
          ),
        });
      }

      resetDraft();
      router.replace('/journal');
    } catch (e) {
      console.error(e);

      Alert.alert(
        'Error',
        draft.id
          ? 'Could not update your entry. Please try again.'
          : 'Could not save your entry. Please try again.',
      );
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
      continueLabel={
        saving ? 'Saving…' : 'Save Entry'
      }
      continueDisabled={
        saving || !draft.content?.trim()
      }
      centerContent={false}
      entryDate={draft.entryDate}
    >
      <WriteStep
        title={draft.title ?? ''}
        content={draft.content ?? ''}
        onTitleChange={(title) =>
          updateDraft({ title })
        }
        onContentChange={(content) =>
          updateDraft({ content })
        }
      />
    </StepScaffold>
  );
}