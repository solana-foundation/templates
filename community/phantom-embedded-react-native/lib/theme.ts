/**
 * Brand Theme Colors
 * Single source of truth for all color tokens
 * Updated for Phantom SDK v1.0.0-beta.26 with modal support
 */
export const colors = {
  // Primary brand colors
  ink: '#0f172a',
  brand: '#0ea5e9',
  paper: '#ffffff',

  // Secondary colors
  yellow: '#eab308',
  blue: '#3b82f6',
  coral: '#f87171',
  green: '#22c55e',
  slate: '#64748b',
  orange: '#f97316',
  vanilla: '#fef3c7',
  navy: '#1e293b',

  // Grays
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
}

/**
 * Semantic color tokens
 */
export const semantic = {
  textDefault: colors.ink,
  textMuted: colors.gray400,
  bgPage: colors.paper,
  bgSurface: '#ffffff',
  borderSubtle: colors.gray100,
  focusRing: colors.brand,
  link: colors.brand,
  success: colors.green,
  warning: colors.orange,
  info: colors.blue,
  error: colors.coral,
}

/**
 * Dark mode colors (for mobile app)
 */
export const darkColors = {
  bgPage: '#0f0f10',
  bgSurface: '#141416',
  textDefault: '#f6f6f6',
  textMuted: '#c9c9c9',
  borderSubtle: '#2a2a2b',
  // Keep brand hues identical to preserve recognition
  brand: colors.brand,
  success: colors.green,
  warning: colors.orange,
  error: colors.coral,
}
