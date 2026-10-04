import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  colors,
  fonts,
  spacing,
  radius,
} from '../constants/theme';

import {
  JournalEntry,
} from '../hooks/useJournalEntries';
import { JournalTrackingOption } from '../firebase/firestore';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * One widget per trackable metric. Mood and Journal (text) are
 * intentionally absent: they already have their own dashboard
 * cards, so they never render as widgets.
 *
 * ASSUMPTION: each entry stores its value on a numeric field
 * named after the option id (entry.energy, entry.sleep, ...).
 * Adjust `suffix` / `decimals` below to match how you store
 * each value (e.g. sleep in hours, activity in minutes).
 */
type MetricConfig = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  suffix: string;
  decimals: number;
};

const METRICS: Partial<
  Record<JournalTrackingOption, MetricConfig>
> = {
  energy: {
    title: 'Energy',
    icon: 'flash-outline',
    suffix: '/10',
    decimals: 1,
  },
  stress: {
    title: 'Stress Level',
    icon: 'pulse-outline',
    suffix: '/10',
    decimals: 1,
  },
  sleep: {
    title: 'Sleep',
    icon: 'moon-outline',
    suffix: 'h',
    decimals: 1,
  },
  productivity: {
    title: 'Productivity',
    icon: 'checkmark-done-outline',
    suffix: '/10',
    decimals: 1,
  },
  physicalActivity: {
    title: 'Activity',
    icon: 'walk-outline',
    suffix: ' min',
    decimals: 0,
  },
  socialInteraction: {
    title: 'Social',
    icon: 'people-outline',
    suffix: '/10',
    decimals: 1,
  },
  screenTime: {
    title: 'Screen Time',
    icon: 'phone-portrait-outline',
    suffix: 'h',
    decimals: 1,
  },
};

// Display order matches the Journaling Settings screen.
const WIDGET_ORDER: JournalTrackingOption[] = [
  'energy',
  'stress',
  'sleep',
  'productivity',
  'physicalActivity',
  'socialInteraction',
  'screenTime',
];

// Where an option's value is stored on the entry, when the field
// name differs from the option id (sleep is saved as `sleepHours`).
const FIELD_FOR_OPTION: Partial<Record<JournalTrackingOption, string>> = {
  sleep: 'sleepHours',
};

function weeklyAverage(
  entries: JournalEntry[],
  option: JournalTrackingOption,
  now: number,
): number | null {
  const values = entries
    .filter(
      (entry) =>
        now - new Date(entry.createdAt).getTime() <=
        7 * DAY_MS,
    )
    .map(
      (entry) =>
        (entry as unknown as Record<string, unknown>)[
          FIELD_FOR_OPTION[option] ?? option
        ],
    )
    .filter(
      (value): value is number =>
        typeof value === 'number' && !Number.isNaN(value),
    );

  if (values.length === 0) {
    return null;
  }

  return (
    values.reduce((sum, value) => sum + value, 0) /
    values.length
  );
}

type Props = {
  entries: JournalEntry[];
  selected: JournalTrackingOption[];
  now: number;
  checkins: number;
};

export default function TrackingWidgets({
  entries,
  selected,
  now,
  checkins,
}: Props) {
  const widgets = useMemo(
    () =>
      WIDGET_ORDER.filter((id) => selected.includes(id)).map(
        (id) => {
          const config = METRICS[id] as MetricConfig;
          const average = weeklyAverage(entries, id, now);

          return { id, config, average };
        },
      ),
    [entries, selected, now],
  );

  return (
    <View style={styles.grid}>
      {/* Check-ins always show first */}
      <View style={styles.card}>
        <Ionicons
          name="calendar-outline"
          size={18}
          color={colors.teal}
        />

        <Text style={styles.label}>Check-ins</Text>
        <Text style={styles.value}>{checkins}</Text>
        <Text style={styles.subtitle}>This week</Text>
      </View>

      {widgets.map(({ id, config, average }) => (
        <View key={id} style={styles.card}>
          <Ionicons
            name={config.icon}
            size={18}
            color={colors.teal}
          />

          <Text style={styles.label}>{config.title}</Text>

          <Text style={styles.value}>
            {average !== null
              ? `${average.toFixed(config.decimals)}${config.suffix}`
              : '—'}
          </Text>

          <Text style={styles.subtitle}>
            {average !== null
              ? 'Average this week'
              : 'No data this week'}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },

  card: {
    width: '48.5%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },

  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
  },

  value: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 22,
    color: colors.ink,
  },

  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
});