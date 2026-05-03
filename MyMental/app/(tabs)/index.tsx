import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useEntriesStore } from '../../store/entriesStore';
import { getDailyPrompt } from '../src/constants/prompts';
import { colors, fonts, spacing } from '../src/constants/theme';
import EntryCard from '../src/components/EntryCard';
import PromptBanner from '../src/components/PromptBanner';

export default function HomeScreen() {
  const { entries, getStreak } = useEntriesStore();
  const streak = getStreak();
  const prompt = getDailyPrompt();

  const today = new Date();
  const greeting = today.toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const hour = today.getHours();
  const timeGreeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerDecorCircle} />
        <View style={styles.headerDecorCircle2} />
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.title}>
          {timeGreeting},{'\n'}
          <Text style={styles.titleItalic}>how are you?</Text>
        </Text>
        {streak > 0 && (
          <View style={styles.streakPill}>
            <View style={styles.streakDot} />
            <Text style={styles.streakText}>
              {streak}-day streak
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's prompt */}
        <Text style={styles.sectionLabel}>Today's reflection</Text>
        <PromptBanner prompt={prompt} />

        {/* Past entries */}
        {entries.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
              Recent entries
            </Text>
            <View style={styles.entryList}>
              {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </View>
          </>
        )}

        {entries.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Your story starts here</Text>
            <Text style={styles.emptyBody}>
              Tap the prompt above to write your first reflection.
            </Text>
          </View>
        )}
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecorCircle: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.coral,
    opacity: 0.18,
  },
  headerDecorCircle2: {
    position: 'absolute',
    bottom: -20,
    left: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    opacity: 0.22,
  },
  greeting: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: '#A09890',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: colors.paper,
    lineHeight: 36,
  },
  titleItalic: {
    fontFamily: fonts.serifItalic,
    color: colors.coralMid,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(253,248,243,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(253,248,243,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 14,
  },
  streakDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coralMid,
  },
  streakText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: '#D4C8C0',
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  entryList: {
    gap: spacing.sm + 2,
  },
  emptyState: {
    marginTop: spacing.xxl + 8,
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.ink2,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21,
  },
});
