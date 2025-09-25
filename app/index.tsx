import { TimerDisplay } from '@/components/TimerDisplay';
import { QuickCalmColors } from '@/constants/QuickCalmColors';
import { ResponsiveScale } from '@/constants/ResponsiveScale';
import { useOrientation } from '@/hooks/useOrientation';
import type { SessionDuration } from '@/types/QuickCalm';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DurationPicker() {
  const router = useRouter();
  const orientation = useOrientation();
  const [selectedDuration, setSelectedDuration] = useState<SessionDuration>(3);

  const handleStartSession = () => {
    router.push({
      pathname: '/session',
      params: { duration: selectedDuration.toString() }
    });
  };

  if (orientation.isLandscape) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.landscapeContent}>
          <View style={styles.landscapeTimerSection}>
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
              <Text style={styles.buttonText}>Start Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TimerDisplay
          selectedValue={selectedDuration}
          onValueChange={setSelectedDuration}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleStartSession}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Start Session</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ResponsiveScale.spacing(48), // xl spacing for screen margins
    gap: ResponsiveScale.spacing(40), // landscape-specific gap
  },
  landscapeTimerSection: {
    flex: 0.6, // 60% width
    justifyContent: 'center',
    alignItems: 'center',
  },
  landscapeActionSection: {
    flex: 0.4, // 40% width
    justifyContent: 'center',
    alignItems: 'center',
    gap: ResponsiveScale.spacing(16), // sm spacing between button and instructions
  },

  // Responsive button sizing - iPhone: 280x48, iPad: 360x56
  button: {
    backgroundColor: QuickCalmColors.accent,
    borderRadius: ResponsiveScale.scale(12),
    width: ResponsiveScale.isTablet ? 360 : 280,
    height: ResponsiveScale.isTablet ? 56 : 48,
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
  },

  // Typography system
  buttonText: {
    fontSize: ResponsiveScale.fontSize(16, 2.0), // Standard button text with scaling
    fontWeight: '600',
    color: QuickCalmColors.buttonText,
  },
  instructions: {
    fontSize: ResponsiveScale.fontSize(14, 2.0), // Instructions text with scaling
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
    lineHeight: ResponsiveScale.fontSize(20, 2.0),
    maxWidth: ResponsiveScale.isTablet ? 360 : 280, // Match button width for alignment
  },
});
