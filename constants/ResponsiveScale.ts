import { Dimensions } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Determine current orientation
const CURRENT_ORIENTATION: Orientation = SCREEN_WIDTH > SCREEN_HEIGHT ? 'landscape' : 'portrait';

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
   * @param landscapeMultiplier Optional landscape scaling (default: no extra scaling)
   */
  static fontSize(fontSize: number, maxScale: number = 2.2, landscapeMultiplier?: number): number {
    const fontScale = Math.min(SCALE_FACTOR, maxScale);
    const baseFontSize = fontSize * fontScale;

    // Apply landscape scaling multiplier only when explicitly requested
    if (this.isLandscape && landscapeMultiplier) {
      return baseFontSize * landscapeMultiplier;
    }

    return baseFontSize;
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
    if (this.isLandscape) {
      return this.isTablet ? 500 : 300;
    }
    
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
    return SCREEN_WIDTH >= 768 || SCREEN_HEIGHT >= 768; // iPad mini and larger
  }

  static get isLargeTablet(): boolean {
    return SCREEN_WIDTH >= 834 || SCREEN_HEIGHT >= 834; // iPad Pro and larger
  }

  // Orientation detection helpers
  static get isLandscape(): boolean {
    return CURRENT_ORIENTATION === 'landscape';
  }

  static get isPortrait(): boolean {
    return CURRENT_ORIENTATION === 'portrait';
  }

  static get orientation(): Orientation {
    return CURRENT_ORIENTATION;
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

  // Landscape-specific layout helpers
  /**
   * Get landscape title font size
   * Phone: 42px, Tablet: 48px (conservative sizing)
   */
  static getLandscapeTitleSize(): number {
    const baseSize = this.isTablet ? 48 : 42;
    return this.fontSize(baseSize);
  }

  /**
   * Get landscape timer display font size
   * Phone: 80px, Tablet: 96px (conservative sizing)
   */
  static getLandscapeTimerSize(): number {
    const baseSize = this.isTablet ? 96 : 80;
    return this.fontSize(baseSize);
  }

  /**
   * Get landscape layout dimensions for Duration Picker
   */
  static getLandscapeDurationLayout() {
    return {
      leftColumnWidth: '35%',
      rightColumnWidth: '65%',
      containerPadding: this.spacing(this.isTablet ? 48 : 32),
      interColumnPadding: this.spacing(24),
    };
  }

  /**
   * Get landscape layout dimensions for Session Screen
   */
  static getLandscapeSessionLayout() {
    return {
      leftZoneWidth: '25%',
      centerZoneWidth: '50%', 
      rightZoneWidth: '25%',
      containerPadding: this.spacing(this.isTablet ? 40 : 20),
    };
  }
}
