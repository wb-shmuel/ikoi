# Ikoi - Quick Calm App Project

## Purpose
A simple relaxation app designed for "open quickly, calm quickly" using React Native with Expo. The app focuses on short meditation sessions (5/10/15 minutes) featuring:
- Candlelight video background with healing music  
- 4-7-8 breathing guidance with animation and haptics
- Dark, calming UI theme

## Tech Stack
- **Framework**: Expo ~53.0.22 + React Native 0.79.6
- **Language**: TypeScript with strict mode
- **Navigation**: Expo Router with file-based routing
- **UI**: React Native with custom themed components
- **Key Libraries**:
  - `expo-av`: Audio/video playback
  - `expo-keep-awake`: Prevent device sleep during sessions
  - `expo-haptics`: Haptic feedback for breathing cues
  - `react-native-reanimated`: Smooth animations

## Project Structure
```
├── app/                 # Expo Router pages
│   ├── (tabs)/         # Tab-based navigation (existing)
│   └── _layout.tsx     # Root layout with theme provider
├── components/         # Reusable UI components
├── constants/          # Colors and theme constants
├── hooks/             # Custom React hooks
├── assets/           # Static assets (images, videos, audio)
│   ├── candle.mp4   # Background video
│   └── music.mp3    # Background audio
└── scripts/          # Build/dev scripts
```

## Key Assets
- `assets/candle.mp4`: High-quality candle video for background
- `assets/music.mp3`: Healing background music track
- Custom theme using dark calming colors