import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    // 画面離脱で解除したい場合は cleanup を使う（通常は不要）
    return () => {
      // ScreenOrientation.unlockAsync(); // 任意
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="session" />
        <Stack.Screen name="quote" />
      </Stack>
      <StatusBar style="light" backgroundColor="#0F1115" />
    </>
  );
}
