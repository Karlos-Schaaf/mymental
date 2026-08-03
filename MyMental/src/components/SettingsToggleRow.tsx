import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

import { colors, fonts, spacing } from '../constants/theme';

type SettingsToggleRowProps = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isLast?: boolean;
};

export default function SettingsToggleRow({
  label,
  description,
  value,
  onValueChange,
  isLast,
}: SettingsToggleRowProps) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.textGroup}>
        <Text style={styles.label}>{label}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.tealLight }}
        thumbColor={value ? colors.teal : colors.white}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
});
