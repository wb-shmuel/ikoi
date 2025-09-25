import { TimerPicker } from '@/components/TimerPicker';
import { QuickCalmColors } from '@/constants/QuickCalmColors';
import { ResponsiveScale } from '@/constants/ResponsiveScale';
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
    borderRadius: ResponsiveScale.scale(12),
    paddingVertical: ResponsiveScale.spacing(24),
    paddingHorizontal: ResponsiveScale.spacing(32),
  },
  timerHeader: {
    alignItems: 'center',
    marginBottom: ResponsiveScale.spacing(24),
  },
  timerNumber: {
    fontSize: ResponsiveScale.fontSize(48, 2.2),
    fontWeight: '300',
    color: QuickCalmColors.accent,
    textAlign: 'center',
  },
  minutesLabel: {
    fontSize: ResponsiveScale.fontSize(18, 2.0),
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
    marginTop: ResponsiveScale.spacing(4), // 4px gap for tight coupling
  },
});