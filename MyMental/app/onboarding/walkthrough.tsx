import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, spacing, radius } from '../../src/constants/theme';

type Slide = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

const slides: Slide[] = [
  {
    id: 'dashboard',
    icon: 'home-outline',
    title: 'Your wellbeing at a glance',
    description:
      'Your dashboard gives you a simple overview of your mood, check-ins, and recent wellbeing activity.',
  },
  {
    id: 'journal',
    icon: 'book-outline',
    title: 'A space for your thoughts',
    description:
      'Use your journal to reflect on your day, record how you feel, and keep track of your experiences.',
  },
  {
    id: 'insights',
    icon: 'bulb-outline',
    title: 'Understand yourself better',
    description:
      'Insights help you notice patterns in your mood and reflections over time.',
  },
  {
    id: 'resources',
    icon: 'heart-outline',
    title: 'Support when you need it',
    description:
      'Explore wellbeing support, emergency contacts, self-care ideas, stress management, and other helpful resources.',
  },
  {
    id: 'complete',
    icon: 'checkmark-outline',
    title: "You're all set!",
    description:
      'Your MyMental space is ready. Start with your first journal entry or explore your dashboard.',
  },
];

export default function WalkthroughScreen() {
  const { width } = useWindowDimensions();
  const { name } = useLocalSearchParams<{ name?: string }>();

  const firstName =
    typeof name === 'string' && name.trim()
      ? name.trim().split(' ')[0]
      : 'there';

  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === slides.length - 1;

  const goToSlide = (index: number) => {
    if (index < 0 || index >= slides.length) return;

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });

    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (!isLastSlide) {
      goToSlide(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      router.back();
      return;
    }

    goToSlide(currentIndex - 1);
  };

  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);

    setCurrentIndex(index);
  };

  const handleJournal = () => {
    // Later we will save onboardingCompleted = true before navigating.
    router.replace('/journal');
  };

  const handleHome = () => {
    // Later we will save onboardingCompleted = true before navigating.
    router.replace('/(tabs)');
  };

  const renderSlide = ({
    item,
    index,
  }: {
    item: Slide;
    index: number;
  }) => {
    const finalSlide = item.id === 'complete';

    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.slideContent}>
          <View
            style={[
              styles.iconCircle,
              finalSlide && styles.completeIconCircle,
            ]}
          >
            <Ionicons
              name={item.icon}
              size={46}
              color={colors.teal}
            />
          </View>

          {index === 0 && (
            <Text style={styles.hello}>
              Nice to meet you, {firstName} 👋
            </Text>
          )}

          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.description}>
            {item.description}
          </Text>

          {finalSlide && (
            <View style={styles.finalActions}>
              <TouchableOpacity
                style={styles.journalButton}
                onPress={handleJournal}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={colors.white}
                />

                <Text style={styles.journalButtonText}>
                  Write My First Journal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.homeButton}
                onPress={handleHome}
                activeOpacity={0.8}
              >
                <Text style={styles.homeButtonText}>
                  Go to Home
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top controls */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.ink}
            />
          </TouchableOpacity>

          {!isLastSlide && (
            <TouchableOpacity
              onPress={() => goToSlide(slides.length - 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Swipeable walkthrough */}
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={handleScrollEnd}
          keyboardShouldPersistTaps="handled"
        />

        {/* Bottom navigation */}
        {!isLastSlide && (
          <View style={styles.bottomArea}>
            <View style={styles.dots}>
              {slides.map((slide, index) => (
                <View
                  key={slide.id}
                  style={[
                    styles.dot,
                    index === currentIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.nextButtonText}>
                Next
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        )}

        {isLastSlide && (
          <View style={styles.finalDots}>
            <View style={styles.dots}>
              {slides.map((slide, index) => (
                <View
                  key={slide.id}
                  style={[
                    styles.dot,
                    index === currentIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
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
    height: 60,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  skipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.muted,
  },

  slide: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xxl,
  },

  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: radius.full,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },

  completeIconCircle: {
    width: 110,
    height: 110,
  },

  hello: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.teal,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 27,
    lineHeight: 34,
    color: colors.ink,
    textAlign: 'center',
    maxWidth: 340,
  },

  description: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 23,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 340,
    marginTop: spacing.md,
  },

  bottomArea: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },

  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },

  activeDot: {
    width: 24,
    backgroundColor: colors.teal,
  },

  nextButton: {
    minHeight: 56,
    borderRadius: radius.full,
    backgroundColor: colors.teal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  nextButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.white,
  },

  finalActions: {
    width: '100%',
    marginTop: spacing.xxl,
    gap: spacing.md,
  },

  journalButton: {
    minHeight: 56,
    borderRadius: radius.full,
    backgroundColor: colors.teal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  journalButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.white,
  },

  homeButton: {
    minHeight: 54,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
  },

  finalDots: {
    paddingBottom: spacing.lg,
  },
});