# Task Completion Checklist

## Before Committing Code
- [ ] **Lint Check**: Run `npm run lint` and fix all issues
- [ ] **TypeScript**: Ensure no TypeScript errors (`tsc --noEmit`)
- [ ] **Build Test**: Verify app builds without errors
- [ ] **Device Testing**: Test on both iOS and Android (simulators or devices)
- [ ] **Safe Areas**: Verify UI works on devices with notches/dynamic islands

## Code Quality Requirements
- [ ] **Type Safety**: All functions/components properly typed
- [ ] **Error Handling**: Proper error boundaries and try/catch blocks
- [ ] **Performance**: No obvious performance issues or memory leaks
- [ ] **Accessibility**: Basic accessibility support (screen reader friendly)
- [ ] **Code Organization**: Files properly organized by feature/function

## Quick Calm App Specific
- [ ] **Media Playback**: Video and audio work correctly
- [ ] **Animations**: Breathing circle animations smooth and accurate
- [ ] **Haptics**: Haptic feedback working on devices
- [ ] **Screen Wake**: `expo-keep-awake` prevents device sleep during sessions
- [ ] **Background Handling**: App properly pauses/resumes when backgrounded
- [ ] **Timer Accuracy**: Countdown and breathing timing accurate

## Final Testing
- [ ] **Complete User Flow**: Duration selection → Session → Completion
- [ ] **Edge Cases**: App backgrounding, phone calls, low battery
- [ ] **Multiple Sessions**: Test consecutive sessions work properly
- [ ] **Clean Exit**: Proper cleanup when leaving session early