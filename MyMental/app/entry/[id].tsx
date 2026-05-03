import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEntriesStore } from '../../store/entriesStore';
import { colors, fonts, spacing, radius, moods } from '../src/constants/theme';
import InsightBox from '../src/components/InsightBox';

function generateInsight(entries: ReturnType<typeof useEntriesStore.getState>['entries'], currentMood: string): string | null {
  if (entries.length < 3 || !currentMood) return null;

  const moodEntries = entries.filter((e) => e.mood === currentMood);
  if (moodEntries.length < 2) return null;

  const avgEnergy =
    moodEntries.reduce((sum, e) => sum + e.energy, 0) / moodEntries.length;

  return `You've felt ${currentMood.toLowerCase()} in ${moodEntries.length} of your recent entries, with an average energy of ${Math.round(avgEnergy * 10) / 10}/10 on those days.`;
}

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getEntry, deleteEntry, entries } = useEntriesStore();
  const entry = getEntry(id);

  if (!entry) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Entry not found.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const date = new Date(entry.createdAt);
  const formattedDate = date.toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const moodMeta = moods.find((m) => m.label === entry.mood);
  const insight = generateInsight(entries, entry.mood);

  const handleDelete = () => {
    Alert.alert('Delete entry', "This can't be undone.", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteEntry(entry.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerDecor} />
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
        <View style={styles.dateTag}>
          <Text style={styles.dateTagText}>{formattedDate}</Text>
        </View>
        <Text style={styles.title}>{entry.title}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats row */}
        {(entry.mood || entry.energy) ? (
          <View style={styles.statsRow}>
            {entry.mood ? (
              <View style={styles.statCard}>
                <Text style={styles.statName}>Mood</Text>
                <Text style={[styles.statVal, { color: moodMeta?.color ?? colors.coral }]}>
                  {entry.mood}
                </Text>
              </View>
            ) : null}
            {entry.energy ? (
              <View style={styles.statCard}>
                <Text style={styles.statName}>Energy</Text>
                <Text style={[styles.statVal, { color: colors.teal }]}>
                  {entry.energy} / 10
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Reflection */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Reflection</Text>
          <Text style={styles.bodyText}>{entry.body}</Text>
        </View>

        {/* Insight */}
        {insight && <InsightBox text={insight} />}

        {/* Prompt */}
        {entry.prompt ? (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Prompt used</Text>
            <Text style={styles.promptText}>{entry.prompt}</Text>
          </View>
        ) : null}

        {/* Delete */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Delete entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  header: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecor: {
    position: 'absolute',
    top: -60,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accent,
    opacity: 0.15,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xl,
  },
  backArrow: {
    fontSize: 16,
    color: '#A09890',
  },
  backLabel: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: '#A09890',
  },
  dateTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(253,248,243,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(253,248,243,0.15)',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.sm + 2,
  },
  dateTagText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: '#D4C8C0',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.paper,
    lineHeight: 30,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 48,
    gap: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: spacing.md,
  },
  statName: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.mutedLight,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  statVal: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  cardLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: spacing.sm + 2,
  },
  bodyText: {
    fontFamily: fonts.serif,
    fontSize: 15,
    color: colors.ink2,
    lineHeight: 24,
  },
  promptText: {
    fontFamily: fonts.serif,
    fontSize: 14,
    color: '#857870',
    lineHeight: 21,
  },
  deleteBtn: {
    alignSelf: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  deleteBtnText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: '#C0A898',
    textDecorationLine: 'underline',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.ink2,
  },
  backLink: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.coral,
  },
});
