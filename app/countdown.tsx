import { Audio, ResizeMode, Video } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync } from 'expo-keep-awake';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';


const CountdownScreen: React.FC = () => {
  const { duration: durationParam } = useLocalSearchParams();
  const duration = parseInt(durationParam as string, 10);

  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(3); // 3-second countdown
  const [isStarted, setIsStarted] = useState(false);
  const videoRef = useRef<Video>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Breathing animation
  const breathingScale = useSharedValue(1);

  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathingScale.value }],
  }));

  const startBreathingAnimation = () => {
    // Inhale: expand over 4 seconds
    breathingScale.value = withTiming(1.2, {
      duration: 4000,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const initializeSession = async () => {
    try {
      console.log('Starting session initialization...');

      console.log('Step 1: Activating keep awake...');
      // Keep screen awake
      await activateKeepAwakeAsync();
      console.log('Keep awake activated successfully');

      console.log('Step 2: Configuring audio session...');
      // Configure audio session for playbook
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      console.log('Audio mode configured successfully');

      console.log('Step 3: Loading audio...');
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/audio/music.mp3'),
        {
          shouldPlay: false,
          isLooping: true,
          volume: 0,
        }
      );
      soundRef.current = sound; // Store reference for cleanup
      console.log('Audio loaded successfully');

      console.log('Session initialization completed');
      return sound;
    } catch (error) {
      console.error('Failed to initialize session:', error);
      throw error;
    }
  };

  const initializeMedia = async () => {
    try {
      console.log('Starting media initialization...');

      // Initialize session (audio + keep awake)
      const sound = await initializeSession();

      console.log('Step 4: Starting video...');
      // Start video
      if (videoRef.current) {
        await videoRef.current.loadAsync(require('@/assets/videos/candle.mp4'));
        console.log('Video loaded successfully');
      }

      // Start audio with fade-in
      console.log('Step 5: Starting audio fade-in...');
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
      console.log('Audio fade-in completed');

      console.log('Media initialization completed successfully');

    } catch (error) {
      console.error('Failed to initialize media:', error);
      // Still proceed to session even if media fails
    }
  };

  useEffect(() => {
    const startCountdown = async () => {
      setIsStarted(true);
      startBreathingAnimation();

      // Initialize media in background
      initializeMedia();

      const timer = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Navigate to session after countdown
            setTimeout(() => {
              // Clean up countdown audio silently in background (non-blocking)
              if (soundRef.current) {
                setTimeout(() => {
                  if (soundRef.current) {
                    soundRef.current.stopAsync().catch(() => {});
                    soundRef.current.unloadAsync().catch(() => {});
                    soundRef.current = null;
                  }
                }, 0);
              }
              
              // Immediate seamless navigation
              router.push({
                pathname: '/session',
                params: { duration: duration.toString() }
              });
            }, 100);
            return 0;
          }

          // Trigger haptic feedback on each count
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    };

    startCountdown();

    // Cleanup on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync().catch(() => {});
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [duration, router]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Video */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isStarted}
          isLooping={true}
          isMuted={true}
        />

        {/* Dark overlay for better text visibility */}
        <View style={styles.overlay} />
      </View>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Link href="/" asChild>
          <Text style={styles.backButton}>←</Text>
        </Link>
        <Text style={styles.durationText}>{duration} min</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.titleText}>Get Ready</Text>
        <Text style={styles.subtitleText}>
          Your {duration}-minute session starts in
        </Text>

        {/* Countdown Circle */}
        <Animated.View style={[styles.countdownCircle, breathingStyle]}>
          <Text style={styles.countdownNumber}>
            {secondsLeft}
          </Text>
        </Animated.View>

        <Text style={styles.instructionText}>
          Take a deep breath and prepare to relax
        </Text>

        <Text style={styles.breathingGuide}>
          4s inhale • 7s hold • 8s exhale
        </Text>
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    fontSize: 24,
    color: '#E6E6E6',
    fontWeight: '300',
    width: 30,
  },
  durationText: {
    fontSize: 16,
    color: '#A8ADB5',
    fontWeight: '500',
  },
  placeholder: {
    width: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 10,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#E6E6E6',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#A8ADB5',
    textAlign: 'center',
    marginBottom: 60,
  },
  countdownCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FFD58A',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    backgroundColor: 'rgba(255, 213, 138, 0.1)',
  },
  countdownNumber: {
    fontSize: 72,
    fontWeight: '200',
    color: '#FFD58A',
  },
  instructionText: {
    fontSize: 18,
    color: '#E6E6E6',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  breathingGuide: {
    fontSize: 14,
    color: '#A8ADB5',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CountdownScreen;
