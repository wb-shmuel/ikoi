import { QuickCalmColors } from '@/constants/QuickCalmColors';
import { ResponsiveScale } from '@/constants/ResponsiveScale';
import type { SessionDuration } from '@/types/QuickCalm';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DurationPicker() {
  const router = useRouter();

  const handleDurationSelect = (duration: SessionDuration) => {
    router.push({
      pathname: '/session',
      params: { duration: duration.toString() }
    });
  };

  const durations: SessionDuration[] = [5, 10, 15];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Be Bored</Text>
          <Text style={styles.subtitle}>
            Choose your time to be bored
          </Text>
        </View>

        {/* Duration Buttons */}
        <View style={styles.buttonsContainer}>
          {durations.map((duration) => (
            <TouchableOpacity
              key={duration}
              style={styles.durationButton}
              onPress={() => handleDurationSelect(duration)}
              activeOpacity={0.8}
            >
              <Text style={styles.durationText}>{duration}</Text>
              <Text style={styles.minutesText}>min</Text>
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: ResponsiveScale.spacing(24),
    paddingTop: ResponsiveScale.spacing(60),
    paddingBottom: ResponsiveScale.spacing(40),
  },
  header: {
    alignItems: 'center',
    marginBottom: ResponsiveScale.spacing(60),
  },
  title: {
    fontSize: ResponsiveScale.fontSize(36),
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
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: ResponsiveScale.spacing(24),
    flexDirection: ResponsiveScale.isTablet ? 'row' : 'column', // Horizontal on iPad
  },
  durationButton: {
    backgroundColor: QuickCalmColors.accent,
    borderRadius: ResponsiveScale.scale(20),
    paddingVertical: ResponsiveScale.isTablet ? 0 : ResponsiveScale.spacing(24),
    paddingHorizontal: ResponsiveScale.isTablet ? 0 : ResponsiveScale.spacing(48),
    width: ResponsiveScale.isTablet ? 180 : ResponsiveScale.getButtonWidth(),
    height: ResponsiveScale.isTablet ? 180 : undefined,
    minWidth: ResponsiveScale.isTablet ? undefined : ResponsiveScale.getButtonWidth(),
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
  durationText: {
    fontSize: ResponsiveScale.fontSize(32),
    fontWeight: 'bold',
    color: QuickCalmColors.buttonText,
  },
  minutesText: {
    fontSize: ResponsiveScale.fontSize(16),
    color: QuickCalmColors.buttonText,
    marginTop: ResponsiveScale.spacing(4),
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
