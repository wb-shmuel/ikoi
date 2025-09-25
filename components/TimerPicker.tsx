import { QuickCalmColors } from '@/constants/QuickCalmColors';
import { ResponsiveScale } from '@/constants/ResponsiveScale';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface TimerPickerProps {
  selectedValue: number;
  onValueChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
}

// Simplified consistent item height
const ITEM_HEIGHT = 44;

const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export const TimerPicker: React.FC<TimerPickerProps> = ({
  selectedValue,
  onValueChange,
  minValue = 1,
  maxValue = 60,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const isScrolling = useRef(false);
  const lastHapticValue = useRef(selectedValue);
  const currentScrollOffset = useRef(0);

  // Calculate center offset for proper positioning (needs to be inside component for dynamic values)
  const CENTER_OFFSET = PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2;

  // Generate simple data array - only actual values, no padding items
  const data = React.useMemo(() => {
    const items = [];
    for (let i = minValue; i <= maxValue; i++) {
      items.push({ value: i, key: `value-${i}` });
    }
    return items;
  }, [minValue, maxValue]);

  // Convert scroll offset to selected value
  const scrollOffsetToValue = useCallback((offsetY: number): number => {
    const rawValue = Math.round(offsetY / ITEM_HEIGHT) + minValue;
    return Math.max(minValue, Math.min(maxValue, rawValue));
  }, [minValue, maxValue]);

  // Convert selected value to scroll offset
  const valueToScrollOffset = useCallback((value: number): number => {
    return (value - minValue) * ITEM_HEIGHT;
  }, [minValue]);

  // Handle scroll events
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    currentScrollOffset.current = offsetY;
    
    const newValue = scrollOffsetToValue(offsetY);
    
    if (newValue !== lastHapticValue.current) {
      onValueChange(newValue);
      lastHapticValue.current = newValue;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [scrollOffsetToValue, onValueChange]);

  // Scroll to selected value
  const scrollToValue = useCallback((value: number, animated = true) => {
    if (flatListRef.current) {
      const offset = valueToScrollOffset(value);
      flatListRef.current.scrollToOffset({
        offset,
        animated,
      });
    }
  }, [valueToScrollOffset]);

  // Initialize scroll position on mount
  useEffect(() => {
    // Use a small delay to ensure the FlatList is rendered
    const timer = setTimeout(() => {
      scrollToValue(selectedValue, false);
    }, 10);

    return () => clearTimeout(timer);
  }, [scrollToValue, selectedValue]);

  // Calculate opacity based on distance from center using actual scroll position
  const calculateOpacity = useCallback((itemValue: number): number => {
    const itemOffset = valueToScrollOffset(itemValue);
    const distance = Math.abs(itemOffset - currentScrollOffset.current) / ITEM_HEIGHT;
    
    if (distance <= 0.5) {
      return 1;
    } else if (distance <= 1.5) {
      return 0.6;
    } else if (distance <= 2.5) {
      return 0.3;
    } else {
      return 0.15;
    }
  }, [valueToScrollOffset]);

  // Render each item
  const renderItem = useCallback(({ item }: { item: any }) => {
    const opacity = calculateOpacity(item.value);
    const isSelected = item.value === selectedValue;

    return (
      <View style={styles.item}>
        <Text style={[
          styles.itemText,
          { opacity },
          isSelected && styles.selectedText
        ]}>
          {item.value}
        </Text>
      </View>
    );
  }, [selectedValue, calculateOpacity]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollBegin={() => { isScrolling.current = true; }}
        onMomentumScrollEnd={(event) => {
          isScrolling.current = false;
          handleScroll(event);
        }}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        contentContainerStyle={{
          paddingTop: CENTER_OFFSET,
          paddingBottom: CENTER_OFFSET,
        }}
      />

      {/* Selection indicator - positioned at true center */}
      <View style={[styles.selectionIndicator, { top: CENTER_OFFSET }]} pointerEvents="none">
        <View style={styles.selectionLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: PICKER_HEIGHT,
    width: 200, // Simplified fixed width
    position: 'relative',
    overflow: 'hidden',
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16, // Consistent with design system
    color: QuickCalmColors.secondaryText,
    fontWeight: '400',
  },
  selectedText: {
    color: QuickCalmColors.accent,
    fontWeight: '500',
  },
  selectionIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  selectionLine: {
    position: 'absolute',
    left: '15%',
    right: '15%',
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: QuickCalmColors.accent,
    opacity: 0.4,
  },
});