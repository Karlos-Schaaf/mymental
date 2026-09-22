import React, { useState } from 'react';
import { router } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import LabeledSlider from '../../../src/components/entrySteps/LabeledSlider';
import { useNewEntry } from '../../../src/context/NewEntryContext';
import { getNextStepRoute } from '../../../src/constants/entrySteps';

const SOCIAL_LABELS = [
  'Isolated',
  'Mostly alone',
  'Some interaction',
  'Well connected',
  'Very connected',
];

export default function SocialStepScreen() {
  const { draft, updateDraft } = useNewEntry();
  const [value, setValue] = useState(draft.socialInteraction ?? 5);

  const goNext = () => {
    const next = getNextStepRoute('social');
    if (next) router.push(next);
  };

  return (
    <StepScaffold
      stepKey="social"
      title="How connected did you feel?"
      subtitle="Time spent with friends, family, or community."
      skippable
      onSkip={goNext}
      onContinue={() => {
        updateDraft({ socialInteraction: value });
        goNext();
      }}
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
