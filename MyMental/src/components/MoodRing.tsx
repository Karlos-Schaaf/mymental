import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/theme';

type MoodRingProps = {
  value: number | null; // 0–10, or null for the empty state
  size?: number;
  strokeWidth?: number;
};

export default function MoodRing({
  value,
  size = 88,
  strokeWidth = 8,
}: MoodRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = value === null ? 0 : Math.max(0, Math.min(1, value / 10));
  const strokeDashoffset = circumference * (1 - progress);

  const iconName = value === null ? 'ellipse-outline' : 'happy-outline';
  const iconColor = value === null ? colors.mutedLight : colors.teal;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.tealLight}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {value !== null && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.teal}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            rotation={-90}
            originX={size / 2}
            originY={size / 2}
          />
        )}
      </Svg>
      <View style={[styles.iconOverlay, { width: size, height: size }]}>
        <Ionicons name={iconName} size={size * 0.42} color={iconColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
