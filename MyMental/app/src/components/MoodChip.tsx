import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius, moods } from '../constants/theme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function MoodChip({ label, selected, onPress }: Props) {
  const meta = moods.find((m) => m.label === label);

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && {
          backgroundColor: meta?.color ?? colors.coral,
          borderColor: meta?.color ?? colors.coral,
        },
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          selected ? styles.labelSelected : styles.labelDefault,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
  labelDefault: {
    color: '#857870',
  },
  labelSelected: {
    color: colors.white,
  },
});
