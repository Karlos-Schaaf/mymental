import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import {
  colors,
  fonts,
  spacing,
  radius,
} from '../../../src/constants/theme';

import {
  MoodLevel,
  useJournalEntries,
} from '../../../src/hooks/useJournalEntries';

import {
  useNewEntry,
} from '../../../src/context/NewEntryContext';

const MOOD_CONFIG: Record<
  MoodLevel,
  {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    color: string;
  }
> = {
  very_bad: {
    icon: 'sad',
    label: 'Very Bad',
    color: '#C2553A',
  },

  bad: {
    icon: 'sad-outline',
    label: 'Bad',
    color: '#C8843A',
  },

  neutral: {
    icon: 'remove-circle-outline',
    label: 'Neutral',
    color: '#6b6c61',
  },

  good: {
    icon: 'happy-outline',
    label: 'Good',
    color: '#5AA87A',
  },

  great: {
    icon: 'happy',
    label: 'Great',
    color: '#3E9B6B',
  },
};

function formatDate(createdAt: string) {
  const date = new Date(createdAt);

  return date.toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString('en-NZ', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function EntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    entries,
    loading,
    deleteEntry,
  } = useJournalEntries();

  const {
    startEdit,
  } = useNewEntry();

  const entry = entries.find((item) => item.id === id);

  const handleEdit = () => {
    if (!entry) return;

    /*
     * Load the entire existing entry into the shared
     * entry flow before opening the first step.
     *
     * Because the entry keeps its id, the final Save
     * will update this entry instead of creating a new one.
     */
    startEdit(entry);

    router.push('/entry/mood');
  };

  const handleDelete = () => {
    if (!entry) return;

    Alert.alert(
      'Delete entry?',
      'This journal entry will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(entry.id);
              router.replace('/journal');
            } catch (error) {
              console.error(
                'Failed to delete entry:',
                error,
              );

              Alert.alert(
                'Error',
                'Could not delete your journal entry.',
              );
            }
          },
        },
      ],
    );
  };

  if (loading && !entry) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loadingState}>
          <ActivityIndicator
            size="small"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading entry...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!entry) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => router.replace('/journal')}
              hitSlop={10}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={25}
                color={colors.ink}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.emptyState}>
            <Ionicons
              name="document-text-outline"
              size={40}
              color={colors.muted}
            />

            <Text style={styles.emptyTitle}>
              Entry not found
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.replace('/journal')}
            >
              <Text style={styles.primaryButtonText}>
                Back to Journal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const mood = entry.mood
    ? MOOD_CONFIG[entry.mood]
    : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}

        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.replace('/journal')}
            hitSlop={10}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={25}
              color={colors.ink}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Journal Entry
          </Text>

          <TouchableOpacity
            onPress={handleEdit}
            hitSlop={10}
            style={styles.editButton}
          >
            <Ionicons
              name="create-outline"
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Date */}

          <Text style={styles.date}>
            {formatDate(entry.createdAt)}
          </Text>

          <Text style={styles.time}>
            {formatTime(entry.createdAt)}
          </Text>

          {/* Mood */}

          {mood ? (
            <View style={styles.moodCard}>
              <View
                style={[
                  styles.moodIcon,
                  {
                    backgroundColor: `${mood.color}20`,
                  },
                ]}
              >
                <Ionicons
                  name={mood.icon}
                  size={25}
                  color={mood.color}
                />
              </View>

              <View>
                <Text style={styles.moodLabel}>
                  Mood
                </Text>

                <Text
                  style={[
                    styles.moodValue,
                    {
                      color: mood.color,
                    },
                  ]}
                >
                  {mood.label}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Title */}

          {entry.title ? (
            <Text style={styles.title}>
              {entry.title}
            </Text>
          ) : null}

          {/* Content */}

          <Text style={styles.content}>
            {entry.content || 'No written notes.'}
          </Text>

          {/* Metrics */}

          {(
  entry.stress !== undefined ||
  entry.energy !== undefined ||
  entry.sleepHours !== undefined ||
  entry.physicalActivity !== undefined ||
  entry.socialInteraction !== undefined ||
  entry.productivity !== undefined ||
  entry.screenTime !== undefined
) ? (
            <View style={styles.metricsSection}>
              <Text style={styles.sectionTitle}>
                Check-in
              </Text>

              <View style={styles.metrics}>
  {entry.stress !== undefined ? (
    <Metric
      icon="pulse-outline"
      label="Stress"
      value={`${entry.stress}/10`}
    />
  ) : null}

  {entry.energy !== undefined ? (
    <Metric
      icon="flash-outline"
      label="Energy"
      value={`${entry.energy}/10`}
    />
  ) : null}

  {entry.sleepHours !== undefined ? (
    <Metric
      icon="moon-outline"
      label="Sleep"
      value={`${entry.sleepHours} hrs`}
    />
  ) : null}

  {entry.physicalActivity !== undefined ? (
    <Metric
      icon="fitness-outline"
      label="Physical Activity"
      value={`${entry.physicalActivity}/10`}
    />
  ) : null}

  {entry.socialInteraction !== undefined ? (
    <Metric
      icon="people-outline"
      label="Social Interaction"
      value={`${entry.socialInteraction}/10`}
    />
  ) : null}

  {entry.productivity !== undefined ? (
    <Metric
      icon="checkmark-circle-outline"
      label="Productivity"
      value={`${entry.productivity}/10`}
    />
  ) : null}

  {entry.screenTime !== undefined ? (
    <Metric
      icon="phone-portrait-outline"
      label="Screen Time"
      value={`${entry.screenTime} hrs`}
    />
  ) : null}
</View>
            </View>
          ) : null}

          {/* Delete */}

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={colors.coral}
            />

            <Text style={styles.deleteText}>
              Delete entry
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metric}>
      <Ionicons
        name={icon}
        size={20}
        color={colors.primary}
      />

      <Text style={styles.metricLabel}>
        {label}
      </Text>

      <Text style={styles.metricValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  container: {
    flex: 1,
  },

  topBar: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
  },

  headerTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.ink,
  },

  editButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },

  date: {
    fontFamily: fonts.serif,
    fontSize: 27,
    lineHeight: 34,
    color: colors.ink,
  },

  time: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    marginTop: spacing.xs,
  },

  moodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.xl,
  },

  moodIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  moodLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },

  moodValue: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    marginTop: 2,
  },

  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 35,
    color: colors.ink,
    marginTop: spacing.xl,
  },

  content: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 26,
    color: colors.ink,
    marginTop: spacing.lg,
  },

  metricsSection: {
    marginTop: spacing.xxxl,
  },

  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.ink,
    marginBottom: spacing.md,
  },

  metrics: {
    gap: spacing.sm,
  },

  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },

  metricLabel: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    marginLeft: spacing.sm,
  },

  metricValue: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
    marginLeft: 'auto',
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxxl,
    paddingVertical: spacing.md,
  },

  deleteText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.coral,
    marginLeft: spacing.sm,
  },

  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.md,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },

  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.ink,
    marginTop: spacing.md,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },

  primaryButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.white,
  },
});