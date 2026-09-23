import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import { colors, fonts, spacing } from '../../constants/theme';

type LabeledSliderProps = {
  value: number;
  onChange: (value: number) => void;

  /** Labels spanning the range low→high; the one matching the current
   *  value is shown above the slider. */
  labels: string[];

  minLabel: string;
  maxLabel: string;

  min?: number; // default 0
  max?: number; // default 10
  step?: number; // default 1

  /** Custom readout text, e.g. "7.5 hrs" instead of "8 of 10".
   *  Defaults to "{rounded value} of {max}". */
  formatValue?: (value: number) => string;
};

function labelForValue(
  value: number,
  labels: string[],
  min: number,
  max: number,
): string {
  const ratio = (value - min) / (max - min);

  const bucket = Math.min(
    labels.length - 1,
    Math.max(0, Math.floor(ratio * labels.length)),
  );

  return labels[bucket];
}

export default function LabeledSlider({
  value,
  onChange,
  labels,
  minLabel,
  maxLabel,
  min = 0,
  max = 10,
  step = 1,
  formatValue,
}: LabeledSliderProps) {
  const format =
    formatValue ?? ((v: number) => `${Math.round(v)} of ${max}`);

  return (
    <View style={styles.container}>
      {/* Fixed height so the slider doesn't jump as the label text
          changes length while dragging. */}
      <View style={styles.readout}>
        <Text style={styles.currentLabel}>
          {labelForValue(value, labels, min, max)}
        </Text>

        <Text style={styles.valueText}>
          {format(value)}
        </Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
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
    color: colors.primary,
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