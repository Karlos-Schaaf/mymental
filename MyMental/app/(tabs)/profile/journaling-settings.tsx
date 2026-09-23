import React, { useEffect, useState } from 'react';
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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, spacing, radius } from '../../../src/constants/theme';
import { auth } from '../../../src/firebase/auth';
import {
  DEFAULT_JOURNALING_OPTIONS,
  getUserDoc,
  JournalTrackingOption,
  updateJournalingPrefs,
} from '../../../src/firebase/firestore';
import ScreenHeader from '../../../src/components/ScreenHeader';

type TrackingItem = {
  id: JournalTrackingOption;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const OPTIONS: TrackingItem[] = [
  { id: 'mood', title: 'Mood', icon: 'happy-outline' },
  { id: 'energy', title: 'Energy', icon: 'flash-outline' },
  { id: 'stress', title: 'Stress', icon: 'pulse-outline' },
  { id: 'journal', title: 'Journal', icon: 'create-outline' },
  { id: 'sleep', title: 'Sleep', icon: 'moon-outline' },
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

export default function JournalingSettingsScreen() {
  const [selected, setSelected] = useState<JournalTrackingOption[]>(
    DEFAULT_JOURNALING_OPTIONS
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getUserDoc(user.uid);

        const savedOptions =
          userDoc?.preferences?.journaling?.trackingOptions;

        if (Array.isArray(savedOptions) && savedOptions.length >= 3) {
          const validOptions = savedOptions.filter(
            (option: JournalTrackingOption) =>
              OPTIONS.some((item) => item.id === option)
          );

          if (
            validOptions.length >= 3 &&
            validOptions.includes('mood')
          ) {
            setSelected(validOptions);
          }
        }
      } catch (error) {
        console.error('Failed to load journaling preferences:', error);
        Alert.alert(
          'Error',
          'Your journaling settings could not be loaded.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const toggleOption = (option: JournalTrackingOption) => {
    // Mood must always remain selected.
    if (option === 'mood') {
      return;
    }

    const isSelected = selected.includes(option);

    // At least 3 tracking options must remain selected.
    if (isSelected && selected.length <= 3) {
      Alert.alert(
        'Choose at least 3',
        'You need to keep at least 3 journaling options selected.'
      );
      return;
    }

    setSelected((current) =>
      isSelected
        ? current.filter((item) => item !== option)
        : [...current, option]
    );
  };

  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'You need to be signed in to save your settings.');
      return;
    }

    if (selected.length < 3) {
      Alert.alert(
        'Choose at least 3',
        'Please select at least 3 journaling options.'
      );
      return;
    }

    try {
      setSaving(true);

      await updateJournalingPrefs(user.uid, selected);

      Alert.alert(
        'Settings Saved',
        'Your journaling preferences have been updated.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to save journaling preferences:', error);
      Alert.alert(
        'Error',
        'Your journaling settings could not be saved. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader
          title="Journaling Settings"
          onBack={() => router.back()}
        />

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.teal} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Journaling Settings"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.title}>What would you like to track?</Text>

          <Text style={styles.description}>
            Choose the information you want to include when journaling.
            Select at least 3. Mood is always included.
          </Text>
        </View>

        <View style={styles.grid}>
          {OPTIONS.map((item) => {
            const isSelected = selected.includes(item.id);
            const isMood = item.id === 'mood';

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => toggleOption(item.id)}
                activeOpacity={0.75}
              >
                <View style={styles.optionTop}>
                  <Ionicons
                    name={item.icon}
                    size={28}
                    color={isSelected ? colors.teal : colors.ink2}
                  />

                  {isSelected && (
                    <Ionicons
                      name={
                        isMood
                          ? 'lock-closed'
                          : 'checkmark-circle'
                      }
                      size={18}
                      color={colors.teal}
                    />
                  )}
                </View>

                <Text
                  style={[
                    styles.optionTitle,
                    isSelected && styles.optionTitleSelected,
                  ]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.selectionCount}>
          {selected.length} selected
        </Text>

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons
                name="checkmark-outline"
                size={20}
                color={colors.white}
              />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 22,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.ink2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  optionCard: {
    width: '31%',
    minHeight: 112,
    backgroundColor: colors.paperDim,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  optionCardSelected: {
    backgroundColor: colors.tealLight,
    borderColor: colors.teal,
    borderWidth: 2,
  },
  optionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  optionTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink2,
  },
  optionTitleSelected: {
    color: colors.ink,
  },
  selectionCount: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink2,
    textAlign: 'center',
  },
  saveButton: {
    minHeight: 56,
    borderRadius: radius.full,
    backgroundColor: colors.teal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.white,
  },
});