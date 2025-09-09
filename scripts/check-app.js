#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Quick Calm App Structure Check');
console.log('==================================');

// Check required files
const requiredFiles = [
  'app/_layout.tsx',
  'app/index.tsx', 
  'app/session.tsx',
  'constants/QuickCalmColors.ts',
  'types/QuickCalm.ts',
  'assets/candle.mp4',
  'assets/music.mp3'
];

let allGood = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allGood = false;
});

console.log('\n📱 Dependencies Check');
console.log('====================');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
  'expo-av',
  'expo-keep-awake', 
  'expo-haptics',
  'react-native-reanimated'
];

requiredDeps.forEach(dep => {
  const exists = packageJson.dependencies[dep];
  console.log(`${exists ? '✅' : '❌'} ${dep} ${exists || ''}`);
  if (!exists) allGood = false;
});

console.log(`\n${allGood ? '🎉 All checks passed!' : '❌ Some issues found'}`);
console.log('\n💡 To test the app:');
console.log('   1. npm start');
console.log('   2. Scan QR code with Expo Go');
console.log('   3. Test duration selection → session flow');

process.exit(allGood ? 0 : 1);