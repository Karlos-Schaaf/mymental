import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, spacing, radius } from '../constants/theme';

type AuthTextFieldProps = {
  icon: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
} & TextInputProps;

export default function AuthTextField({
  icon,
  isPassword,
  ...inputProps
}: AuthTextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.wrapper, focused && styles.wrapperFocused]}>
      <Ionicons name={icon} size={19} color={colors.mutedLight} />

      <TextInput
        style={styles.input}
        placeholderTextColor={colors.mutedLight}
        secureTextEntry={isPassword && !visible}
        onFocus={(e) => {
          setFocused(true);
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          inputProps.onBlur?.(e);
        }}
        {...inputProps}
      />

      {isPassword && (
        <TouchableOpacity
          onPress={() => setVisible((prev) => !prev)}
          activeOpacity={0.6}
          hitSlop={8}
        >
          <Ionicons
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={19}
            color={colors.mutedLight}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  wrapperFocused: {
    borderColor: colors.coral,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    height: '100%',
  },
});
