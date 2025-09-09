# Essential Development Commands

## Core Development
```bash
# Start development server
npm start          # or yarn start
expo start

# Platform-specific builds
npm run android    # Start Android emulator
npm run ios        # Start iOS simulator  
npm run web        # Start web version

# Code Quality
npm run lint       # Run ESLint
expo lint          # Expo's linting

# Project Management
npm run reset-project  # Reset to clean state
```

## Testing & Debugging
```bash
# Install dependencies
npm install

# Clear cache if needed
expo start -c      # Clear cache and start
npx expo install --fix  # Fix dependency issues
```

## System Commands (macOS/Darwin)
```bash
# File operations
ls -la            # List files with details
find . -name "*.tsx" -o -name "*.ts"  # Find TypeScript files
grep -r "pattern" src/  # Search in source files

# Git workflow
git status
git add .
git commit -m "message"
git push

# Process management
lsof -ti:8081     # Check what's using Metro port
kill -9 $(lsof -ti:8081)  # Kill Metro if stuck
```

## Development Workflow
1. `npm start` - Start Expo dev server
2. Scan QR code with Expo Go app or use simulator
3. `npm run lint` - Check code quality before commits
4. Test on both iOS and Android devices/simulators