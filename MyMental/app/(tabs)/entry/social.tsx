import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import LabeledSlider from '../../../src/components/entrySteps/LabeledSlider';

import { useNewEntry } from '../../../src/context/NewEntryContext';
import { getNextStepRoute } from '../../../src/constants/entrySteps';
import { useJournalingPreferences } from '../../../src/hooks/useJournalingPreferences';
import { useJournalEntries } from '../../../src/hooks/useJournalEntries';

const SOCIAL_LABELS = [
  'Isolated',
  'Mostly alone',
  'Some interaction',
  'Well connected',
  'Very connected',
];

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

export default function SocialStepScreen() {
  const {
    draft,
    updateDraft,
    resetDraft,
  } = useNewEntry();

  const {
    addEntry,
    updateEntry,
  } = useJournalEntries();

  const [value, setValue] = useState(
    draft.socialInteraction ?? 5,
  );

  const [saving, setSaving] = useState(false);

  const {
    trackingOptions: currentTrackingOptions,
    loading: preferencesLoading,
  } = useJournalingPreferences();

  // Existing entries use the settings saved with that entry.
  // New entries use the current settings snapshot.
  const trackingOptions =
    draft.trackingOptions ?? currentTrackingOptions;

  const saveEntry = async (
    socialOverride?: number,
  ) => {
    if (
      (preferencesLoading && !draft.trackingOptions) ||
      saving
    ) {
      return;
    }

    if (!draft.mood) {
      Alert.alert(
        'Missing mood',
        "Please go back and select how you're feeling first.",
      );
      return;
    }

    setSaving(true);

    try {
      const socialInteraction =
        socialOverride ??
        draft.socialInteraction;

      if (draft.id) {
        // Editing an existing entry.
        // Keep its original timestamp and tracking options.
        await updateEntry({
          id: draft.id,
          title: draft.title,
          content: draft.content ?? '',
          mood: draft.mood,
          sleepHours: draft.sleepHours,
          physicalActivity:
            draft.physicalActivity,
          socialInteraction,
          productivity:
            draft.productivity,
          screenTime:
            draft.screenTime,
          stress: draft.stress,
          energy: draft.energy,
          trackingOptions:
            draft.trackingOptions,
          createdAt:
            draft.createdAt ??
            getEntryCreatedAt(
              draft.entryDate,
            ),
        });
      } else {
        // Creating a new entry.
        // Keep the journaling settings snapshot
        // captured when the entry was started.
        await addEntry({
          title: draft.title,
          content: draft.content ?? '',
          mood: draft.mood,
          sleepHours: draft.sleepHours,
          physicalActivity:
            draft.physicalActivity,
          socialInteraction,
          productivity:
            draft.productivity,
          screenTime:
            draft.screenTime,
          stress: draft.stress,
          energy: draft.energy,
          trackingOptions:
            draft.trackingOptions,
          createdAt: getEntryCreatedAt(
            draft.entryDate,
          ),
        });
      }

      resetDraft();
      router.replace('/journal');
    } catch (error) {
      console.error(
        'Failed to save journal entry:',
        error,
      );

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

  const handleSkip = async () => {
    if (
      (preferencesLoading && !draft.trackingOptions) ||
      saving
    ) {
      return;
    }

    const next = getNextStepRoute(
      'social',
      trackingOptions,
    );

    if (next) {
      router.push(next);
      return;
    }

    // Social is the final selected step.
    // Save without adding a Social value.
    await saveEntry();
  };

  const handleContinue = async () => {
    if (
      (preferencesLoading && !draft.trackingOptions) ||
      saving
    ) {
      return;
    }

    // Save the selected Social value into the draft.
    updateDraft({
      socialInteraction: value,
    });

    const next = getNextStepRoute(
      'social',
      trackingOptions,
    );

    if (next) {
      router.push(next);
      return;
    }

    // Social is the final selected step.
    // Pass the value directly because updateDraft()
    // may not have updated React state yet.
    await saveEntry(value);
  };

  return (
    <StepScaffold
      stepKey="social"
      title="How connected did you feel?"
      subtitle="Time spent with friends, family, or community."
      skippable
      onSkip={handleSkip}
      onContinue={handleContinue}
      continueLabel={
        saving ? 'Saving…' : 'Continue'
      }
      continueDisabled={
        (preferencesLoading && !draft.trackingOptions) ||
        saving
      }
    >
      <LabeledSlider
        value={value}
        onChange={setValue}
        labels={SOCIAL_LABELS}
        minLabel="Isolated"
        maxLabel="Very connected"
      />
    </StepScaffold>
  );
}