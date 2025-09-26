import { ResponsiveScale } from '@/constants/ResponsiveScale';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrientation } from '@/hooks/useOrientation';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  // Icon helper - using MaterialIcons for reliable play/pause icons
  const PlayPauseIcon = ({ isPaused, size, color }: { isPaused: boolean; size: number; color: string }) => {
    const iconName = isPaused ? 'play-circle' : 'pause';

    return (
      <AntDesign
        name={iconName as any}
        size={size}
        color={color}
      />
    );
  };
  const { duration: durationParam } = useLocalSearchParams();
  const duration = parseInt(durationParam as string, 10);
  const totalSeconds = duration * 60;

  const router = useRouter();
  const orientation = useOrientation();
  const { t, formatT } = useLanguage();
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseTime, setPhaseTime] = useState(4); // Start with 4 seconds for inhale
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [backgroundTimestamp, setBackgroundTimestamp] = useState<number | null>(null);

  // Countdown state
  const [isInCountdown, setIsInCountdown] = useState(true);
  const [countdownSeconds, setCountdownSeconds] = useState(3);

  const videoPlayer = useVideoPlayer(require('@/assets/videos/candle.mp4'), player => {
    player.loop = true;
    player.play();
  });

  const audioPlayer = useAudioPlayer(require('@/assets/audio/music.mp3'));
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

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
        return t.takeDeepBreath;
      case 'hold':
        return t.stopBreathing;
      case 'exhale':
        return t.exhale;
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

  // Session state management
  const saveSessionState = useCallback(async () => {
    try {
      const sessionState = {
        timeRemaining,
        breathingPhase,
        phaseTime,
        isPaused,
        isInCountdown,
        countdownSeconds,
        isSessionActive,
        timestamp: Date.now(),
        duration: duration,
      };

      await AsyncStorage.setItem('@session_state', JSON.stringify(sessionState));
      console.log('Session state saved:', sessionState);
    } catch (error) {
      console.error('Failed to save session state:', error);
    }
  }, [timeRemaining, breathingPhase, phaseTime, isPaused, isInCountdown, countdownSeconds, isSessionActive, duration]);

  const restoreSessionState = useCallback(async (): Promise<boolean> => {
    try {
      const savedState = await AsyncStorage.getItem('@session_state');
      if (!savedState) return false;

      const sessionState = JSON.parse(savedState);
      const timeDiff = Date.now() - sessionState.timestamp;

      // If more than 5 minutes have passed, don't restore
      if (timeDiff > 5 * 60 * 1000) {
        await AsyncStorage.removeItem('@session_state');
        return false;
      }

      // Only restore if it's the same duration session
      if (sessionState.duration !== duration) {
        await AsyncStorage.removeItem('@session_state');
        return false;
      }

      console.log('Restoring session state:', sessionState);

      setTimeRemaining(sessionState.timeRemaining);
      setBreathingPhase(sessionState.breathingPhase);
      setPhaseTime(sessionState.phaseTime);
      setIsPaused(sessionState.isPaused);
      setIsInCountdown(sessionState.isInCountdown);
      setCountdownSeconds(sessionState.countdownSeconds);
      setIsSessionActive(sessionState.isSessionActive);

      return true;
    } catch (error) {
      console.error('Failed to restore session state:', error);
      return false;
    }
  }, [duration]);

  const clearSessionState = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('@session_state');
      console.log('Session state cleared');
    } catch (error) {
      console.error('Failed to clear session state:', error);
    }
  }, []);

  // Clean up all timers safely
  const cleanupTimers = useCallback(() => {
    console.log('Cleaning up timers...');

    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
      console.log('Session timer cleared');
    }

    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
      phaseTimerRef.current = null;
      console.log('Phase timer cleared');
    }
  }, []);

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

      // Start audio with fade-in during countdown
      audioPlayer.loop = true;
      audioPlayer.volume = 0;
      audioPlayer.play();

      // Fade in audio over 1.5 seconds to volume 0.55
      const fadeSteps = 30;
      const fadeInterval = 1500 / fadeSteps;
      const targetVolume = 0.55;

      for (let i = 0; i <= fadeSteps; i++) {
        const volume = (i / fadeSteps) * targetVolume;
        audioPlayer.volume = volume;
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

    audioPlayer.pause();
    videoPlayer.pause();
  };

  const resumeSession = () => {
    setIsPaused(false);
    startSessionTimer();
    startBreathingCycle();

    audioPlayer.play();
    videoPlayer.play();
  };

  const handleSessionEnd = async () => {
    console.log('Ending session...');
    setIsSessionActive(false);

    // Clean up timers
    cleanupTimers();

    // Clear saved session state
    await clearSessionState();

    // Stop video
    videoPlayer.pause();

    // Fade out and stop audio
    try {
      const fadeSteps = 24;
      const fadeInterval = 1200 / fadeSteps;

      for (let i = fadeSteps; i >= 0; i--) {
        const volume = (i / fadeSteps) * 0.55;
        audioPlayer.volume = volume;
        await new Promise(resolve => setTimeout(resolve, fadeInterval));
      }

      audioPlayer.pause();
    } catch (error) {
      console.log('Audio cleanup error:', error);
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

  // Handle app state changes with improved lifecycle management
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      console.log('App state changing from', appStateRef.current, 'to', nextAppState);

      if (nextAppState === 'background') {
        // App going to background - save state and continue music
        console.log('App going to background, saving state...');
        setBackgroundTimestamp(Date.now());
        await saveSessionState();

        // Don't pause the session or stop music - let it continue in background
        // Only pause video to save resources
        try {
          videoPlayer.pause();
        } catch (error) {
          console.log('Video pause error on background:', error);
        }
      } else if (nextAppState === 'active' && appStateRef.current === 'background') {
        // App returning from background - restore state and resume video
        console.log('App returning from background, restoring state...');

        try {
          // Resume video
          if (!isPaused) {
            videoPlayer.play();
          }

          // Calculate elapsed time in background
          const backgroundTime = backgroundTimestamp ? Date.now() - backgroundTimestamp : 0;
          console.log('Time spent in background:', backgroundTime, 'ms');

        } catch (error) {
          console.error('Error restoring from background:', error);
        }

        setBackgroundTimestamp(null);
      } else if (nextAppState === 'inactive') {
        // App becoming inactive (e.g., phone call, lock screen)
        console.log('App becoming inactive');
        await saveSessionState();
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [isPaused, backgroundTimestamp, saveSessionState, videoPlayer]);

  // Initialize session with state restoration
  useEffect(() => {
    const initializeSession = async () => {
      console.log('Initializing session...');

      // Try to restore previous session state first
      const wasRestored = await restoreSessionState();

      if (wasRestored) {
        console.log('Session state restored, resuming from saved position');
        await initializeMedia();

        // Resume session timers if it was active and not paused
        if (isSessionActive && !isPaused && !isInCountdown) {
          startSessionTimer();
          startBreathingCycle();
        }
      } else {
        console.log('No valid session state found, starting fresh');
        await initializeMedia();
        startCountdown();
      }
    };

    initializeSession();

    // Cleanup on unmount
    return () => {
      console.log('Component unmounting, cleaning up...');
      setIsSessionActive(false);
      cleanupTimers();
      clearSessionState();

      // Clean up video and audio
      try {
        videoPlayer.pause();
        audioPlayer.pause();
      } catch (error) {
        console.log('Media cleanup error:', error);
      }

      deactivateKeepAwake();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Video */}
      <View style={styles.videoContainer}>
        <VideoView
          style={styles.video}
          player={videoPlayer}
          contentFit="cover"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />

        {/* Dark overlay for better UI visibility */}
        <View style={styles.overlay} />
      </View>

      {/* Landscape Layout */}
      {orientation.isLandscape ? (
        <View style={styles.landscapeContainer}>
          {isInCountdown ? (
            /* Landscape Countdown Phase */
            <Animated.View style={[styles.landscapeCountdownContainer, countdownStyle]}>
              <Text style={styles.landscapeSubtitleText}>
                {formatT('sessionStartsIn', { duration: duration.toString() })}
              </Text>

              {/* Unified Landscape Countdown Circle with all text inside */}
              <View style={styles.circleInner}>
                <Text style={styles.landscapeCountdownNumber}>
                  {countdownSeconds === 0 ? t.begin : countdownSeconds}
                </Text>
              </View>
            </Animated.View>
          ) : (
            /* Landscape Session Phase */
            <>
              {/* Top Status Bar */}
              <View style={styles.landscapeTopBar}>
                <Text style={styles.landscapeTimeText}>
                  {formatTime(timeRemaining)}
                </Text>
                <TouchableOpacity
                  style={styles.landscapePauseButton}
                  onPress={isPaused ? resumeSession : pauseSession}
                >
                  <PlayPauseIcon
                    isPaused={isPaused}
                    size={ResponsiveScale.fontSize(24)}
                    color="#E6E6E6"
                  />
                </TouchableOpacity>
              </View>

              {/* Main Breathing Area - Centered over candle flame */}
              <View style={styles.landscapeBreathingArea}>
                <Animated.View style={[styles.landscapeBreathingCircle, breathingStyle]}>
                  <View style={styles.circleInner}>
                    <Text style={styles.landscapePhaseText}>
                      {getPhaseText()}
                    </Text>
                    <Text style={styles.landscapePhaseCounter}>
                      {phaseTime}
                    </Text>
                  </View>
                </Animated.View>
              </View>
            </>
          )}
        </View>
      ) : (
        <>
          {/* Portrait Layout - Top Bar - Hidden during countdown */}
          {!isInCountdown && (
            <View style={styles.topBar}>
              <Text style={styles.timeText}>
                {formatTime(timeRemaining)}
              </Text>

              <TouchableOpacity
                style={styles.pauseButton}
                onPress={isPaused ? resumeSession : pauseSession}
              >
                <PlayPauseIcon
                  isPaused={isPaused}
                  size={ResponsiveScale.fontSize(24)}
                  color="#E6E6E6"
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Portrait Main Content */}
          <View style={styles.content}>
            {isInCountdown ? (
              /* Countdown Phase */
              <Animated.View style={[styles.countdownContent, countdownStyle]}>
                <Text style={styles.subtitleText}>
                  {formatT('sessionStartsIn', { duration: duration.toString() })}
                </Text>

                {/* Unified Countdown Circle with all text inside */}
                <View style={styles.circleInner}>
                  <Text style={styles.countdownNumber}>
                    {countdownSeconds === 0 ? t.begin : countdownSeconds}
                  </Text>
                </View>
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
              </>
            )}
          </View>
        </>
      )}

      {/* Bottom End Button - Only show during session when time remaining, not countdown or when timer hits 0 */}
      {!isInCountdown && timeRemaining > 0 && (
        <View style={orientation.isLandscape ? styles.landscapeBottomButtonContainer : styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishSession}
          >
            <Text style={[styles.finishButtonText, { color: '#FFFFFF' }]}>
              {t.end}
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
  finishButton: {
    paddingHorizontal: ResponsiveScale.spacing(20),
    paddingVertical: ResponsiveScale.spacing(8),
    borderRadius: ResponsiveScale.scale(20),
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
    bottom: ResponsiveScale.spacing(30),
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
  countdownPhaseText: {
    fontSize: ResponsiveScale.fontSize(20),
    color: '#E6E6E6',
    textAlign: 'center',
    marginBottom: ResponsiveScale.spacing(12),
    fontWeight: '300',
  },
  instructionText: {
    fontSize: ResponsiveScale.fontSize(18),
    color: '#E6E6E6',
    textAlign: 'center',
    marginTop: ResponsiveScale.spacing(40),
  },

  // Landscape-specific styles - Optimized for meditation experience
  landscapeContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 10,
  },
  landscapeTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: ResponsiveScale.spacing(32),
    paddingTop: ResponsiveScale.spacing(ResponsiveScale.isTablet ? 24 : 16),
    paddingBottom: ResponsiveScale.spacing(16),
    zIndex: 20,
  },
  landscapeBreathingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // Shift content up slightly to align with candle flame
    marginTop: -ResponsiveScale.spacing(40),
  },
  landscapeTimeText: {
    fontSize: ResponsiveScale.fontSize(ResponsiveScale.isTablet ? 22 : 18),
    color: '#E6E6E6',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  landscapeBreathingCircle: {
    width: ResponsiveScale.getBreathingCircleSize(),
    height: ResponsiveScale.getBreathingCircleSize(),
    borderRadius: ResponsiveScale.getBreathingCircleSize() / 2,
    borderWidth: 2,
    borderColor: 'rgba(255, 213, 138, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 213, 138, 0.05)',
  },
  landscapePhaseText: {
    fontSize: ResponsiveScale.fontSize(ResponsiveScale.isTablet ? 20 : 16),
    color: '#E6E6E6',
    textAlign: 'center',
    marginBottom: ResponsiveScale.spacing(12),
    fontWeight: '300',
    letterSpacing: 0.5,
    opacity: 0.95,
    maxWidth: ResponsiveScale.scale(300),
    lineHeight: ResponsiveScale.fontSize(ResponsiveScale.isTablet ? 26 : 22),
  },
  landscapePhaseCounter: {
    fontSize: ResponsiveScale.fontSize(ResponsiveScale.isTablet ? 60 : 48),
    fontWeight: '200',
    color: '#FFD58A',
    textShadowColor: '#FFD58A',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  landscapePauseButton: {
    padding: ResponsiveScale.spacing(10),
    width: ResponsiveScale.scale(44),
    height: ResponsiveScale.scale(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ResponsiveScale.scale(22),
    backgroundColor: 'rgba(230, 230, 230, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(230, 230, 230, 0.2)',
  },
  landscapeBottomButtonContainer: {
    position: 'absolute',
    bottom: ResponsiveScale.spacing(24),
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },

  // Landscape Countdown styles
  landscapeCountdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ResponsiveScale.spacing(40),
  },
  landscapeTitleText: {
    fontSize: ResponsiveScale.fontSize(ResponsiveScale.isTablet ? 36 : 28),
    fontWeight: '300',
    color: '#E6E6E6',
    marginBottom: ResponsiveScale.spacing(12),
    textAlign: 'center',
  },
  landscapeSubtitleText: {
    fontSize: ResponsiveScale.fontSize(ResponsiveScale.isTablet ? 18 : 16),
    color: '#A8ADB5',
    textAlign: 'center',
    marginBottom: ResponsiveScale.spacing(60),
  },
  landscapeCountdownCircle: {
    width: ResponsiveScale.scale(180),
    height: ResponsiveScale.scale(180),
    borderRadius: ResponsiveScale.scale(90),
    borderWidth: 2,
    borderColor: '#FFD58A',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: ResponsiveScale.spacing(40),
    backgroundColor: 'rgba(255, 213, 138, 0.1)',
  },
  landscapeCountdownNumber: {
    fontSize: ResponsiveScale.fontSize(ResponsiveScale.isTablet ? 64 : 56),
    fontWeight: '200',
    color: '#FFD58A',
  },
  landscapeCountdownPhaseText: {
    fontSize: ResponsiveScale.fontSize(ResponsiveScale.isTablet ? 20 : 16),
    color: '#E6E6E6',
    textAlign: 'center',
    marginBottom: ResponsiveScale.spacing(12),
    fontWeight: '300',
  },
  landscapeInstructionText: {
    fontSize: ResponsiveScale.fontSize(ResponsiveScale.isTablet ? 18 : 16),
    color: '#E6E6E6',
    textAlign: 'center',
    marginTop: ResponsiveScale.spacing(40),
  },
});

export default SessionScreen;
