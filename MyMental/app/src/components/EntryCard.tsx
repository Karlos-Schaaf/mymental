import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { JournalEntry } from '../../../store/entriesStore';
import { colors, fonts, radius, spacing, moods } from '../constants/theme';

interface Props {
  entry: JournalEntry;
}

export default function EntryCard({ entry }: Props) {
  const router = useRouter();
  const date = new Date(entry.createdAt);
  const day = date.getDate().toString().padStart(2, '0');
  const mon = date.toLocaleString('default', { month: 'short' }).toUpperCase();

  const moodMeta = moods.find((m) => m.label === entry.mood);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={() => router.push(`/entry/${entry.id}`)}
    >
      <View style={styles.dateBlock}>
        <Text style={styles.day}>{day}</Text>
        <Text style={styles.mon}>{mon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{entry.title}</Text>
        <Text style={styles.preview} numberOfLines={2}>{entry.body}</Text>
        {entry.mood ? (
          <View
            style={[
              styles.moodBadge,
              { backgroundColor: moodMeta?.bg ?? colors.coralLight },
            ]}
          >
            <Text
              style={[
                styles.moodText,
                { color: moodMeta?.color ?? colors.coral },
              ]}
            >
              {entry.mood}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  dateBlock: {
    backgroundColor: colors.coralLight,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm - 2,
    alignItems: 'center',
    minWidth: 44,
  },
  day: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    color: colors.coral,
    lineHeight: 22,
  },
  mon: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.coralMid,
    letterSpacing: 0.6,
    marginTop: 2,
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 4,
  },
  preview: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: '#857870',
    lineHeight: 17,
  },
  moodBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.xs + 2,
  },
  moodText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
  },
});
