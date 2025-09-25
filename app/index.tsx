import { TimerDisplay } from '@/components/TimerDisplay';
import { QuickCalmColors } from '@/constants/QuickCalmColors';
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
    paddingHorizontal: 48, // xl spacing for screen margins
    gap: 32, // lg spacing between components
  },

  // Landscape Layout
  landscapeContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48, // xl spacing for screen margins
    gap: 40, // landscape-specific gap
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
    gap: 16, // sm spacing between button and instructions
  },

  // Standard button - 280px × 48px
  button: {
    backgroundColor: QuickCalmColors.accent,
    borderRadius: 12,
    width: 280,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: QuickCalmColors.accent,
    shadowOffset: {
      width: 0,
      height: 2, // Reduced from 4px to 2px
    },
    shadowOpacity: 0.2, // Reduced from 0.3 to 0.2
    shadowRadius: 4, // Reduced from 8px to 4px
    elevation: 3, // Reduced from 6 to 3
  },

  // Typography system
  buttonText: {
    fontSize: 16, // Standard button text
    fontWeight: '600',
    color: QuickCalmColors.buttonText,
  },
  instructions: {
    fontSize: 14, // Instructions text
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280, // Match button width for alignment
  },
});
