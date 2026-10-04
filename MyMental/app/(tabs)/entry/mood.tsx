import React from 'react';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import MoodStep from '../../../src/components/entrySteps/MoodStep';

import { useNewEntry } from '../../../src/context/NewEntryContext';

import {
  getEntrySteps,
  getNextStepRoute,
} from '../../../src/constants/entrySteps';

import { MoodLevel } from '../../../src/hooks/useJournalEntries';

import { useJournalingPreferences } from '../../../src/context/JournalPreferencesContext';

export default function MoodStepScreen() {
  const { date } =
    useLocalSearchParams<{ date?: string }>();

  const {
    draft,
    updateDraft,
    resetDraft,
  } = useNewEntry();

  const {
    trackingOptions: currentTrackingOptions,
    loading: preferencesLoading,
  } = useJournalingPreferences();

  /*
   * For an existing entry, use the tracking options that were
   * saved with that entry.
   *
   * For a brand-new entry, fall back to the user's current
   * journaling settings.
   */
  const trackingOptions =
    draft.trackingOptions ?? currentTrackingOptions;

  const selectedDate = Array.isArray(date)
    ? date[0]
    : date;

  /*
   * Sync the route's date param into the shared draft.
   *
   * This must only run while THIS screen is focused. Expo Router
   * keeps earlier screens mounted underneath the current one, so a
   * Mood screen left over from a previous (back-dated) entry still
   * holds its old `date` param. With a plain useEffect, that stale
   * screen and the visible one would each overwrite draft.entryDate
   * with their own date, re-triggering each other forever
   * ("Maximum update depth exceeded").
   */
  useFocusEffect(
    React.useCallback(() => {
      if (
        selectedDate &&
        draft.entryDate !== selectedDate
      ) {
        updateDraft({
          entryDate: selectedDate,
        });
      }
    }, [
      selectedDate,
      draft.entryDate,
      updateDraft,
    ]),
  );

  const handleSelect = (mood: MoodLevel) => {
    updateDraft({ mood });
  };

  const handleContinue = () => {
    console.log(
      'ENTRY TRACKING OPTIONS:',
      trackingOptions,
    );

    console.log(
      'ENTRY STEPS:',
      getEntrySteps(trackingOptions),
    );

    if (
      preferencesLoading &&
      !draft.trackingOptions
    ) {
      return;
    }

    const next = getNextStepRoute(
      'mood',
      trackingOptions,
    );

    console.log(
      'NEXT ROUTE:',
      next,
    );

    if (next) {
      router.push(next);
    }
  };

  const handleClose = () => {
    resetDraft();

    // Leave the whole entry flow, rather than replacing just this
    // screen, so no step screens stay mounted underneath.
    if (router.canDismiss()) {
      router.dismissAll();
    } else {
      router.replace('/journal');
    }
  };

  return (
    <StepScaffold
      stepKey="mood"
      title="How are you feeling right now?"
      subtitle="Your check-ins help you understand your emotional patterns."
      skippable={false}
      onContinue={handleContinue}
      onClose={handleClose}
      continueDisabled={
        !draft.mood ||
        (preferencesLoading &&
          !draft.trackingOptions)
      }
    >
      <MoodStep
        value={draft.mood}
        onChange={handleSelect}
      />
    </StepScaffold>
  );
}