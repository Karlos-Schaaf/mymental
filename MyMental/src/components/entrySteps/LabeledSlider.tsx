
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import { colors, fonts, spacing } from '../../constants/theme';

type LabeledSliderProps = {
  value: number; // 0–10
  onChange: (value: number) => void;
  /** Labels spanning the range low→high; the one matching the current
   *  value is shown above the slider as the user drags. */
  labels: string[];
  minLabel: string;
  maxLabel: string;
};

function labelForValue(value: number, labels: string[]): string {
  const bucket = Math.min(
    labels.length - 1,
    Math.floor((value / 10) * labels.length),
  );
  return labels[bucket];
}

export default function LabeledSlider({
  value,
  onChange,
  labels,
  minLabel,
  maxLabel,
}: LabeledSliderProps) {
  const [hasTouched, setHasTouched] = useState(false);

  const handleChange = (newValue: number) => {
    setHasTouched(true);
    onChange(newValue);
  };

  return (
    <View style={styles.container}>
      {/* Fixed height so the slider doesn't jump as the label text
          changes length while dragging. */}
      <View style={styles.readout}>
        <Text style={styles.currentLabel}>
          {hasTouched ? labelForValue(value, labels) : ''}
        </Text>
        <Text style={styles.valueText}>
          {hasTouched ? `${Math.round(value)} of 10` : 'Slide to select'}
        </Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={value}
        onValueChange={handleChange}
        minimumTrackTintColor={
          hasTouched ? colors.primary : colors.mutedLight
        }
        maximumTrackTintColor={colors.border}
        thumbTintColor={
          hasTouched ? colors.primary : colors.mutedLight
        }
      />

      <View style={styles.endLabelsRow}>
        <Text style={styles.endLabel}>{minLabel}</Text>
        <Text style={styles.endLabel}>{maxLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  readout: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  currentLabel: {
    fontFamily: fonts.serif,
    fontSize: 26,
    color: colors.ink,
    textAlign: 'center',
  },
  valueText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  endLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.xs,
  },
  endLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedLight,
  },
});