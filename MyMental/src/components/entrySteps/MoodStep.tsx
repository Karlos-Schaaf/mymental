import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, spacing, radius } from '../../constants/theme';
import { MoodLevel } from '../../hooks/useJournalEntries';

type MoodOption = {
  level: MoodLevel;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
};

// Ionicons ships a proper set of face glyphs, so the scale reads as
// deliberate iconography rather than emoji. Each level also carries its
// own colour so the selected state is legible at a glance.
const MOODS: MoodOption[] = [
  { level: 'very_bad', icon: 'sad', label: 'Very Bad', color: '#C2553A' },
  { level: 'bad', icon: 'sad-outline', label: 'Bad', color: '#C8843A' },
  { level: 'neutral', icon: 'remove-circle-outline', label: 'Neutral', color: '#9A9188' },
  { level: 'good', icon: 'happy-outline', label: 'Good', color: '#5AA87A' },
  { level: 'great', icon: 'happy', label: 'Great', color: '#3E9B6B' },
];

type MoodStepProps = {
  value?: MoodLevel;
  onChange: (mood: MoodLevel) => void;
};

export default function MoodStep({ value, onChange }: MoodStepProps) {
  const selectedOption = MOODS.find((m) => m.level === value);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {MOODS.map(({ level, icon, label, color }) => {
          const selected = value === level;
          return (
            <TouchableOpacity
              key={level}
              style={styles.item}
              onPress={() => onChange(level)}
              accessibilityLabel={`Mood: ${label}`}
              accessibilityState={{ selected }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconCircle,
                  selected && {
                    backgroundColor: color,
                    borderColor: color,
                  },
                ]}
              >
                <Ionicons
                  name={icon}
                  size={26}
                  color={selected ? colors.white : colors.mutedLight}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Single label below the row, so the icons stay evenly spaced
          instead of each being padded out by its own caption. */}
      <Text
        style={[
          styles.selectedLabel,
          selectedOption
            ? { color: selectedOption.color }
            : styles.selectedLabelEmpty,
        ]}
      >
        {selectedOption?.label ?? 'Tap to select'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  item: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  selectedLabelEmpty: {
    fontFamily: fonts.sans,
    color: colors.mutedLight,
  },
});
