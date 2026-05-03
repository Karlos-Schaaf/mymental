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
import { useEntriesStore } from '../../store/entriesStore';
import { colors, fonts, spacing, radius } from '../src/constants/theme';

export default function ProfileScreen() {
  const { entries, getStreak } = useEntriesStore();
  const streak = getStreak();

  const totalWords = entries.reduce((sum, e) => {
    return sum + e.body.split(/\s+/).filter(Boolean).length;
  }, 0);

  const joinDate =
    entries.length > 0
      ? new Date(
          entries[entries.length - 1].createdAt
        ).toLocaleDateString('en-NZ', {
          month: 'long',
          year: 'numeric',
        })
      : 'Just now';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerDecor} />
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>J</Text>
        </View>
        <Text style={styles.name}>Your Journal</Text>
        <Text style={styles.since}>Since {joinDate}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{entries.length}</Text>
            <Text style={styles.statName}>Entries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: colors.coral }]}>{streak}</Text>
            <Text style={styles.statName}>Day streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: colors.teal }]}>
              {totalWords > 999
                ? `${(totalWords / 1000).toFixed(1)}k`
                : totalWords}
            </Text>
            <Text style={styles.statName}>Words</Text>
          </View>
        </View>

        {/* Settings section */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.settingsCard}>
          <SettingsRow label="Daily reminder" value="8:00 PM" />
          <View style={styles.divider} />
          <SettingsRow label="Notifications" value="On" />
          <View style={styles.divider} />
          <SettingsRow label="App theme" value="Light" />
        </View>

        <Text style={styles.sectionLabel}>Data</Text>
        <View style={styles.settingsCard}>
          <SettingsRow label="Export entries" value="→" />
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              Alert.alert(
                'Clear all data',
                'This will delete every entry permanently. Are you sure?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete all',
                    style: 'destructive',
                    onPress: () => {
                      /* hook into store clear if needed */
                    },
                  },
                ]
              )
            }
          >
            <Text style={[styles.rowLabel, { color: '#C0503A' }]}>
              Clear all data
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionNote}>
          Mindful Journal · v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
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
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecor: {
    position: 'absolute',
    top: -50,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.amber,
    opacity: 0.15,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.paper,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.paper,
  },
  since: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: '#A09890',
    marginTop: 4,
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
    padding: spacing.md,
    alignItems: 'center',
  },
  statNum: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 22,
    color: colors.ink,
  },
  statName: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.mutedLight,
    marginTop: 2,
  },
  sectionLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginBottom: -spacing.sm,
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  rowLabel: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
  },
  rowValue: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.mutedLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  versionNote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mutedLight,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
