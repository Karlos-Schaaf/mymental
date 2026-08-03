export const colors = {
  // Core palette
  ink: '#1a1612',
  ink2: '#3d3530',
  paper: '#FDF8F3',
  paperDim: '#F5EFE8',

  // Coral — primary brand
  coral: '#D85A30',
  coralMid: '#F0997B',
  coralLight: '#FAECE7',

  // Accent — purple
  accent: '#533AB7',
  accentLight: '#EEEDFE',

  // Teal — positive/calm
  teal: '#1D9E75',
  tealLight: '#E1F5EE',

  // Amber — warning/anxious
  amber: '#BA7517',
  amberLight: '#FAEEDA',

  // Neutrals
  border: '#E8E0D8',
  muted: '#A09080',
  mutedLight: '#B0A898',
  white: '#FFFFFF',
};

export const fonts = {
  serif: 'DMSerifDisplay_400Regular',
  serifItalic: 'DMSerifDisplay_400Regular_Italic',
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansSemiBold: 'DMSans_600SemiBold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const moods = [
  { label: 'Calm', color: colors.teal, bg: colors.tealLight },
  { label: 'Hopeful', color: colors.accent, bg: colors.accentLight },
  { label: 'Anxious', color: colors.amber, bg: colors.amberLight },
  { label: 'Grateful', color: colors.accent, bg: colors.accentLight },
  { label: 'Tired', color: colors.muted, bg: colors.paperDim },
  { label: 'Joyful', color: colors.coral, bg: colors.coralLight },
  { label: 'Sad', color: '#185FA5', bg: '#E6F1FB' },
  { label: 'Energised', color: colors.teal, bg: colors.tealLight },
];
