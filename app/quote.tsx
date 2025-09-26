import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { QuickCalmColors } from '@/constants/QuickCalmColors';
import { ResponsiveScale } from '@/constants/ResponsiveScale';
import { quotes } from '@/constants/Quote';
import { useLanguage } from '@/contexts/LanguageContext';
import type { QuoteScreenState } from '@/types/QuickCalm';

const QuoteScreen: React.FC = () => {
  const router = useRouter();
  const { t, language } = useLanguage();

  const videoPlayer = useVideoPlayer(require('@/assets/videos/candle_turn_out.mp4'), player => {
    player.loop = false;
    player.play();
  });
  
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
    console.log('Quote screen mounted or language changed:', language);

    // Select a random quote from the current language
    const languageQuotes = quotes[language];
    const randomIndex = Math.floor(Math.random() * languageQuotes.length);
    const selectedQuote = languageQuotes[randomIndex];

    setQuoteState({
      currentQuote: selectedQuote,
      showContinueHint: false,
    });

    // Reset animation values first
    quoteOpacity.value = 0;
    hintOpacity.value = 0;

    // Animate quote appearance
    quoteOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
    });

    // Show continue hint after a delay
    const hintTimer = setTimeout(() => {
      setQuoteState(prev => ({ ...prev, showContinueHint: true }));
      hintOpacity.value = withDelay(
        500,
        withTiming(0.7, {
          duration: 800,
          easing: Easing.out(Easing.quad),
        })
      );
    }, 2000);

    // Cleanup function
    return () => {
      clearTimeout(hintTimer);
    };
  }, [language, hintOpacity, quoteOpacity]); // Only depend on necessary values

  const handleScreenTap = () => {
    // Navigate back to home (index screen)
    router.replace('/');
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <SafeAreaView style={styles.container}>
        {/* Background candle turn out video */}
        <VideoView
          style={styles.backgroundVideo}
          player={videoPlayer}
          contentFit="cover"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />

        {/* Dark overlay for better text visibility */}
        <View style={styles.videoOverlay} />

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
              <Text style={styles.hintText}>{t.tapToContinue}</Text>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default QuoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: QuickCalmColors.background,
  },

  // Background video styles
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3, // Subtle candle turn out effect
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 17, 21, 0.6)', // Semi-transparent overlay for text readability
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ResponsiveScale.spacing(32),
    paddingVertical: ResponsiveScale.spacing(60),
  },
  quoteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '100%',
  },
  quoteText: {
    fontSize: ResponsiveScale.fontSize(22),
    lineHeight: ResponsiveScale.fontSize(32),
    color: QuickCalmColors.primaryText,
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.5,
    maxWidth: ResponsiveScale.getMaxTextWidth(),
  },
  hintContainer: {
    position: 'absolute',
    bottom: ResponsiveScale.spacing(80),
    alignSelf: 'center',
  },
  hintText: {
    fontSize: ResponsiveScale.fontSize(16),
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});