/**
 * TypeScript types for Be Bored app
 */

export type SessionDuration = 5 | 10 | 15;

export type BreathingPhase = 'inhale' | 'hold' | 'exhale';

export interface SessionState {
  duration: SessionDuration;
  remainingTime: number;
  isPlaying: boolean;
  currentPhase: BreathingPhase;
  phaseCountdown: number;
  cycleCount: number;
}

export interface BreathingConfig {
  inhale: number;    // 4 seconds
  hold: number;      // 7 seconds
  exhale: number;    // 8 seconds
}

export interface MediaState {
  videoLoaded: boolean;
  audioLoaded: boolean;
  videoStatus: any;
  audioStatus: any;
}

export type CountdownState = 3 | 2 | 1 | 'begin' | 'complete';

export interface QuoteScreenState {
  currentQuote: string;
  showContinueHint: boolean;
}
