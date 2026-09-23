import React, { useState } from 'react';
import { router } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import LabeledSlider from '../../../src/components/entrySteps/LabeledSlider';
import { useNewEntry } from '../../../src/context/NewEntryContext';
import { getNextStepRoute } from '../../../src/constants/entrySteps';

const SLEEP_LABELS = [
  'Very little sleep',
  'Not enough sleep',
  'An okay amount',
  'Well rested',
  'Lots of sleep',
];

function formatHours(value: number) {
  return `${value % 1 === 0 ? value : value.toFixed(1)} hrs`;
}

export default function SleepStepScreen() {
  const { draft, updateDraft } = useNewEntry();

  const [value, setValue] = useState(
    draft.sleepHours ?? 6,
  );

  const [hasTouched, setHasTouched] = useState(
    draft.sleepHours !== undefined,
  );

  const goNext = () => {
    const next = getNextStepRoute('sleep');

    if (next) {
      router.push(next);
    }
  };

  return (
    <StepScaffold
      stepKey="sleep"
      title="How many hours did you sleep?"
      subtitle="A rough estimate is fine."
      skippable
      onSkip={goNext}
      onContinue={() => {
        updateDraft({ sleepHours: value });
        goNext();
      }}
      continueDisabled={!hasTouched}
    >
      <LabeledSlider
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          setHasTouched(true);
        }}
        min={0}
        max={12}
        step={0.5}
        labels={SLEEP_LABELS}
        minLabel="0 hrs"
        maxLabel="12 hrs"
        formatValue={formatHours}
      />
    </StepScaffold>
  );
}
