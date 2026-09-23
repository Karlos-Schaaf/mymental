import React, { useState } from 'react';
import { router } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import LabeledSlider from '../../../src/components/entrySteps/LabeledSlider';
import { useNewEntry } from '../../../src/context/NewEntryContext';
import { getNextStepRoute } from '../../../src/constants/entrySteps';

const PRODUCTIVITY_LABELS = [
  'Unproductive',
  'Somewhat unproductive',
  'Neutral',
  'Productive',
  'Very productive',
];

export default function ProductivityStepScreen() {
  const { draft, updateDraft } = useNewEntry();
  const [value, setValue] = useState(draft.productivity ?? 5);

  const goNext = () => {
    const next = getNextStepRoute('productivity');
    if (next) router.push(next);
  };

  return (
    <StepScaffold
      stepKey="productivity"
      title="How productive did you feel today?"
      subtitle="Think about how much you got done."
      skippable
      onSkip={goNext}
      onContinue={() => {
        updateDraft({ productivity: value });
        goNext();
      }}
    >
      <LabeledSlider
        value={value}
        onChange={setValue}
        labels={PRODUCTIVITY_LABELS}
        minLabel="Unproductive"
        maxLabel="Very productive"
      />
    </StepScaffold>
  );
}
