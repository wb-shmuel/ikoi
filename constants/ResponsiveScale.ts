import { Dimensions } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

// Remove static screen size variables - use dynamic getters instead

// Base dimensions (iPhone 14 - 390x844)
const BASE_WIDTH = 390;

/**
 * Responsive scaling utility for iPad support
 * Scales dimensions proportionally based on screen width
 */
export class ResponsiveScale {
  /**
   * Get current screen dimensions dynamically
   */
  static getCurrentDimensions() {
    return Dimensions.get('window');
  }

  /**
   * Get current orientation dynamically
   */
  static getCurrentOrientation(): Orientation {
    const { width, height } = this.getCurrentDimensions();
    return width > height ? 'landscape' : 'portrait';
  }

  /**
   * Get current scale factor based on device's shorter dimension (portrait width)
   */
  static getScaleFactor(): number {
    const { width, height } = this.getCurrentDimensions();
    // Always use the shorter dimension as the reference width, regardless of current orientation
    const deviceWidth = Math.min(width, height);
    const widthScale = deviceWidth / BASE_WIDTH;
    return Math.min(widthScale, 2.5); // Max 2.5x scaling for very large screens
  }

  /**
   * Scale a dimension proportionally
   * @param size Base size (designed for iPhone)
   * @param maxScale Maximum scaling factor (default: 2.5)
   */
  static scale(size: number, maxScale: number = 2.5): number {
    const scaleFactor = this.getScaleFactor();
    const scaledSize = size * scaleFactor;
    return Math.min(scaledSize, size * maxScale);
  }

  /**
   * Scale font size with more conservative scaling
   * @param fontSize Base font size
   * @param maxScale Maximum font scaling (default: 2.2)
   * @param landscapeMultiplier Optional landscape scaling (default: no extra scaling)
   */
  static fontSize(fontSize: number, maxScale: number = 2.2, landscapeMultiplier?: number): number {
    const scaleFactor = this.getScaleFactor();
    const fontScale = Math.min(scaleFactor, maxScale);
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
    const scaleFactor = this.getScaleFactor();
    const spacingScale = Math.min(scaleFactor, maxScale);
    return spacing * spacingScale;
  }

  /**
   * Get breathing circle size based on screen dimensions
   * iPhone: 280px, iPad mini: ~500px, iPad Pro: ~600px
   */
  static getBreathingCircleSize(): number {
    if (this.isLandscape) {
      // 横向きの場合は画面の高さを基準にサイズを決定
      const maxSize = Math.min(this.screenHeight * 0.5, this.isTablet ? 320 : 180);
      return Math.max(180, maxSize);
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
    const { width, height } = this.getCurrentDimensions();
    return width >= 768 || height >= 768; // iPad mini and larger
  }

  static get isLargeTablet(): boolean {
    const { width, height } = this.getCurrentDimensions();
    return width >= 834 || height >= 834; // iPad Pro and larger
  }

  // Orientation detection helpers
  static get isLandscape(): boolean {
    return this.getCurrentOrientation() === 'landscape';
  }

  static get isPortrait(): boolean {
    return this.getCurrentOrientation() === 'portrait';
  }

  static get orientation(): Orientation {
    return this.getCurrentOrientation();
  }

  // Screen dimension getters
  static get screenWidth(): number {
    return this.getCurrentDimensions().width;
  }

  static get screenHeight(): number {
    return this.getCurrentDimensions().height;
  }

  static get scaleFactor(): number {
    return this.getScaleFactor();
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
