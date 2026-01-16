/**
 * Theme Configuration - Colors & Typography
 * Centralized styling for consistent UI across the app
 */

export const colors = {
  // Primary Colors
  primary: '#4CAF50',
  primaryLight: '#81C784',
  primaryDark: '#2E7D32',

  // Secondary Colors
  secondary: '#FF9800',
  secondaryLight: '#FFB74D',
  secondaryDark: '#F57C00',

  // Backgrounds
  background: '#FFFFFF',
  backgroundLight: '#F5F5F5',
  backgroundDark: '#FAFAFA',

  // Text Colors
  text: '#212121',
  textSecondary: '#757575',
  textTertiary: '#BDBDBD',
  textLight: '#EEEEEE',

  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#D0D0D0',

  // Status Colors
  success: '#4CAF50',
  successLight: '#C8E6C9',
  warning: '#FF9800',
  warningLight: '#FFE0B2',
  error: '#F44336',
  errorLight: '#FFCDD2',
  info: '#2196F3',
  infoLight: '#BBDEFB',

  // Utility
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  disabled: '#E0E0E0',
  disabledText: '#BDBDBD',
};

export const typography = {
  fontSizeXS: 10,
  fontSizeSM: 12,
  fontSizeMD: 14,
  fontSizeLG: 16,
  fontSizeXL: 18,
  fontSize2XL: 20,
  fontSize3XL: 24,
  fontSize4XL: 28,

  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',

  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
  lineHeightLoose: 2,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  md: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  lg: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export default theme;
