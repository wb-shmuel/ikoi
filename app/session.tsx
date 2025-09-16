import { ResponsiveScale } from '@/constants/ResponsiveScale';
import { Ionicons } from '@expo/vector-icons';
import { Audio, ResizeMode, Video } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

const SessionScreen: React.FC = () => {
  const { duration: durationParam } = useLocalSearchParams();
  const duration = parseInt(durationParam as string, 10);
  const totalSeconds = duration * 60;

  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseTime, setPhaseTime] = useState(4); // Start with 4 seconds for inhale
  const [isSessionActive, setIsSessionActive] = useState(true);

  // Countdown state
  const [isInCountdown, setIsInCountdown] = useState(true);
  const [countdownSeconds, setCountdownSeconds] = useState(3);

  const videoRef = useRef<Video>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Breathing animation
  const breathingScale = useSharedValue(1);
  const breathingOpacity = useSharedValue(0.3);

  // Countdown animation
  const countdownOpacity = useSharedValue(1);

  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathingScale.value }],
    opacity: breathingOpacity.value,
  }));

  const countdownStyle = useAnimatedStyle(() => ({
    opacity: countdownOpacity.value,
  }));

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get phase text
  const getPhaseText = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Take a deep breath';
      case 'hold':
        return 'Stop breathing';
      case 'exhale':
        return 'Exhale';
      default:
        return '';
    }
  };

  // Get phase duration
  const getPhaseDuration = (phase: 'inhale' | 'hold' | 'exhale') => {
    switch (phase) {
      case 'inhale':
        return 4;
      case 'hold':
        return 7;
      case 'exhale':
        return 8;
      default:
        return 4;
    }
  };

  // Breathing animation for each phase
  const startPhaseAnimation = (phase: 'inhale' | 'hold' | 'exhale') => {
    const duration = getPhaseDuration(phase) * 1000;

    switch (phase) {
      case 'inhale':
        breathingScale.value = withTiming(1.3, {
          duration,
          easing: Easing.inOut(Easing.ease),
        });
        breathingOpacity.value = withTiming(0.8, {
          duration,
          easing: Easing.inOut(Easing.ease),
        });
        break;
      case 'hold':
        // Keep current scale and opacity
        break;
      case 'exhale':
        breathingScale.value = withTiming(1, {
          duration,
          easing: Easing.inOut(Easing.ease),
        });
        breathingOpacity.value = withTiming(0.3, {
          duration,
          easing: Easing.inOut(Easing.ease),
        });
        break;
    }
  };

  const initializeMedia = async () => {
    try {
      console.log('Starting media initialization...');

      // Keep screen awake
      await activateKeepAwakeAsync();

      // Configure audio session
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Load and start audio during countdown
      console.log('Loading and starting audio...');
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/audio/music.mp3'),
        {
          shouldPlay: false,
          isLooping: true,
          volume: 0,
        }
      );

      soundRef.current = sound;

      // Start audio with fade-in during countdown
      await sound.setVolumeAsync(0);
      await sound.playAsync();

      // Fade in audio over 1.5 seconds to volume 0.55
      const fadeSteps = 30;
      const fadeInterval = 1500 / fadeSteps;
      const targetVolume = 0.55;

      for (let i = 0; i <= fadeSteps; i++) {
        const volume = (i / fadeSteps) * targetVolume;
        await sound.setVolumeAsync(volume);
        await new Promise(resolve => setTimeout(resolve, fadeInterval));
      }

      console.log('Media initialization completed');
    } catch (error) {
      console.error('Failed to initialize media:', error);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);

          // Show "Begin" for longer (2 seconds)
          setTimeout(() => {
            // Start fade out animation
            countdownOpacity.value = withTiming(0, {
              duration: 800,
              easing: Easing.out(Easing.ease),
            });

            // End countdown after fade completes
            setTimeout(() => {
              setIsInCountdown(false);
              startSession();
            }, 800);
          }, 2000);

          return 0;
        }

        // Trigger haptic feedback on each count
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return prev - 1;
      });
    }, 1000);
  };

  const startSession = () => {
    startSessionTimer();
    startBreathingCycle();
  };

  const startBreathingCycle = () => {
    const runCycle = () => {
      if (!isSessionActive) return;

      const phases: ('inhale' | 'hold' | 'exhale')[] = ['inhale', 'hold', 'exhale'];
      let currentPhaseIndex = 0;

      const nextPhase = () => {
        if (!isSessionActive) return;

        const currentPhase = phases[currentPhaseIndex];
        const phaseDuration = getPhaseDuration(currentPhase);

        setBreathingPhase(currentPhase);
        setPhaseTime(phaseDuration);
        startPhaseAnimation(currentPhase);

        // Haptic feedback for phase transitions
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        let countdown = phaseDuration;
        phaseTimerRef.current = setInterval(() => {
          countdown--;
          setPhaseTime(countdown);

          if (countdown <= 0) {
            if (phaseTimerRef.current) {
              clearInterval(phaseTimerRef.current);
            }

            currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
            nextPhase();
          }
        }, 1000);
      };

      nextPhase();
    };

    runCycle();
  };

  const startSessionTimer = () => {
    sessionTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Session completed
          handleSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseSession = () => {
    setIsPaused(true);

    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
    }

    if (soundRef.current) {
      soundRef.current.pauseAsync();
    }

    if (videoRef.current) {
      videoRef.current.pauseAsync();
    }
  };

  const resumeSession = () => {
    setIsPaused(false);
    startSessionTimer();
    startBreathingCycle();

    if (soundRef.current) {
      soundRef.current.playAsync();
    }

    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  };

  const handleSessionEnd = async () => {
    setIsSessionActive(false);

    // Clean up timers
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
    }

    // Stop and clean up video
    if (videoRef.current) {
      try {
        await videoRef.current.stopAsync();
        await videoRef.current.unloadAsync();
      } catch (error) {
        console.log('Video cleanup error:', error);
      }
    }

    // Fade out and stop audio
    if (soundRef.current) {
      try {
        const fadeSteps = 24;
        const fadeInterval = 1200 / fadeSteps;

        for (let i = fadeSteps; i >= 0; i--) {
          const volume = (i / fadeSteps) * 0.55;
          await soundRef.current.setVolumeAsync(volume);
          await new Promise(resolve => setTimeout(resolve, fadeInterval));
        }

        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      } catch (error) {
        console.log('Audio cleanup error:', error);
      }
    }

    // Clean up keep awake
    deactivateKeepAwake();

    // Navigate to quote screen after session
    setTimeout(() => {
      router.push('/quote');
    }, 1000);
  };

  const handleFinishSession = () => {
    handleSessionEnd();
  };

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' && !isPaused) {
        pauseSession();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [isPaused]);

  // Initialize media and start countdown on component mount
  useEffect(() => {
    initializeMedia();
    startCountdown();

    // Cleanup on unmount
    return () => {
      setIsSessionActive(false);

      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
      if (phaseTimerRef.current) {
        clearInterval(phaseTimerRef.current);
      }

      // Clean up video
      if (videoRef.current) {
        videoRef.current.stopAsync().catch(() => {});
        videoRef.current.unloadAsync().catch(() => {});
        videoRef.current = null;
      }

      // Clean up audio
      if (soundRef.current) {
        soundRef.current.stopAsync().catch(() => {});
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      deactivateKeepAwake();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Video */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={require('@/assets/videos/candle.mp4')}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={true}
          isLooping={true}
          isMuted={true}
        />

        {/* Dark overlay for better UI visibility */}
        <View style={styles.overlay} />
      </View>

      {/* Top Bar - Hidden during countdown */}
      {!isInCountdown && (
        <View style={styles.topBar}>
          <Text style={styles.timeText}>
            {formatTime(timeRemaining)}
          </Text>

          <TouchableOpacity
            style={styles.pauseButton}
            onPress={isPaused ? resumeSession : pauseSession}
          >
            <Ionicons
              name={isPaused ? 'play' : 'pause'}
              size={ResponsiveScale.fontSize(24)}
              color="#E6E6E6"
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        {isInCountdown ? (
          /* Countdown Phase */
          <Animated.View style={[styles.countdownContent, countdownStyle]}>
            <Text style={styles.titleText}>Get Ready</Text>
            <Text style={styles.subtitleText}>
              Your {duration}-minute session starts in
            </Text>

            <View style={styles.timerDisplay}>
              <Text style={styles.timerText}>
                {formatTime(totalSeconds)}
              </Text>
            </View>

            {/* Countdown Circle */}
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownNumber}>
                {countdownSeconds === 0 ? 'Begin' : countdownSeconds}
              </Text>
            </View>

            <Text style={styles.instructionText}>
              Take a deep breath and prepare to relax
            </Text>
          </Animated.View>
        ) : (
          /* Session Phase */
          <>
            {/* Breathing Circle - Only visible after countdown */}
            <Animated.View style={[styles.breathingCircle, breathingStyle]}>
              <View style={styles.circleInner}>
                <Text style={styles.phaseText}>
                  {getPhaseText()}
                </Text>
                <Text style={styles.phaseCounter}>
                  {phaseTime}
                </Text>
              </View>
            </Animated.View>

            {/* Breathing guide text below circle */}
            <Text style={styles.breathingGuide}>
              4s inhale • 7s hold • 8s exhale
            </Text>
          </>
        )}
      </View>

      {/* Bottom End Button - Only show during session when time remaining, not countdown or when timer hits 0 */}
      {!isInCountdown && timeRemaining > 0 && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishSession}
          >
            <Text style={[styles.finishButtonText, { color: '#FFFFFF' }]}>
              End
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1115',
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: ResponsiveScale.spacing(60),
    paddingHorizontal: ResponsiveScale.spacing(20),
    paddingBottom: ResponsiveScale.spacing(20),
    zIndex: 10,
    position: 'relative',
  },
  backButton: {
    padding: 5,
    width: 40,
  },
  backButtonText: {
    fontSize: ResponsiveScale.fontSize(24),
    color: '#E6E6E6',
    fontWeight: '300',
  },
  timeText: {
    fontSize: ResponsiveScale.fontSize(18),
    color: '#E6E6E6',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  pauseButton: {
    position: 'absolute',
    right: ResponsiveScale.spacing(15),
    padding: ResponsiveScale.spacing(8),
    width: ResponsiveScale.scale(44),
    height: ResponsiveScale.scale(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ResponsiveScale.scale(22),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ResponsiveScale.spacing(40),
    zIndex: 10,
  },
  breathingCircle: {
    width: ResponsiveScale.getBreathingCircleSize(),
    height: ResponsiveScale.getBreathingCircleSize(),
    borderRadius: ResponsiveScale.getBreathingCircleSize() / 2,
    borderWidth: 2,
    borderColor: '#FFD58A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ResponsiveScale.spacing(40),
    backgroundColor: 'rgba(255, 213, 138, 0.1)',
  },
  circleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    fontSize: ResponsiveScale.fontSize(20),
    color: '#E6E6E6',
    textAlign: 'center',
    marginBottom: ResponsiveScale.spacing(12),
    fontWeight: '300',
  },
  phaseCounter: {
    fontSize: ResponsiveScale.fontSize(48),
    fontWeight: '200',
    color: '#FFD58A',
  },
  breathingGuide: {
    fontSize: ResponsiveScale.isTablet ? 16 : 14,
    color: '#A8ADB5',
    textAlign: 'center',
    marginTop: ResponsiveScale.spacing(20),
    fontStyle: 'italic',
  },
  finishButton: {
    paddingHorizontal: ResponsiveScale.spacing(30),
    paddingVertical: ResponsiveScale.spacing(12),
    borderRadius: ResponsiveScale.scale(25),
    borderWidth: 1,
    borderColor: '#A8ADB5',
  },
  finishButtonHighlight: {
    backgroundColor: '#FFD58A',
    borderColor: '#FFD58A',
  },
  finishButtonText: {
    fontSize: ResponsiveScale.fontSize(16),
    color: '#A8ADB5',
    fontWeight: '500',
  },
  finishButtonTextHighlight: {
    color: '#0F1115',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: ResponsiveScale.spacing(60),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: ResponsiveScale.spacing(40),
    zIndex: 20,
  },
  // Countdown styles
  countdownContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  titleText: {
    fontSize: ResponsiveScale.fontSize(32),
    fontWeight: '300',
    color: '#E6E6E6',
    marginBottom: ResponsiveScale.spacing(8),
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: ResponsiveScale.fontSize(16),
    color: '#A8ADB5',
    textAlign: 'center',
    marginBottom: ResponsiveScale.spacing(40),
  },
  timerDisplay: {
    marginBottom: ResponsiveScale.spacing(60),
  },
  timerText: {
    fontSize: ResponsiveScale.fontSize(18),
    color: '#E6E6E6',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  countdownCircle: {
    width: ResponsiveScale.scale(200),
    height: ResponsiveScale.scale(200),
    borderRadius: ResponsiveScale.scale(100),
    borderWidth: 2,
    borderColor: '#FFD58A',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: ResponsiveScale.spacing(40),
    backgroundColor: 'rgba(255, 213, 138, 0.1)',
  },
  countdownNumber: {
    fontSize: ResponsiveScale.fontSize(72),
    fontWeight: '200',
    color: '#FFD58A',
  },
  instructionText: {
    fontSize: ResponsiveScale.fontSize(18),
    color: '#E6E6E6',
    textAlign: 'center',
    marginTop: ResponsiveScale.spacing(40),
  },
});

export default SessionScreen;
