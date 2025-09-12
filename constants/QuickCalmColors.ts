/**
 * Be Bored App Color Scheme
 * Dark, calming theme with warm amber accents
 */

export const QuickCalmColors = {
  // Primary background - nearly black with subtle blue tone
  background: '#0F1115',

  // Text colors
  primaryText: '#E6E6E6',    // Soft white for main text
  secondaryText: '#A8ADB5',   // Gray for secondary text

  // Accent color - warm amber
  accent: '#FFD58A',

  // Additional colors
  overlay: 'rgba(15, 17, 21, 0.7)',  // Semi-transparent overlay for video
  shadow: 'rgba(255, 213, 138, 0.3)', // Amber shadow for breathing circle
  glow: 'rgba(255, 213, 138, 0.4)',   // Amber glow effect

  // Button states
  buttonActive: '#FFD58A',
  buttonInactive: 'rgba(255, 213, 138, 0.3)',
  buttonText: '#0F1115',
} as const;

export type QuickCalmColorKey = keyof typeof QuickCalmColors;
