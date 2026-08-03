import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, spacing } from '../constants/theme';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
};

export default function ScreenHeader({
  title,
  onBack,
  rightElement,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack ?? (() => router.back())}
        style={styles.side}
        activeOpacity={0.6}
      >
        <Ionicons name="chevron-back" size={26} color={colors.ink} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.side}>{rightElement}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  side: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    color: colors.ink,
  },
});
