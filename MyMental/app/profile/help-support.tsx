import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, spacing, radius } from '../../src/constants/theme';
import ScreenHeader from '../../src/components/ScreenHeader';

const FAQS = [
  {
    question: 'How do I edit or delete a journal entry?',
    answer:
      'Open the entry from your Journal tab, then use the menu in the top right to edit or delete it.',
  },
  {
    question: 'Is my journal private?',
    answer:
      'Yes. Entries are tied to your account and are not visible to other users or shared with third parties.',
  },
  {
    question: 'Can I use MyMental offline?',
    answer:
      'Offline support is planned for a future update. For now, an internet connection is needed to save entries.',
  },
  {
    question: 'How do I change my password?',
    answer:
      'Go to Profile → Privacy & Security, then use the Change Password section.',
  },
];

function FaqItem({
  question,
  answer,
  isLast,
}: {
  question: string;
  answer: string;
  isLast?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.faqItem, !isLast && styles.faqItemBorder]}
      onPress={() => setOpen((prev) => !prev)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.mutedLight}
        />
      </View>
      {open && <Text style={styles.faqAnswer}>{answer}</Text>}
    </TouchableOpacity>
  );
}

export default function HelpSupportScreen() {
  const handleContactSupport = () => {
    Linking.openURL(
      'mailto:support@mymental.app?subject=MyMental%20Support%20Request',
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Help & Support" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Crisis support banner */}
        <View style={styles.crisisCard}>
          <Text style={styles.crisisTitle}>Need to talk to someone now?</Text>
          <Text style={styles.crisisText}>
            If you're in crisis or thinking about suicide, please reach out to
            a crisis line in your country right away. In the US, call or text
            988. In New Zealand, call or text 1737. If you're outside these
            countries, search "crisis helpline" plus your country name to find
            local support.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>
        <View style={styles.card}>
          {FAQS.map((faq, index) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isLast={index === FAQS.length - 1}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Still need help?</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactSupport}
          activeOpacity={0.8}
        >
          <Ionicons name="mail-outline" size={18} color={colors.white} />
          <Text style={styles.contactButtonText}>Contact Support</Text>
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
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  crisisCard: {
    backgroundColor: colors.amberLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  crisisTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
  },
  crisisText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink2,
    lineHeight: 19,
  },
  sectionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
    marginBottom: -spacing.xs,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  faqItem: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  faqItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink,
  },
  faqAnswer: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },
  contactButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.lg,
  },
  contactButtonText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.white,
  },
});
