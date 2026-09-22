import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import MoodStep from '../../../src/components/entrySteps/MoodStep';
import { useNewEntry } from '../../../src/context/NewEntryContext';
import { getNextStepRoute } from '../../../src/constants/entrySteps';
import { MoodLevel } from '../../../src/hooks/useJournalEntries';

export default function MoodStepScreen() {
  const { date } = useLocalSearchParams<{ date?: string }>();

  const {
    draft,
    updateDraft,
    resetDraft,
  } = useNewEntry();

  const selectedDate = Array.isArray(date) ? date[0] : date;

  React.useEffect(() => {
    if (selectedDate && draft.entryDate !== selectedDate) {
      updateDraft({
        entryDate: selectedDate,
      });
    }
  }, [selectedDate, draft.entryDate, updateDraft]);

  const handleSelect = (mood: MoodLevel) => {
    updateDraft({ mood });
  };

  const handleContinue = () => {
    const next = getNextStepRoute('mood');

    if (next) {
      router.push(next);
    }
  };

  const handleClose = () => {
    resetDraft();
    router.replace('/journal');
  };

  return (
    <StepScaffold
      stepKey="mood"
      title="How are you feeling right now?"
      subtitle="Your check-ins help you understand your emotional patterns."
      skippable={false}
      onContinue={handleContinue}
      onClose={handleClose}
      continueDisabled={!draft.mood}
      entryDate={draft.entryDate}
    >
      <MoodStep
        value={draft.mood}
        onChange={handleSelect}
      />
    </StepScaffold>
  );
}