import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { QuickCalmColors } from '@/constants/QuickCalmColors';
import type { SessionDuration } from '@/types/QuickCalm';

export default function DurationPicker() {
  const router = useRouter();

  const handleDurationSelect = (duration: SessionDuration) => {
    router.push({
      pathname: '/countdown',
      params: { duration: duration.toString() }
    });
  };

  const durations: SessionDuration[] = [5, 10, 15];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Quick Calm</Text>
          <Text style={styles.subtitle}>
            Choose a short session to calm yourself now
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: QuickCalmColors.primaryText,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 280,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  durationButton: {
    backgroundColor: QuickCalmColors.accent,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 48,
    minWidth: 140,
    alignItems: 'center',
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
    fontSize: 32,
    fontWeight: 'bold',
    color: QuickCalmColors.buttonText,
  },
  minutesText: {
    fontSize: 16,
    color: QuickCalmColors.buttonText,
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 16,
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
  },
});