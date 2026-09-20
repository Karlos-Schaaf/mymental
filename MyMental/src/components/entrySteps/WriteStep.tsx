import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

import { colors, fonts, spacing, radius } from '../../constants/theme';

type WriteStepProps = {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
};

export default function WriteStep({
  title,
  content,
  onTitleChange,
  onContentChange,
}: WriteStepProps) {
  return (
    <View style={styles.box}>
      <TextInput
        style={styles.titleInput}
        placeholder="Entry title (optional)"
        placeholderTextColor={colors.mutedLight}
        value={title}
        onChangeText={onTitleChange}
        maxLength={80}
        accessibilityLabel="Journal entry title"
      />
      <View style={styles.divider} />
      <TextInput
        style={styles.contentInput}
        placeholder="Start writing… How are you feeling today?"
        placeholderTextColor={colors.mutedLight}
        multiline
        value={content}
        onChangeText={onContentChange}
        textAlignVertical="top"
        maxLength={1000}
        accessibilityLabel="Journal entry content"
      />
      <Text style={styles.charCount}>{content.length}/1000</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  titleInput: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  contentInput: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    minHeight: 140,
    lineHeight: 22,
  },
  charCount: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
});
