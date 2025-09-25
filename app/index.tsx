import { LanguageSelector } from '@/components/LanguageSelector';
import { TimerDisplay } from '@/components/TimerDisplay';
import { QuickCalmColors } from '@/constants/QuickCalmColors';
import { ResponsiveScale } from '@/constants/ResponsiveScale';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrientation } from '@/hooks/useOrientation';
import type { SessionDuration } from '@/types/QuickCalm';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DurationPicker() {
  const router = useRouter();
  const orientation = useOrientation();
  const { t } = useLanguage();
  const [selectedDuration, setSelectedDuration] = useState<SessionDuration>(3);
  const [layoutKey, setLayoutKey] = useState(0);

  // Fix layout dimensions after component mount (addresses startup orientation issues)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLayoutKey(prev => prev + 1);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleStartSession = () => {
    router.push({
      pathname: '/session',
      params: { duration: selectedDuration.toString() }
    });
  };

  if (orientation.isLandscape) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Background candle video */}
        <Video
          source={require('@/assets/videos/candle_turn_on.mp4')}
          style={styles.backgroundVideo}
          shouldPlay
          isLooping
          isMuted
          resizeMode={ResizeMode.COVER}
        />

        {/* Dark overlay for better UI visibility - temporarily disabled for testing */}
        {/* <View style={styles.videoOverlay} /> */}

        {/* Language Selector - Top Right */}
        <View style={styles.languageSelectorContainer}>
          <LanguageSelector />
        </View>

        <View style={styles.landscapeContent}>
          <View style={styles.landscapeTimerSection}>
            <Text style={styles.landscapeInstructionsText}>
              {t.sessionInstructions}
            </Text>
            <TimerDisplay
              selectedValue={selectedDuration}
              onValueChange={setSelectedDuration}
            />
          </View>

          <View style={styles.landscapeActionSection}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleStartSession}
              activeOpacity={0.8}
            >
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>{t.session_button_1}</Text>
                <Text style={styles.buttonText}>{t.session_button_2}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Background candle video */}
      <Video
        source={require('@/assets/videos/candle_turn_on.mp4')}
        style={styles.backgroundVideo}
        shouldPlay
        isLooping
        isMuted
        resizeMode={ResizeMode.COVER}
      />

      {/* Dark overlay for better UI visibility - temporarily disabled for testing */}
      {/* <View style={styles.videoOverlay} /> */}

      {/* Language Selector - Top Right */}
      <View style={styles.languageSelectorContainer}>
        <LanguageSelector />
      </View>

      <View style={styles.content}>
        <Text style={styles.instructionsText}>
          {t.sessionInstructions}
        </Text>

        <TimerDisplay
          selectedValue={selectedDuration}
          onValueChange={setSelectedDuration}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleStartSession}
          activeOpacity={0.8}
        >
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonText}>{t.session_button_1}</Text>
            <Text style={styles.buttonText}>{t.session_button_2}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: QuickCalmColors.background,
  },
  languageSelectorContainer: {
    position: 'absolute',
    top: ResponsiveScale.spacing(60),
    right: ResponsiveScale.spacing(20),
    zIndex: 20,
  },

  // Background video styles
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3, // 30% opacity for better UI visibility
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 17, 21, 0.4)', // Lighter overlay to allow video to show through
  },

  // Portrait Layout
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ResponsiveScale.spacing(48), // xl spacing for screen margins
    gap: ResponsiveScale.spacing(32), // lg spacing between components
  },

  // Landscape Layout
  landscapeContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', // Changed from 'center' to prevent overlap
    alignItems: 'center',
    paddingHorizontal: ResponsiveScale.spacing(48), // xl spacing for screen margins
    paddingVertical: ResponsiveScale.spacing(20), // Add vertical padding
    gap: ResponsiveScale.spacing(60), // Increased gap from 40 to 60 for better separation
  },
  landscapeTimerSection: {
    flex: 0.55, // Reduced from 0.6 to 0.55 for more breathing room
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: ResponsiveScale.isTablet ? 350 : 300, // Ensure minimum height for timer visibility
  },
  landscapeActionSection: {
    flex: 0.35, // Reduced from 0.4 to 0.35 for more breathing room
    justifyContent: 'center',
    alignItems: 'center',
    gap: ResponsiveScale.spacing(16), // sm spacing between button and instructions
    minHeight: ResponsiveScale.isTablet ? 120 : 100, // Ensure minimum height for button section
  },

  // Circular button sizing - iPhone: 160x160, iPad: 180x180
  button: {
    backgroundColor: QuickCalmColors.accent,
    width: ResponsiveScale.isTablet ? 180 : 160,
    height: ResponsiveScale.isTablet ? 180 : 160,
    borderRadius: ResponsiveScale.isTablet ? 90 : 80, // Half of width/height for perfect circle
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: QuickCalmColors.accent,
    shadowOffset: {
      width: 0,
      height: ResponsiveScale.scale(2), // Responsive shadow offset
    },
    shadowOpacity: 0.2,
    shadowRadius: ResponsiveScale.scale(4), // Responsive shadow radius
    elevation: 3,
    opacity: 0.7, // 30% transparency (70% opacity)
  },

  // Typography system
  buttonTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: ResponsiveScale.fontSize(16, 1.8), // Adjusted font size for circular button
    fontWeight: '600',
    color: QuickCalmColors.buttonText,
    textAlign: 'center',
    lineHeight: ResponsiveScale.fontSize(18, 1.8), // Tighter line height for controlled spacing
  },
  instructions: {
    fontSize: ResponsiveScale.fontSize(14, 2.0), // Instructions text with scaling
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
    lineHeight: ResponsiveScale.fontSize(20, 2.0),
    maxWidth: ResponsiveScale.isTablet ? 360 : 280, // Match button width for alignment
  },
  instructionsText: {
    fontSize: ResponsiveScale.fontSize(16, 2.0),
    color: QuickCalmColors.primaryText,
    textAlign: 'center',
    lineHeight: ResponsiveScale.fontSize(22, 2.0),
    marginBottom: ResponsiveScale.spacing(24),
    maxWidth: ResponsiveScale.isTablet ? 400 : 320,
    opacity: 0.9,
  },
  landscapeInstructionsText: {
    fontSize: ResponsiveScale.fontSize(14, 2.0),
    color: QuickCalmColors.primaryText,
    textAlign: 'center',
    lineHeight: ResponsiveScale.fontSize(20, 2.0),
    marginBottom: ResponsiveScale.spacing(20),
    maxWidth: ResponsiveScale.isTablet ? 350 : 280,
    opacity: 0.9,
  },
});
