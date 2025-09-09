import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { QuickCalmColors } from '@/constants/QuickCalmColors';
import { Quote } from '@/constants/Quote';
import type { QuoteScreenState } from '@/types/QuickCalm';

export default function QuoteScreen() {
  const router = useRouter();
  
  const [quoteState, setQuoteState] = useState<QuoteScreenState>({
    currentQuote: '',
    showContinueHint: false,
  });

  // Animation values
  const quoteOpacity = useSharedValue(0);
  const hintOpacity = useSharedValue(0);

  // Animated styles
  const quoteStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
  }));

  const hintStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
  }));

  useEffect(() => {
    initializeQuote();
  }, []);

  const initializeQuote = () => {
    // Select a random quote
    const randomIndex = Math.floor(Math.random() * Quote.length);
    const selectedQuote = Quote[randomIndex];
    
    setQuoteState({
      currentQuote: selectedQuote,
      showContinueHint: false,
    });

    // Animate quote appearance
    quoteOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
    });

    // Show continue hint after a delay
    setTimeout(() => {
      setQuoteState(prev => ({ ...prev, showContinueHint: true }));
      hintOpacity.value = withDelay(
        500,
        withTiming(0.7, {
          duration: 800,
          easing: Easing.out(Easing.quad),
        })
      );
    }, 2000);
  };

  const handleScreenTap = () => {
    // Navigate back to home (index screen)
    router.replace('/');
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Quote Text */}
          <Animated.View style={[styles.quoteContainer, quoteStyle]}>
            <Text style={styles.quoteText}>
              {quoteState.currentQuote}
            </Text>
          </Animated.View>

          {/* Continue Hint */}
          {quoteState.showContinueHint && (
            <Animated.View style={[styles.hintContainer, hintStyle]}>
              <Text style={styles.hintText}>Tap to continue</Text>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: QuickCalmColors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  quoteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '100%',
  },
  quoteText: {
    fontSize: 22,
    lineHeight: 32,
    color: QuickCalmColors.primaryText,
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.5,
    maxWidth: 350,
  },
  hintContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  hintText: {
    fontSize: 16,
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});