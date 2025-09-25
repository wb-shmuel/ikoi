import { TimerPicker } from '@/components/TimerPicker';
import { QuickCalmColors } from '@/constants/QuickCalmColors';
import { ResponsiveScale } from '@/constants/ResponsiveScale';
import { useOrientation } from '@/hooks/useOrientation';
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
  const orientation = useOrientation();

  return (
    <View style={[
      styles.container,
      orientation.isLandscape && styles.landscapeContainer
    ]}>
      {/* Timer number and label - tightly coupled */}
      <View style={[
        styles.timerHeader,
        orientation.isLandscape && styles.landscapeTimerHeader
      ]}>
        <Text style={[
          styles.timerNumber,
          orientation.isLandscape && styles.landscapeTimerNumber
        ]}>
          {selectedValue}
        </Text>
        <Text style={[
          styles.minutesLabel,
          orientation.isLandscape && styles.landscapeMinutesLabel
        ]}>
          minutes
        </Text>
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

  // Landscape-specific styles
  landscapeContainer: {
    maxWidth: ResponsiveScale.isTablet ? 400 : 320, // Constrain width in landscape
    paddingVertical: ResponsiveScale.spacing(16), // Reduce vertical padding in landscape
    paddingHorizontal: ResponsiveScale.spacing(24), // Reduce horizontal padding in landscape
  },
  landscapeTimerHeader: {
    marginBottom: ResponsiveScale.spacing(16), // Reduce spacing in landscape
  },
  landscapeTimerNumber: {
    fontSize: ResponsiveScale.isTablet ? 36 : 32, // Smaller font size in landscape for better fit
    fontWeight: '400', // Slightly bolder for better visibility
  },
  landscapeMinutesLabel: {
    fontSize: ResponsiveScale.isTablet ? 16 : 14, // Smaller label in landscape
    marginTop: ResponsiveScale.spacing(2), // Tighter coupling in landscape
  },
});