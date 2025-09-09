import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus, Audio } from 'expo-av';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,

  Easing,
} from 'react-native-reanimated';

import { QuickCalmColors } from '@/constants/QuickCalmColors';
import type { SessionDuration, BreathingPhase, SessionState, BreathingConfig } from '@/types/QuickCalm';

const { width, height } = Dimensions.get('window');

const BREATHING_CONFIG: BreathingConfig = {
  inhale: 4,
  hold: 7,
  exhale: 8,
};

export default function SessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const duration = parseInt(params.duration as string) as SessionDuration;

  const videoRef = useRef<Video>(null);
  const audioRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [sessionState, setSessionState] = useState<SessionState>({
    duration,
    remainingTime: duration * 60, // Convert to seconds
    isPlaying: true,
    currentPhase: 'inhale',
    phaseCountdown: BREATHING_CONFIG.inhale,
    cycleCount: 0,
  });



  // Animation values
  const circleScale = useSharedValue(0.8);
  const circleOpacity = useSharedValue(0);

  // Animated styles
  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
    opacity: circleOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value * 1.2 }],
    opacity: circleOpacity.value * 0.5,
  }));

  // Initialize media and session
  useEffect(() => {
    initializeSession();
    return cleanup;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionState.isPlaying]);

  const initializeSession = async () => {
    try {
      // Keep screen awake
      await activateKeepAwakeAsync();

      // Load audio
      const { sound } = await Audio.Sound.createAsync(require('@/assets/music.mp3'));
      audioRef.current = sound;
      
      // Fade in audio
      await sound.setVolumeAsync(0);
      await sound.playAsync();
      await sound.setIsLoopingAsync(true);
      
      // Fade in over 1.5 seconds
      const fadeSteps = 30;
      const fadeIncrement = 0.55 / fadeSteps;
      for (let i = 0; i <= fadeSteps; i++) {
        setTimeout(() => {
          sound.setVolumeAsync(i * fadeIncrement);
        }, (i * 1500) / fadeSteps);
      }



      // Start breathing animation and timer
      startBreathingCycle();
      startSessionTimer();

    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      if (sessionState.isPlaying) {
        pauseSession();
      }
    } else if (nextAppState === 'active') {
      // Auto-resume when returning to app
      resumeSession();
    }
  };

  const startBreathingCycle = () => {
    // Fade in the circle
    circleOpacity.value = withTiming(1, { duration: 500 });
    
    // Start with inhale phase
    updateBreathingPhase('inhale');
  };

  const updateBreathingPhase = (phase: BreathingPhase) => {
    const phaseDuration = BREATHING_CONFIG[phase] * 1000; // Convert to milliseconds
    
    setSessionState(prev => ({
      ...prev,
      currentPhase: phase,
      phaseCountdown: BREATHING_CONFIG[phase],
    }));

    // Animate breathing circle
    animateBreathingCircle(phase);

    // Start haptic feedback
    startHapticFeedback(phase);

    // Start phase countdown
    startPhaseCountdown(phase);

    // Schedule next phase
    breathingTimerRef.current = setTimeout(() => {
      const nextPhase = getNextBreathingPhase(phase);
      updateBreathingPhase(nextPhase);
    }, phaseDuration);
  };

  const animateBreathingCircle = (phase: BreathingPhase) => {
    const duration = BREATHING_CONFIG[phase] * 1000;
    
    switch (phase) {
      case 'inhale':
        circleScale.value = withTiming(1.2, {
          duration,
          easing: Easing.inOut(Easing.quad),
        });
        break;
      case 'hold':
        // Stay at maximum size during hold
        break;
      case 'exhale':
        circleScale.value = withTiming(0.8, {
          duration,
          easing: Easing.inOut(Easing.quad),
        });
        break;
    }
  };

  const startHapticFeedback = (phase: BreathingPhase) => {
    const phaseDuration = BREATHING_CONFIG[phase];
    const pulseInterval = 1000; // Pulse every second

    for (let i = 0; i < phaseDuration; i++) {
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, i * pulseInterval);
    }
  };

  const startPhaseCountdown = (phase: BreathingPhase) => {
    const totalSeconds = BREATHING_CONFIG[phase];
    
    for (let i = 1; i <= totalSeconds; i++) {
      setTimeout(() => {
        setSessionState(prev => ({
          ...prev,
          phaseCountdown: totalSeconds - i,
        }));
      }, i * 1000);
    }
  };

  const getNextBreathingPhase = (currentPhase: BreathingPhase): BreathingPhase => {
    switch (currentPhase) {
      case 'inhale': return 'hold';
      case 'hold': return 'exhale';
      case 'exhale': 
        setSessionState(prev => ({ ...prev, cycleCount: prev.cycleCount + 1 }));
        return 'inhale';
    }
  };

  const startSessionTimer = () => {
    timerRef.current = setInterval(() => {
      setSessionState(prev => {
        const newRemainingTime = prev.remainingTime - 1;
        
        if (newRemainingTime <= 0) {
          finishSession();
          return prev;
        }
        
        return {
          ...prev,
          remainingTime: newRemainingTime,
        };
      });
    }, 1000);
  };

  const pauseSession = () => {
    setSessionState(prev => ({ ...prev, isPlaying: false }));
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current);
    }
    
    audioRef.current?.pauseAsync();
    videoRef.current?.pauseAsync();
  };

  const resumeSession = () => {
    if (!sessionState.isPlaying) {
      setSessionState(prev => ({ ...prev, isPlaying: true }));
      
      startSessionTimer();
      updateBreathingPhase(sessionState.currentPhase);
      
      audioRef.current?.playAsync();
      videoRef.current?.playAsync();
    }
  };

  const togglePlayPause = () => {
    if (sessionState.isPlaying) {
      pauseSession();
    } else {
      resumeSession();
    }
  };

  const finishSession = async () => {
    await cleanup();
    router.back();
  };

  const cleanup = async () => {
    try {
      // Clear timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
      }

      // Fade out audio
      if (audioRef.current) {
        const fadeSteps = 24;
        const currentVolume = 0.55;
        const fadeDecrement = currentVolume / fadeSteps;
        
        for (let i = 1; i <= fadeSteps; i++) {
          setTimeout(async () => {
            await audioRef.current?.setVolumeAsync(currentVolume - (i * fadeDecrement));
            if (i === fadeSteps) {
              await audioRef.current?.stopAsync();
              await audioRef.current?.unloadAsync();
            }
          }, (i * 1200) / fadeSteps);
        }
      }

      // Deactivate keep awake
      deactivateKeepAwake();

    } catch (error) {
      console.error('Cleanup error:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = (): string => {
    switch (sessionState.currentPhase) {
      case 'inhale': return 'Take a deep breath';
      case 'hold': return 'Stop breathing';
      case 'exhale': return 'Exhale';
    }
  };

  const isSessionComplete = sessionState.remainingTime <= 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Video */}
      <Video
        ref={videoRef}
        source={require('@/assets/candle.mp4')}
        style={styles.backgroundVideo}
        resizeMode={ResizeMode.COVER}
        shouldPlay={sessionState.isPlaying}
        isLooping
        onLoad={() => {}}
        onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
          // Handle video status if needed
        }}
      />

      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.timeRemaining}>
          {formatTime(sessionState.remainingTime)}
        </Text>
        
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={togglePlayPause}
        >
          <Text style={styles.playPauseText}>
            {sessionState.isPlaying ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Center Content - Breathing Guide */}
      <View style={styles.centerContent}>
        {/* Breathing Circle */}
        <View style={styles.breathingContainer}>
          {/* Glow Effect */}
          <Animated.View style={[styles.breathingGlow, glowStyle]} />
          
          {/* Main Circle */}
          <Animated.View style={[styles.breathingCircle, circleStyle]}>
            <View style={styles.circleInner} />
          </Animated.View>
        </View>

        {/* Phase Text */}
        <View style={styles.phaseContainer}>
          <Text style={styles.phaseText}>{getPhaseText()}</Text>
          <Text style={styles.countdownText}>
            {sessionState.phaseCountdown}
          </Text>
          <Text style={styles.guideText}>
            4s inhale • 7s hold • 8s exhale
          </Text>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={[
            styles.finishButton,
            isSessionComplete && styles.finishButtonActive
          ]}
          onPress={finishSession}
        >
          <Text style={[
            styles.finishButtonText,
            isSessionComplete && styles.finishButtonTextActive
          ]}>
            {isSessionComplete ? 'Finish' : 'End'}
          </Text>
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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: QuickCalmColors.overlay,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: QuickCalmColors.primaryText,
  },
  timeRemaining: {
    fontSize: 20,
    fontWeight: '600',
    color: QuickCalmColors.primaryText,
  },
  playPauseButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseText: {
    fontSize: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  breathingContainer: {
    position: 'relative',
    marginBottom: 60,
  },
  breathingGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: QuickCalmColors.glow,
    top: -20,
    left: -20,
  },
  breathingCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: QuickCalmColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: QuickCalmColors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  circleInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: QuickCalmColors.accent,
  },
  phaseContainer: {
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 24,
    fontWeight: '600',
    color: QuickCalmColors.primaryText,
    marginBottom: 12,
    textAlign: 'center',
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: QuickCalmColors.accent,
    marginBottom: 16,
  },
  guideText: {
    fontSize: 16,
    color: QuickCalmColors.secondaryText,
    textAlign: 'center',
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: QuickCalmColors.buttonInactive,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 120,
    alignItems: 'center',
  },
  finishButtonActive: {
    backgroundColor: QuickCalmColors.accent,
    borderColor: QuickCalmColors.accent,
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: QuickCalmColors.secondaryText,
  },
  finishButtonTextActive: {
    color: QuickCalmColors.buttonText,
  },
});