/**
 * Theme Tests
 * Unit tests for theme configuration exports
 */

import theme, { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';

describe('Theme', () => {
  describe('colors', () => {
    it('should export primary color', () => {
      expect(colors.primary).toBe('#4CAF50');
    });

    it('should export error color', () => {
      expect(colors.error).toBe('#F44336');
    });

    it('should export all required color groups', () => {
      expect(colors.primary).toBeDefined();
      expect(colors.secondary).toBeDefined();
      expect(colors.background).toBeDefined();
      expect(colors.text).toBeDefined();
      expect(colors.border).toBeDefined();
      expect(colors.success).toBeDefined();
      expect(colors.warning).toBeDefined();
      expect(colors.error).toBeDefined();
      expect(colors.info).toBeDefined();
    });

    it('should have valid hex color format', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      expect(colors.primary).toMatch(hexColorRegex);
      expect(colors.secondary).toMatch(hexColorRegex);
      expect(colors.error).toMatch(hexColorRegex);
    });
  });

  describe('typography', () => {
    it('should export font size values', () => {
      expect(typography.fontSizeXS).toBe(10);
      expect(typography.fontSizeSM).toBe(12);
      expect(typography.fontSizeMD).toBe(14);
      expect(typography.fontSizeLG).toBe(16);
      expect(typography.fontSizeXL).toBe(18);
    });

    it('should export font weight values', () => {
      expect(typography.fontWeightRegular).toBe('400');
      expect(typography.fontWeightBold).toBe('700');
    });

    it('should have increasing font sizes', () => {
      expect(typography.fontSizeXS).toBeLessThan(typography.fontSizeSM);
      expect(typography.fontSizeSM).toBeLessThan(typography.fontSizeMD);
      expect(typography.fontSizeMD).toBeLessThan(typography.fontSizeLG);
      expect(typography.fontSizeLG).toBeLessThan(typography.fontSizeXL);
    });
  });

  describe('spacing', () => {
    it('should export spacing scale', () => {
      expect(spacing.xs).toBe(4);
      expect(spacing.sm).toBe(8);
      expect(spacing.md).toBe(12);
      expect(spacing.lg).toBe(16);
      expect(spacing.xl).toBe(20);
    });

    it('should have increasing spacing values', () => {
      expect(spacing.xs).toBeLessThan(spacing.sm);
      expect(spacing.sm).toBeLessThan(spacing.md);
      expect(spacing.md).toBeLessThan(spacing.lg);
      expect(spacing.lg).toBeLessThan(spacing.xl);
    });
  });

  describe('borderRadius', () => {
    it('should export border radius values', () => {
      expect(borderRadius.sm).toBe(4);
      expect(borderRadius.md).toBe(8);
      expect(borderRadius.lg).toBe(12);
      expect(borderRadius.full).toBe(9999);
    });
  });

  describe('shadows', () => {
    it('should export shadow presets with required properties', () => {
      expect(shadows.sm).toEqual(expect.objectContaining({
        elevation: expect.any(Number),
        shadowColor: expect.any(String),
        shadowOffset: expect.any(Object),
        shadowOpacity: expect.any(Number),
        shadowRadius: expect.any(Number),
      }));
    });

    it('should have increasing shadow elevations', () => {
      expect(shadows.sm.elevation).toBeLessThan(shadows.md.elevation);
      expect(shadows.md.elevation).toBeLessThan(shadows.lg.elevation);
    });
  });

  describe('default export', () => {
    it('should include all theme sections', () => {
      expect(theme.colors).toBeDefined();
      expect(theme.typography).toBeDefined();
      expect(theme.spacing).toBeDefined();
      expect(theme.borderRadius).toBeDefined();
      expect(theme.shadows).toBeDefined();
    });
  });
});
