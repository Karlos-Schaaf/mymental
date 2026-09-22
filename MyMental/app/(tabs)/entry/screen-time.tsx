import React, { useState } from 'react';
import { router } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import LabeledSlider from '../../../src/components/entrySteps/LabeledSlider';
import { useNewEntry } from '../../../src/context/NewEntryContext';
import { getNextStepRoute } from '../../../src/constants/entrySteps';

const SCREEN_TIME_LABELS = ['Minimal', 'Light', 'Moderate', 'High', 'Very high'];

function formatScreenHours(value: number) {
  if (value >= 12) return '12+ hrs';
  return `${value % 1 === 0 ? value : value.toFixed(1)} hrs`;
}

export default function ScreenTimeStepScreen() {
  const { draft, updateDraft } = useNewEntry();
  const [value, setValue] = useState(draft.screenTime ?? 4);

  const goNext = () => {
    const next = getNextStepRoute('screenTime');
    if (next) router.push(next);
  };

  return (
    <StepScaffold
      stepKey="screenTime"
      title="How much screen time did you have?"
      subtitle="Phone, computer, and TV combined — a rough estimate is fine."
      skippable
      onSkip={goNext}
      onContinue={() => {
        updateDraft({ screenTime: value });
        goNext();
      }}
    >
      <LabeledSlider
        value={value}
        onChange={setValue}
        min={0}
        max={12}
        step={0.5}
        labels={SCREEN_TIME_LABELS}
        minLabel="0 hrs"
        maxLabel="12+ hrs"
        formatValue={formatScreenHours}
      />
    </StepScaffold>
  );
}
