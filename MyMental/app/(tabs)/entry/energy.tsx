import React, { useState } from 'react';
import { router } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import LabeledSlider from '../../../src/components/entrySteps/LabeledSlider';
import { useNewEntry } from '../../../src/context/NewEntryContext';
import { getNextStepRoute } from '../../../src/constants/entrySteps';

const ENERGY_LABELS = [
  'Exhausted',
  'Low energy',
  'Neutral',
  'Energized',
  'Very energized',
];

export default function EnergyStepScreen() {
  const { draft, updateDraft } = useNewEntry();
  const [value, setValue] = useState(draft.energy ?? 5);
  const [hasTouched, setHasTouched] = useState(false);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    setHasTouched(true);
  };

  const goNext = () => {
    const next = getNextStepRoute('energy');
    if (next) router.push(next);
  };

  return (
    <StepScaffold
      stepKey="energy"
      title="What's your energy level?"
      subtitle="Energy and mood often move together — this helps spot the pattern."
      skippable
      onSkip={goNext}
      onContinue={() => {
        updateDraft({ energy: value });
        goNext();
      }}
      continueDisabled={!hasTouched}
    >
      <LabeledSlider
        value={value}
        onChange={handleChange}
        labels={ENERGY_LABELS}
        minLabel="Exhausted"
        maxLabel="Energized"
      />
    </StepScaffold>
  );
}