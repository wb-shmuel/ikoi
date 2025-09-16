import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 - 390x844)
const BASE_WIDTH = 390;

// Calculate scale factors
const widthScale = SCREEN_WIDTH / BASE_WIDTH;

// Use width-based scaling primarily, with reasonable limits
const SCALE_FACTOR = Math.min(widthScale, 2.5); // Max 2.5x scaling for very large screens

/**
 * Responsive scaling utility for iPad support
 * Scales dimensions proportionally based on screen width
 */
export class ResponsiveScale {
  /**
   * Scale a dimension proportionally
   * @param size Base size (designed for iPhone)
   * @param maxScale Maximum scaling factor (default: 2.5)
   */
  static scale(size: number, maxScale: number = 2.5): number {
    const scaledSize = size * SCALE_FACTOR;
    return Math.min(scaledSize, size * maxScale);
  }

  /**
   * Scale font size with more conservative scaling
   * @param fontSize Base font size
   * @param maxScale Maximum font scaling (default: 2.2)
   */
  static fontSize(fontSize: number, maxScale: number = 2.2): number {
    const fontScale = Math.min(SCALE_FACTOR, maxScale);
    return fontSize * fontScale;
  }

  /**
   * Scale spacing/padding with moderate scaling
   * @param spacing Base spacing
   * @param maxScale Maximum spacing scaling (default: 2.0)
   */
  static spacing(spacing: number, maxScale: number = 2.0): number {
    const spacingScale = Math.min(SCALE_FACTOR, maxScale);
    return spacing * spacingScale;
  }

  /**
   * Get breathing circle size based on screen dimensions
   * iPhone: 280px, iPad mini: ~500px, iPad Pro: ~600px
   */
  static getBreathingCircleSize(): number {
    const baseSize = 280;
    const scaledSize = this.scale(baseSize, 1.5);

    // Ensure minimum and maximum bounds
    return Math.max(280, Math.min(scaledSize, 600));
  }

  /**
   * Get button width based on screen size
   * iPhone: default width, iPad: wider buttons
   */
  static getButtonWidth(): number {
    const baseWidth = 140;
    return this.scale(baseWidth, 2.5);
  }

  /**
   * Get maximum text width for readability
   */
  static getMaxTextWidth(): number {
    const baseMaxWidth = 350;
    return this.scale(baseMaxWidth, 2.0);
  }

  // Device type detection helpers
  static get isTablet(): boolean {
    return SCREEN_WIDTH >= 768; // iPad mini and larger
  }

  static get isLargeTablet(): boolean {
    return SCREEN_WIDTH >= 834; // iPad Pro and larger
  }

  // Screen dimension getters
  static get screenWidth(): number {
    return SCREEN_WIDTH;
  }

  static get screenHeight(): number {
    return SCREEN_HEIGHT;
  }

  static get scaleFactor(): number {
    return SCALE_FACTOR;
  }
}
