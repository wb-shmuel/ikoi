import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

export interface OrientationInfo {
  orientation: Orientation;
  isLandscape: boolean;
  isPortrait: boolean;
  width: number;
  height: number;
}

/**
 * Custom hook to detect device orientation
 * Returns orientation info and subscribes to orientation changes
 */
export function useOrientation(): OrientationInfo {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const orientation: Orientation = dimensions.width > dimensions.height ? 'landscape' : 'portrait';
  
  return {
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    width: dimensions.width,
    height: dimensions.height,
  };
}