import { TimerPicker } from '@/components/TimerPicker';
import { QuickCalmColors } from '@/constants/QuickCalmColors';
import type { SessionDuration } from '@/types/QuickCalm';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TimerDisplayProps {
  selectedValue: SessionDuration;
  onValueChange: (value: SessionDuration) => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  selectedValue,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      {/* Timer number and label - tightly coupled */}
      <View style={styles.timerHeader}>
        <Text style={styles.timerNumber}>{selectedValue}</Text>
        <Text style={styles.minutesLabel}>minutes</Text>
      </View>

      {/* Picker */}
      <TimerPicker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        minValue={1}
        maxValue={60}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 213, 138, 0.08)',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 32,
  },
  timerHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerNumber: {
    fontSize: 48,
    fontWeight: '300',
    color: QuickCalmColors.accent,
    textAlign: 'center',
  },
  minutesLabel: {
    fontSize: 18,
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
    marginTop: 4, // 4px gap for tight coupling
  },
});