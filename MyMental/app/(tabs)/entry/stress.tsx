import React, { useState } from 'react';
import { router } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import LabeledSlider from '../../../src/components/entrySteps/LabeledSlider';
import { useNewEntry } from '../../../src/context/NewEntryContext';
import { getNextStepRoute } from '../../../src/constants/entrySteps';

const STRESS_LABELS = [
  'Very relaxed',
  'Relaxed',
  'Neutral',
  'Stressed',
  'Very stressed',
];

export default function StressStepScreen() {
  const { draft, updateDraft } = useNewEntry();
  const [value, setValue] = useState(draft.stress ?? 5);
  const [hasTouched, setHasTouched] = useState(false);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    setHasTouched(true);
  };

  const goNext = () => {
    const next = getNextStepRoute('stress');
    if (next) router.push(next);
  };

  return (
    <StepScaffold
      stepKey="stress"
      title="What's your stress level?"
      subtitle="This helps track patterns between stress and mood over time."
      skippable
      onSkip={goNext}
      onContinue={() => {
        updateDraft({ stress: value });
        goNext();
      }}
      continueDisabled={!hasTouched}
    >
      <LabeledSlider
        value={value}
        onChange={handleChange}
        labels={STRESS_LABELS}
        minLabel="Relaxed"
        maxLabel="Stressed"
      />
    </StepScaffold>
  );
}