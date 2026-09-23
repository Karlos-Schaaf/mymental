import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, fonts, radius, spacing } from '../../src/constants/theme';
import { auth } from '../../src/firebase/auth';
import {
  completeOnboarding,
  DEFAULT_JOURNALING_OPTIONS,
  JournalTrackingOption,
  updateJournalingPrefs,
} from '../../src/firebase/firestore';

type TrackingItem = {
  id: JournalTrackingOption;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const OPTIONS: TrackingItem[] = [
  {
    id: 'mood',
    title: 'Mood',
    icon: 'happy-outline',
  },
  {
    id: 'energy',
    title: 'Energy',
    icon: 'flash-outline',
  },
  {
    id: 'stress',
    title: 'Stress',
    icon: 'pulse-outline',
  },
  {
    id: 'journal',
    title: 'Journal',
    icon: 'create-outline',
  },
  {
    id: 'sleep',
    title: 'Sleep',
    icon: 'moon-outline',
  },
  {
    id: 'productivity',
    title: 'Productivity',
    icon: 'checkmark-done-outline',
  },
  {
    id: 'physicalActivity',
    title: 'Physical Activity',
    icon: 'walk-outline',
  },
  {
    id: 'socialInteraction',
    title: 'Social',
    icon: 'people-outline',
  },
  {
    id: 'screenTime',
    title: 'Screen Time',
    icon: 'phone-portrait-outline',
  },
];

export default function JournalingPreferencesScreen() {
  const [selected, setSelected] = useState<JournalTrackingOption[]>(
    DEFAULT_JOURNALING_OPTIONS
  );

  const [saving, setSaving] = useState(false);

  const toggleOption = (option: JournalTrackingOption) => {
    // Mood must always stay selected.
    if (option === 'mood') {
      return;
    }

    setSelected((current) => {
      const isSelected = current.includes(option);

      if (isSelected) {
        // At least 3 options must always remain selected.
        if (current.length <= 3) {
          return current;
        }

        return current.filter((item) => item !== option);
      }

      return [...current, option];
    });
  };

  const handleContinue = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert(
        'Unable to save',
        'Please sign in again and try again.'
      );
      return;
    }

    if (selected.length < 3) {
      Alert.alert(
        'Choose at least 3',
        'Please select at least three journaling options.'
      );
      return;
    }

    try {
      setSaving(true);

      // Save the selected tracking options.
      await updateJournalingPrefs(user.uid, selected);

      // The full onboarding process is now complete.
      await completeOnboarding(user.uid);

      // Enter the main application.
      router.replace('/(tabs)');
    } catch (error) {
      console.error(
        'Failed to save journaling preferences:',
        error
      );

      Alert.alert(
        'Unable to save',
        'Your journaling preferences could not be saved. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="options-outline"
              size={30}
              color={colors.primary}
            />
          </View>

          <Text style={styles.title}>
            What would you like to track?
          </Text>

          <Text style={styles.subtitle}>
            Choose what you'd like to include in your journal.
            You can change these later in Journaling Settings.
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.primary}
          />

          <Text style={styles.infoText}>
            Choose at least 3. Mood is always included.
          </Text>
        </View>

        <View style={styles.grid}>
          {OPTIONS.map((option) => {
            const isSelected = selected.includes(option.id);
            const isMood = option.id === 'mood';

            return (
              <Pressable
                key={option.id}
                onPress={() => toggleOption(option.id)}
                style={({ pressed }) => [
                  styles.card,
                  isSelected && styles.selectedCard,
                  pressed && styles.pressedCard,
                ]}
              >
                <View style={styles.cardTop}>
                  <Ionicons
                    name={option.icon}
                    size={28}
                    color={
                      isSelected
                        ? colors.primary
                        : colors.ink
                    }
                  />

                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <Ionicons
                        name={
                          isMood
                            ? 'lock-closed'
                            : 'checkmark'
                        }
                        size={13}
                        color="#FFFFFF"
                      />
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.cardText,
                    isSelected &&
                      styles.selectedCardText,
                  ]}
                >
                  {option.title}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.selectionCount}>
          {selected.length} selected
        </Text>

        <Pressable
          onPress={handleContinue}
          disabled={saving}
          style={({ pressed }) => [
            styles.continueButton,
            pressed && !saving && styles.pressedButton,
            saving && styles.disabledButton,
          ]}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.continueText}>
                Continue
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paperDim,
    marginBottom: spacing.md,
  },

  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 26,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink2,
    textAlign: 'center',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },

  infoText: {
    flexShrink: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink2,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },

  card: {
    width: '31%',
    minHeight: 112,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.paperDim,
    padding: 12,
    justifyContent: 'space-between',
  },

  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.paperDim,
  },

  pressedCard: {
    opacity: 0.75,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    lineHeight: 17,
    color: colors.ink,
  },

  selectedCardText: {
    color: colors.primary,
  },

  selectionCount: {
    fontFamily: fonts.sansMedium,
    color: colors.ink2,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  continueButton: {
    minHeight: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  pressedButton: {
    opacity: 0.85,
  },

  disabledButton: {
    opacity: 0.6,
  },

  continueText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});