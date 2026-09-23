import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useFocusEffect,
 } from 'expo-router';

import {
  colors,
  fonts,
  spacing,
  radius,
} from '../../src/constants/theme';

import {
  JournalEntry,
  MoodLevel,
  useJournalEntries,
} from '../../src/hooks/useJournalEntries';

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

const WEEKDAY_LABELS = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function createDateKey(
  year: number,
  month: number,
  day: number,
) {
  return `${year}-${String(month + 1).padStart(
    2,
    '0',
  )}-${String(day).padStart(2, '0')}`;
}

function getEntryDateKey(createdAt: string) {
  return getLocalDateKey(new Date(createdAt));
}

function formatGroupDate(dateString: string) {
  const todayKey = getLocalDateKey(new Date());

  if (dateString === todayKey) {
    return 'Today';
  }

  const [year, month, day] = dateString
    .split('-')
    .map(Number);

  return new Date(
    year,
    month - 1,
    day,
  ).toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatDatePickerLabel(dateKey?: string) {
  if (!dateKey) {
    return 'Choose a date';
  }

  const date = parseDateKey(dateKey);

  return date.toLocaleDateString('en-NZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString(
    'en-NZ',
    {
      hour: 'numeric',
      minute: '2-digit',
    },
  );
}

function getMoodLabel(mood?: MoodLevel) {
  if (!mood) {
    return '';
  }

  return MOOD_CONFIG[mood]?.label ?? '';
}

function groupEntriesByDate(entries: JournalEntry[]) {
  const groups: Record<string, JournalEntry[]> = {};

  entries.forEach((entry) => {
    const dateKey = getEntryDateKey(entry.createdAt);

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(entry);
  });

  return Object.entries(groups).sort(
    ([dateA], [dateB]) => dateB.localeCompare(dateA),
  );
}

/**
 * Builds a dateKey -> moods[] map for the calendar sheet.
 * Capped at 3 dots per day, matching MoodCalendar.
 */
function buildDayMoodsMap(entries: JournalEntry[]) {
  const map: Record<string, MoodLevel[]> = {};

  entries.forEach((entry) => {
    const key = getEntryDateKey(entry.createdAt);

    if (!map[key]) {
      map[key] = [];
    }

    if (map[key].length < 3) {
      map[key].push(entry.mood ?? 'neutral');
    }
  });

  return map;
}

export default function JournalScreen() {
  const { date } = useLocalSearchParams<{
    date?: string;
  }>();

  const { entries, loading, error, refresh } =
    useJournalEntries();
  useFocusEffect(
  React.useCallback(() => {
    refresh();
  }, [refresh]),
);
  const [search, setSearch] = useState('');
  const [showCalendar, setShowCalendar] =
    useState(false);

  // The calendar sheet navigates months independently of the
  // selected date — the user can browse without committing.
  const [visibleMonth, setVisibleMonth] = useState(
    () => {
      const now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth(),
      };
    },
  );

  const selectedDate = Array.isArray(date)
    ? date[0]
    : date;

  const dayMoodsMap = useMemo(
    () => buildDayMoodsMap(entries),
    [entries],
  );

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const entryDate = getEntryDateKey(
        entry.createdAt,
      );

      if (selectedDate && entryDate !== selectedDate) {
        return false;
      }

      if (!query) {
        return true;
      }

      const title =
        entry.title?.toLowerCase() ?? '';
      const content =
        entry.content?.toLowerCase() ?? '';
      const mood = getMoodLabel(
        entry.mood,
      ).toLowerCase();

      return (
        title.includes(query) ||
        content.includes(query) ||
        mood.includes(query)
      );
    });
  }, [entries, search, selectedDate]);

  const groupedEntries = useMemo(
    () => groupEntriesByDate(filteredEntries),
    [filteredEntries],
  );

  const openCalendar = () => {
    // Seed the visible month from the current selection (or today).
    const seed = selectedDate
      ? parseDateKey(selectedDate)
      : new Date();

    setVisibleMonth({
      year: seed.getFullYear(),
      month: seed.getMonth(),
    });

    setShowCalendar(true);
  };

  const closeCalendar = () => {
    setShowCalendar(false);
  };

  const handleSelectDate = (dateKey: string) => {
    router.setParams({ date: dateKey });
    closeCalendar();
  };

  const handleNewEntry = () => {
    if (selectedDate) {
      router.push({
        pathname: '/entry/mood',
        params: {
          date: selectedDate,
        },
      });
    } else {
      router.push('/entry/mood');
    }
  };

  const handleEntryPress = (entry: JournalEntry) => {
    router.push({
      pathname: '/entry/[id]',
      params: {
        id: entry.id,
      },
    });
  };

  const clearDate = () => {
    router.setParams({
      date: undefined,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}

        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              YOUR JOURNAL
            </Text>

            <Text style={styles.headerTitle}>
              Journal
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleNewEntry}
            activeOpacity={0.8}
            accessibilityLabel="New journal entry"
          >
            <Ionicons
              name="add"
              size={25}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search */}

          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={19}
              color={colors.muted}
            />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search your journal..."
              placeholderTextColor={colors.mutedLight}
              style={styles.searchInput}
              returnKeyType="search"
            />

            {search.length > 0 ? (
              <TouchableOpacity
                onPress={() => setSearch('')}
                hitSlop={8}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.muted}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Date selector */}

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={openCalendar}
            activeOpacity={0.8}
          >
            <View style={styles.datePickerLeft}>
              <View style={styles.datePickerIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>

              <View>
                <Text style={styles.datePickerLabel}>
                  JOURNAL DATE
                </Text>

                <Text style={styles.datePickerValue}>
                  {formatDatePickerLabel(selectedDate)}
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-down"
              size={18}
              color={colors.muted}
            />
          </TouchableOpacity>

          {/* Selected date */}

          {selectedDate ? (
            <View style={styles.dateFilter}>
              <View style={styles.dateFilterLeft}>
                <Ionicons
                  name="filter-outline"
                  size={17}
                  color={colors.primary}
                />

                <Text style={styles.dateFilterText}>
                  Showing entries for{' '}
                  {formatGroupDate(selectedDate)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={clearDate}
                hitSlop={8}
              >
                <Ionicons
                  name="close"
                  size={18}
                  color={colors.muted}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* New entry */}

          <TouchableOpacity
            style={styles.newEntryCard}
            onPress={handleNewEntry}
            activeOpacity={0.8}
          >
            <View style={styles.newEntryIcon}>
              <Ionicons
                name="create-outline"
                size={23}
                color={colors.primary}
              />
            </View>

            <View style={styles.newEntryText}>
              <Text style={styles.newEntryTitle}>
                Write a new entry
              </Text>

              <Text style={styles.newEntrySubtitle}>
                {selectedDate
                  ? `Add an entry for ${formatGroupDate(
                      selectedDate,
                    )}`
                  : 'How are you feeling today?'}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.mutedLight}
            />
          </TouchableOpacity>

          {/* Section heading */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Your entries
            </Text>

            {!loading ? (
              <Text style={styles.entryCount}>
                {filteredEntries.length}
              </Text>
            ) : null}
          </View>

          {/* Loading */}

          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator
                size="small"
                color={colors.primary}
              />

              <Text style={styles.loadingText}>
                Loading your journal...
              </Text>
            </View>
          ) : null}

          {/* Error */}

          {!loading && error ? (
            <View style={styles.errorCard}>
              <Ionicons
                name="alert-circle-outline"
                size={24}
                color={colors.coral}
              />

              <Text style={styles.errorText}>
                {error}
              </Text>

              <TouchableOpacity
                onPress={refresh}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>
                  Try again
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Empty */}

          {!loading &&
          !error &&
          groupedEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name={
                  search || selectedDate
                    ? 'search-outline'
                    : 'book-outline'
                }
                size={40}
                color={colors.mutedLight}
              />

              <Text style={styles.emptyTitle}>
                {search || selectedDate
                  ? 'No entries found'
                  : 'Your journal is empty'}
              </Text>

              <Text style={styles.emptyText}>
                {search || selectedDate
                  ? 'Try changing your search or date filter.'
                  : 'Your thoughts and check-ins will appear here.'}
              </Text>

              {!search && !selectedDate ? (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleNewEntry}
                  activeOpacity={0.8}
                >
                  <Text
                    style={styles.primaryButtonText}
                  >
                    Start journaling
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

          {/* Entries */}

          {!loading &&
          !error &&
          groupedEntries.length > 0
            ? groupedEntries.map(
                ([dateKey, dateEntries]) => (
                  <View
                    key={dateKey}
                    style={styles.dateGroup}
                  >
                    <Text
                      style={styles.dateGroupTitle}
                    >
                      {formatGroupDate(dateKey)}
                    </Text>

                    {dateEntries.map((entry) => {
                      const mood = entry.mood
                        ? MOOD_CONFIG[entry.mood]
                        : null;

                      return (
                        <TouchableOpacity
                          key={entry.id}
                          style={styles.entryCard}
                          onPress={() =>
                            handleEntryPress(entry)
                          }
                          activeOpacity={0.8}
                        >
                          <View
                            style={[
                              styles.moodDot,
                              {
                                backgroundColor:
                                  mood?.color ??
                                  colors.mutedLight,
                              },
                            ]}
                          />

                          <View
                            style={styles.entryMain}
                          >
                            <View
                              style={styles.entryMeta}
                            >
                              <Text
                                style={
                                  styles.entryTime
                                }
                              >
                                {formatTime(
                                  entry.createdAt,
                                )}
                              </Text>

                              {mood ? (
                                <Text
                                  style={[
                                    styles.entryMood,
                                    {
                                      color:
                                        mood.color,
                                    },
                                  ]}
                                >
                                  {mood.label}
                                </Text>
                              ) : null}
                            </View>

                            {entry.title ? (
                              <Text
                                style={styles.entryTitle}
                                numberOfLines={1}
                              >
                                {entry.title}
                              </Text>
                            ) : null}

                            <Text
                              style={
                                styles.entryContent
                              }
                              numberOfLines={2}
                            >
                              {entry.content ||
                                'No written notes.'}
                            </Text>
                          </View>

                          <Ionicons
                            name="chevron-forward"
                            size={19}
                            color={colors.mutedLight}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ),
              )
            : null}
        </ScrollView>
      </View>

      {/* Custom calendar sheet */}

      <CalendarSheet
        visible={showCalendar}
        visibleMonth={visibleMonth}
        onChangeMonth={setVisibleMonth}
        selectedDate={selectedDate}
        dayMoodsMap={dayMoodsMap}
        onSelect={handleSelectDate}
        onClose={closeCalendar}
      />
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Calendar sheet
 *
 * Custom in-app month picker. Monday-first grid. Tapping a day
 * commits it immediately and closes the sheet. The visible month
 * is controlled from the parent so we can seed it from the
 * current selection each time the sheet opens.
 * ────────────────────────────────────────────────────────────── */

type CalendarSheetProps = {
  visible: boolean;
  visibleMonth: { year: number; month: number };
  onChangeMonth: (next: {
    year: number;
    month: number;
  }) => void;
  selectedDate?: string;
  dayMoodsMap: Record<string, MoodLevel[]>;
  onSelect: (dateKey: string) => void;
  onClose: () => void;
};

function CalendarSheet({
  visible,
  visibleMonth,
  onChangeMonth,
  selectedDate,
  dayMoodsMap,
  onSelect,
  onClose,
}: CalendarSheetProps) {
  const { year, month } = visibleMonth;

  const todayKey = getLocalDateKey(new Date());

  const monthLabel = new Date(
    year,
    month,
  ).toLocaleDateString('en-NZ', {
    month: 'long',
    year: 'numeric',
  });

  const firstDayOfMonth = new Date(
    year,
    month,
    1,
  ).getDay();

  // Convert Sunday-first JS index to Monday-first offset.
  const mondayFirstOffset =
    firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const daysInMonth = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  const cells: (number | null)[] = [
    ...Array(mondayFirstOffset).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => i + 1,
    ),
  ];

  // Pad to a whole number of weeks so the sheet height is stable
  // when navigating between months.
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const goPrev = () => {
    if (month === 0) {
      onChangeMonth({ year: year - 1, month: 11 });
    } else {
      onChangeMonth({ year, month: month - 1 });
    }
  };

  const goNext = () => {
    if (month === 11) {
      onChangeMonth({ year: year + 1, month: 0 });
    } else {
      onChangeMonth({ year, month: month + 1 });
    }
  };

  const goToday = () => {
  const now = new Date();
  const todayKey = getLocalDateKey(now);

  onSelect(todayKey);
};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.sheetBackdrop}
        onPress={onClose}
      >
        <Pressable
          style={styles.sheet}
          onPress={() => {}}
        >
          {/* Month navigation */}

          <View style={styles.sheetNavRow}>
            <TouchableOpacity
              onPress={goPrev}
              style={styles.sheetNavBtn}
              accessibilityLabel="Previous month"
              hitSlop={8}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>

            <Text style={styles.sheetMonthLabel}>
              {monthLabel}
            </Text>

            <TouchableOpacity
              onPress={goNext}
              style={styles.sheetNavBtn}
              accessibilityLabel="Next month"
              hitSlop={8}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Weekday labels */}

          <View style={styles.sheetWeekRow}>
            {WEEKDAY_LABELS.map((label) => (
              <Text
                key={label}
                style={styles.sheetWeekLabel}
              >
                {label}
              </Text>
            ))}
          </View>

          {/* Day grid */}

          <View style={styles.sheetGrid}>
            {cells.map((day, index) => {
              if (day === null) {
                return (
                  <View
                    key={`blank-${index}`}
                    style={styles.sheetCell}
                  />
                );
              }

              const dateKey = createDateKey(
                year,
                month,
                day,
              );

              const isSelected =
                dateKey === selectedDate;
              const isToday = dateKey === todayKey;

              const moods =
                dayMoodsMap[dateKey] ?? [];
              const hasEntries = moods.length > 0;

              return (
                <TouchableOpacity
                  key={dateKey}
                  style={styles.sheetCell}
                  onPress={() => onSelect(dateKey)}
                  activeOpacity={0.7}
                  accessibilityLabel={`${day} ${monthLabel}${
                    hasEntries
                      ? `, ${moods.length} entr${
                          moods.length === 1
                            ? 'y'
                            : 'ies'
                        }`
                      : ''
                  }`}
                >
                  <View
                    style={[
                      styles.sheetDayBubble,
                      isToday &&
                        !isSelected &&
                        styles.sheetDayToday,
                      isSelected &&
                        styles.sheetDaySelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sheetDayText,
                        isToday &&
                          !isSelected &&
                          styles.sheetDayTextToday,
                        isSelected &&
                          styles.sheetDayTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>

                  <View style={styles.sheetDotsRow}>
                    {moods.map((mood, i) => (
                      <View
                        key={`${mood}-${i}`}
                        style={[
                          styles.sheetDot,
                          {
                            backgroundColor:
                              MOOD_CONFIG[mood]
                                ?.color ??
                              colors.mutedLight,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer actions */}

          <View style={styles.sheetFooter}>
            <TouchableOpacity
              onPress={goToday}
              style={styles.sheetFooterBtn}
              activeOpacity={0.7}
            >
              <Ionicons
                name="today-outline"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.sheetFooterBtnText}>
                Jump to today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={styles.sheetFooterBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetFooterCloseText}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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

  header: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  eyebrow: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.muted,
    marginBottom: spacing.xs,
  },

  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: colors.ink,
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  searchContainer: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
  },

  searchInput: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
    marginLeft: spacing.sm,
    paddingVertical: spacing.sm,
  },

  datePickerButton: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },

  datePickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  datePickerIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  datePickerLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.muted,
  },

  datePickerValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink,
    marginTop: 3,
  },

  dateFilter: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },

  dateFilterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  dateFilterText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.primary,
    marginLeft: spacing.sm,
  },

  newEntryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },

  newEntryIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  newEntryText: {
    flex: 1,
    marginLeft: spacing.md,
  },

  newEntryTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },

  newEntrySubtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },

  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 23,
    color: colors.ink,
  },

  entryCount: {
    minWidth: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginLeft: spacing.sm,
    paddingHorizontal: 6,
  },

  loadingState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },

  loadingText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    marginTop: spacing.md,
  },

  errorCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },

  errorText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  retryButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },

  retryText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.primary,
  },

  emptyState: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },

  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 23,
    color: colors.ink,
    marginTop: spacing.md,
  },

  emptyText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  primaryButton: {
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },

  primaryButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.white,
  },

  dateGroup: {
    marginBottom: spacing.xl,
  },

  dateGroupTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.muted,
    marginBottom: spacing.sm,
  },

  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },

  moodDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    marginRight: spacing.md,
  },

  entryMain: {
    flex: 1,
    minWidth: 0,
  },

  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  entryTime: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },

  entryMood: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    marginLeft: spacing.sm,
  },

  entryTitle: {
    fontFamily: fonts.serif,
    fontSize: 19,
    lineHeight: 24,
    color: colors.ink,
    marginTop: spacing.xs,
  },

  entryContent: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    marginTop: spacing.xs,
  },

  // ── Calendar sheet ──

  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },

  sheetNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  sheetNavBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sheetMonthLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.ink,
  },

  sheetWeekRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },

  sheetWeekLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.muted,
  },

  sheetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  sheetCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },

  sheetDayBubble: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sheetDayToday: {
    backgroundColor: colors.primaryLight,
  },

  sheetDaySelected: {
    backgroundColor: colors.primary,
  },

  sheetDayText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },

  sheetDayTextToday: {
    fontFamily: fonts.sansSemiBold,
    color: colors.primary,
  },

  sheetDayTextSelected: {
    fontFamily: fonts.sansSemiBold,
    color: colors.white,
  },

  sheetDotsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
    height: 6,
    justifyContent: 'center',
  },

  sheetDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  sheetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  sheetFooterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },

  sheetFooterBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.primary,
  },

  sheetFooterCloseText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
  },
});