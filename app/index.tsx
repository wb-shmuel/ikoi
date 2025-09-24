import { TimerPicker } from '@/components/TimerPicker';
import { QuickCalmColors } from '@/constants/QuickCalmColors';
import { ResponsiveScale } from '@/constants/ResponsiveScale';
import type { SessionDuration } from '@/types/QuickCalm';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DurationPicker() {
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState<SessionDuration>(3);

  const handleDurationSelect = (duration: SessionDuration) => {
    router.push({
      pathname: '/session',
      params: { duration: duration.toString() }
    });
  };

  const handleStartSession = () => {
    handleDurationSelect(selectedDuration);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Be Bored</Text>
          <Text style={styles.subtitle}>
            Choose your time...
          </Text>
        </View>

        {/* Timer Picker */}
        <View style={styles.pickerContainer}>
          {/* Large Display */}
          <View style={styles.largeDisplay}>
            <Text style={styles.largeNumber}>{selectedDuration}</Text>
            <Text style={styles.minutesLabel}>minutes</Text>
          </View>

          {/* Scrollable Picker */}
          <View style={styles.pickerWrapper}>
            <TimerPicker
              selectedValue={selectedDuration}
              onValueChange={setSelectedDuration}
              minValue={1}
              maxValue={60}
            />
          </View>

          {/* Start Session Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartSession}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Session</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Breathe in for 4, hold for 7, exhale for 8 seconds
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: QuickCalmColors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: ResponsiveScale.isTablet
      ? ResponsiveScale.spacing(48, 1.5)
      : ResponsiveScale.spacing(24),
    paddingTop: ResponsiveScale.isTablet
      ? ResponsiveScale.spacing(80, 1.2)
      : ResponsiveScale.spacing(60),
    paddingBottom: ResponsiveScale.spacing(40),
  },
  header: {
    alignItems: 'center',
    marginBottom: ResponsiveScale.isTablet
      ? ResponsiveScale.spacing(40, 1.2)
      : ResponsiveScale.spacing(60),
  },
  title: {
    fontSize: ResponsiveScale.isTablet
      ? ResponsiveScale.fontSize(42, 1.5)
      : ResponsiveScale.fontSize(36),
    fontWeight: 'bold',
    color: QuickCalmColors.primaryText,
    marginBottom: ResponsiveScale.spacing(16),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: ResponsiveScale.fontSize(18),
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
    lineHeight: ResponsiveScale.fontSize(26),
    maxWidth: ResponsiveScale.getMaxTextWidth(),
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ResponsiveScale.isTablet
      ? ResponsiveScale.spacing(40, 1.0)
      : ResponsiveScale.spacing(20),
    maxWidth: ResponsiveScale.isTablet ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  largeDisplay: {
    alignItems: 'center',
    marginBottom: ResponsiveScale.spacing(24),
  },
  largeNumber: {
    fontSize: ResponsiveScale.isTablet
      ? ResponsiveScale.fontSize(72, 1.3)
      : ResponsiveScale.fontSize(64),
    fontWeight: '200',
    color: QuickCalmColors.accent,
    textAlign: 'center',
    lineHeight: ResponsiveScale.isTablet
      ? ResponsiveScale.fontSize(80, 1.3)
      : ResponsiveScale.fontSize(72),
  },
  minutesLabel: {
    fontSize: ResponsiveScale.isTablet
      ? ResponsiveScale.fontSize(20, 1.3)
      : ResponsiveScale.fontSize(18),
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
    marginTop: ResponsiveScale.spacing(-8),
  },
  pickerWrapper: {
    alignItems: 'center',
    marginVertical: ResponsiveScale.spacing(24),
  },
  startButton: {
    backgroundColor: QuickCalmColors.accent,
    borderRadius: ResponsiveScale.scale(20),
    paddingVertical: ResponsiveScale.spacing(16),
    paddingHorizontal: ResponsiveScale.spacing(48),
    minWidth: ResponsiveScale.isTablet
      ? Math.min(ResponsiveScale.scale(300), 400)
      : ResponsiveScale.getButtonWidth() * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: QuickCalmColors.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    fontSize: ResponsiveScale.fontSize(18),
    fontWeight: '600',
    color: QuickCalmColors.buttonText,
  },
  footer: {
    alignItems: 'center',
    marginTop: ResponsiveScale.spacing(40),
  },
  footerText: {
    fontSize: ResponsiveScale.fontSize(16),
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
    lineHeight: ResponsiveScale.fontSize(22),
  },
});
