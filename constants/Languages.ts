export type Language = 'en' | 'ja';

export interface Translations {
  // Common
  minutes: string;
  session_button_1: string;
  session_button_2: string;
  end: string;
  pause: string;
  resume: string;

  // Home Screen
  breathingInstruction: string;

  // Session Screen
  getReady: string;
  sessionStartsIn: string;
  prepareToRelax: string;
  begin: string;

  // Breathing Phases
  takeDeepBreath: string;
  stopBreathing: string;
  exhale: string;

  // Quote Screen
  tapToContinue: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Common
    minutes: 'minutes',
    session_button_2: 'Session',
    session_button_1: 'Start',
    end: 'End',
    pause: 'Pause',
    resume: 'Resume',

    // Home Screen
    breathingInstruction: '4s inhale • 7s hold • 8s exhale',

    // Session Screen
    getReady: 'Get Ready',
    sessionStartsIn: 'Your {duration}-minute session starts in',
    prepareToRelax: 'Take a deep breath and prepare to relax',
    begin: 'Begin',

    // Breathing Phases
    takeDeepBreath: 'Take a deep breath',
    stopBreathing: 'Stop breathing',
    exhale: 'Exhale',

    // Quote Screen
    tapToContinue: 'Tap to continue',
  },
  ja: {
    // Common
    minutes: '分',
    session_button_2: '開始',
    session_button_1: 'セッション',
    end: 'End',
    pause: 'Pause',
    resume: 'Resume',

    // Home Screen
    breathingInstruction: '4秒で吸って • 7秒止めて • 8秒で吐く',

    // Session Screen
    getReady: '準備してください',
    sessionStartsIn: '{duration}分のセッションを開始します',
    prepareToRelax: '深呼吸をして、リラックスの準備をしましょう',
    begin: '開始',

    // Breathing Phases
    takeDeepBreath: '深く息を吸ってください',
    stopBreathing: '息を止めてください',
    exhale: '息を吐いてください',

    // Quote Screen
    tapToContinue: 'タップして続ける',
  },
};

// Helper function to replace placeholders in translation strings
export const formatTranslation = (text: string, params: Record<string, string | number>): string => {
  return Object.keys(params).reduce((result, key) => {
    return result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(params[key]));
  }, text);
};
