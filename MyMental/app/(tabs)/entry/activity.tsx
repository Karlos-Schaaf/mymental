import React, { useState } from 'react';
import { router } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import LabeledSlider from '../../../src/components/entrySteps/LabeledSlider';
import { useNewEntry } from '../../../src/context/NewEntryContext';
import { getNextStepRoute } from '../../../src/constants/entrySteps';

const ACTIVITY_LABELS = [
  'Sedentary',
  'Lightly active',
  'Moderately active',
  'Active',
  'Very active',
];

export default function ActivityStepScreen() {
  const { draft, updateDraft } = useNewEntry();
  const [value, setValue] = useState(draft.physicalActivity ?? 5);

  const goNext = () => {
    const next = getNextStepRoute('activity');
    if (next) router.push(next);
  };

  return (
    <StepScaffold
      stepKey="activity"
      title="How active were you today?"
      subtitle="Include walks, workouts, chores — anything that got you moving."
      skippable
      onSkip={goNext}
      onContinue={() => {
        updateDraft({ physicalActivity: value });
        goNext();
      }}
    >
      <LabeledSlider
        value={value}
        onChange={setValue}
        labels={ACTIVITY_LABELS}
        minLabel="Sedentary"
        maxLabel="Very active"
      />
    </StepScaffold>
  );
}
