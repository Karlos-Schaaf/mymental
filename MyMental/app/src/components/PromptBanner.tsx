import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, radius, spacing } from '../constants/theme';

interface Props {
  prompt: string;
}

export default function PromptBanner({ prompt }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.banner}
      activeOpacity={0.85}
      onPress={() => router.push('/entry/new')}
    >
      <View style={styles.left}>
        <Text style={styles.eyebrow}>Daily prompt</Text>
        <Text style={styles.prompt}>{prompt}</Text>
      </View>
      <View style={styles.icon}>
        <Text style={styles.iconText}>✦</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.coral,
    borderRadius: radius.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  left: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: 'rgba(253,248,243,0.7)',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  prompt: {
    fontFamily: fonts.serif,
    fontSize: 16,
    color: colors.paper,
    lineHeight: 22,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(253,248,243,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
    color: colors.paper,
  },
});
