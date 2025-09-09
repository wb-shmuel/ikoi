# Coding Standards & Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled (`"strict": true`)
- **Path Mapping**: `@/*` maps to project root
- **File Extensions**: `.ts`, `.tsx` for all TypeScript files

## Code Style
- **ESLint**: Uses `eslint-config-expo` with flat config
- **Naming Conventions**:
  - Components: PascalCase (`DurationPicker.tsx`)
  - Files: PascalCase for components, camelCase for utilities
  - Variables/Functions: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Interfaces: PascalCase with 'I' prefix optional

## Project Structure Patterns
- **Components**: Reusable UI in `/components`
- **Screens**: App screens in `/app` (Expo Router)
- **Hooks**: Custom hooks in `/hooks`
- **Constants**: Shared constants in `/constants`
- **Types**: TypeScript interfaces co-located or in dedicated files

## React Native Best Practices
- **Expo Router**: File-based routing with proper navigation
- **Themed Components**: Use `useColorScheme` and `Colors` constants
- **Safe Areas**: Handle device safe areas properly
- **Performance**: Use `react-native-reanimated` for smooth animations
- **Platform-specific**: Use `.ios.tsx` and `.android.tsx` when needed

## Import Organization
```typescript
// 1. React and React Native
import React from 'react';
import { View, Text } from 'react-native';

// 2. Third-party libraries
import { Video } from 'expo-av';

// 3. Local imports with path mapping
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
```