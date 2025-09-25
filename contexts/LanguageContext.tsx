import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { NativeModules, Platform } from 'react-native';
import { Language, translations, Translations, formatTranslation } from '@/constants/Languages';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: Translations;
  formatT: (key: keyof Translations, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const LANGUAGE_STORAGE_KEY = '@BeBoredApp:language';

// Get device language using simple detection
const getDeviceLanguage = (): Language => {
  try {
    // Try to get device locale using NativeModules
    let deviceLanguage = 'en';

    if (Platform.OS === 'ios') {
      deviceLanguage = NativeModules.SettingsManager?.settings?.AppleLocale ||
                      NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] || 'en';
    } else if (Platform.OS === 'android') {
      deviceLanguage = NativeModules.I18nManager?.localeIdentifier || 'en';
    }

    // Extract language code (first 2 characters)
    const languageCode = deviceLanguage.toLowerCase().substring(0, 2);

    // Return 'ja' for Japanese, 'en' for everything else
    return languageCode === 'ja' ? 'ja' : 'en';
  } catch (error) {
    console.log('Error getting device language, defaulting to English:', error);
    return 'en';
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ja')) {
        setCurrentLanguage(savedLanguage as Language);
      } else {
        // No saved language found, use device language
        const deviceLanguage = getDeviceLanguage();
        setCurrentLanguage(deviceLanguage);
        console.log('Using device language:', deviceLanguage);
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
      // Fallback to device language
      const deviceLanguage = getDeviceLanguage();
      setCurrentLanguage(deviceLanguage);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setCurrentLanguage(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = translations[language];

  const formatT = (key: keyof Translations, params?: Record<string, string | number>): string => {
    const text = t[key];
    if (params) {
      return formatTranslation(text, params);
    }
    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatT,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};