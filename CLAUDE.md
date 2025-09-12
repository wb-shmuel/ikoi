# Be Bored App Specification

## 🎯 Concept
- A simple relaxation app designed for **“open quickly, calm quickly.”**
- Unlike meditation apps that expect long sessions, this app focuses on short durations: **5 / 10 / 15 minutes**.
- Core experience:
  - Candlelight video background
  - Healing background music
  - Breathing guidance (4-7-8 method) via text and animation

---

## 🛠️ Tech Stack
- **Expo + React Native (TypeScript)**
- Runs smoothly with **Expo Go**
- Core libraries:
  - `expo-av` : audio/video playback
  - `expo-keep-awake` : prevent device sleep during sessions
  - `expo-haptics` : haptic feedback for breathing cues

---

## 🖼️ UI / Style
- **Dark, calming theme**
  - Background: nearly black with a subtle blue tone (#0F1115)
  - Text: soft whites and grays (#E6E6E6, #A8ADB5)
  - Accent color: warm amber (#FFD58A)
- **Video**:
  - Background candle video (`candle.mp4`)
  - Even if only ~5 min long, loop playback for 10/15 min sessions
  - Fade-in from black at start, fade-out to black at end
- **Music**:
  - Healing background track (`music.mp3`)
  - Fade-in: 0 → 0.55 volume over 1.5s
  - Fade-out: 0.55 → 0 volume over 1.2s
  - Looped playback for longer sessions
- **Breathing Guide**:
  - **4-7-8 breathing method**
    - Inhale: 4 seconds
    - Hold: 7 seconds
    - Exhale: 8 seconds
  - Animated breathing circle (expand → hold → shrink)
  - Gentle haptics for tactile rhythm
  - Phase text guidance (`Take a deep breath / Stop breathing / Exhale`)

---

## 📱 Screen Flow
### 1. Duration Picker
- Title: **Be Bored**
- Subtitle: “Choose a short session to calm yourself now”
- Buttons: 5 min / 10 min / 15 min
- Footer text: explanation of 4-7-8 breathing

### 2. Session Screen
- Background: looping candle video
- Overlay: semi-transparent dark layer for calm mood
- Top bar:
  - ← Back button
  - Remaining time (mm:ss)
  - Pause / Resume button
- Center:
  - Breathing circle with amber glow
  - Phase label + countdown seconds
  - Sub-guide: `4s inhale • 7s hold • 8s exhale`
- Bottom:
  - End/Finish button
  - At 0 remaining, changes to “Finish” and highlights in amber

---

## 🔔 User Experience Highlights
- One-tap flow: start a session instantly after choosing duration
- Smooth audio/video fade-in/out enhances immersion
- Prevents screen sleep for uninterrupted focus
- Haptics reinforce breathing phases physically
- Spacious layout for calm, uncluttered experience

---

## 🚀 Future Extensions
- Immersive mode (hide HUD/UI)
- Alternative ambient sounds (rain, fireplace, wind chimes, etc.)
- Additional breathing presets (e.g., box breathing)
- Multi-language support (EN/JA toggle)

---
