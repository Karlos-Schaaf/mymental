import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius, spacing } from '../constants/theme';

interface Props {
  text: string;
}

export default function InsightBox({ text }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.icon}>✦</Text>
      <View style={styles.content}>
        <Text style={styles.label}>Pattern noticed</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: '#D0CCF0',
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm + 2,
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 16,
    color: colors.accent,
    marginTop: 1,
  },
  content: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    color: colors.accent,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  text: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: '#4A3FA0',
    lineHeight: 19,
  },
});
