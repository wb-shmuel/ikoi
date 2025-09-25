import { Language } from './Languages';

// Simple calming one-liners for relaxation
export const quotes: Record<Language, string[]> = {
  en: [
    "Well done.",
    "You did great.",
    "Take it easy.",
    "You're enough.",
    "Rest well.",
    "Stay calm.",
    "Just be.",
    "You're okay.",
  ],
  ja: [
    "お疲れ様でした。",
    "一休み。",
    "肩の力を抜いてください。",
    "ゆっくり休んでください。",
    "そのままでいいんです。",
    "だいじょうぶ。",
    "ほっと一息。",
    "今この瞬間を大事にしましょう。",
    "あなたはあなたでいいんです。",
  ]
};

// Legacy export for backward compatibility
export const Quote = quotes.en;
