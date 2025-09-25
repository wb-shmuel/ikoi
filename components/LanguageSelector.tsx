import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/constants/Languages';
import { QuickCalmColors } from '@/constants/QuickCalmColors';
import { ResponsiveScale } from '@/constants/ResponsiveScale';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  ];

  const handleLanguageSelect = async (selectedLanguage: Language) => {
    await setLanguage(selectedLanguage);
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Language Toggle Button */}
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="language" size={24} color={QuickCalmColors.secondaryText} />
      </TouchableOpacity>

      {/* Language Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choose Language / 言語選択</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color={QuickCalmColors.primaryText} />
                </TouchableOpacity>
              </View>

              <View style={styles.languageList}>
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.languageOption,
                      language === lang.code && styles.selectedLanguageOption,
                    ]}
                    onPress={() => handleLanguageSelect(lang.code)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.languageInfo}>
                      <Text style={[
                        styles.languageName,
                        language === lang.code && styles.selectedLanguageText
                      ]}>
                        {lang.nativeName}
                      </Text>
                      <Text style={[
                        styles.languageSubtext,
                        language === lang.code && styles.selectedLanguageSubtext
                      ]}>
                        {lang.name}
                      </Text>
                    </View>
                    {language === lang.code && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={QuickCalmColors.accent}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  languageButton: {
    padding: ResponsiveScale.spacing(8),
    borderRadius: ResponsiveScale.scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ResponsiveScale.spacing(20),
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  modalContent: {
    backgroundColor: QuickCalmColors.background,
    borderRadius: ResponsiveScale.scale(16),
    padding: ResponsiveScale.spacing(20),
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 138, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ResponsiveScale.spacing(20),
  },
  modalTitle: {
    fontSize: ResponsiveScale.fontSize(16),
    fontWeight: '600',
    color: QuickCalmColors.primaryText,
    flex: 1,
    marginRight: ResponsiveScale.spacing(12),
    lineHeight: ResponsiveScale.fontSize(20),
  },
  closeButton: {
    padding: ResponsiveScale.spacing(4),
  },
  languageList: {
    gap: ResponsiveScale.spacing(12),
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ResponsiveScale.spacing(16),
    borderRadius: ResponsiveScale.scale(8),
    borderWidth: 1,
    borderColor: 'rgba(168, 173, 181, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedLanguageOption: {
    borderColor: QuickCalmColors.accent,
    backgroundColor: 'rgba(255, 213, 138, 0.15)',
  },
  languageInfo: {
    flex: 1,
    marginRight: ResponsiveScale.spacing(12),
  },
  languageName: {
    fontSize: ResponsiveScale.fontSize(16),
    fontWeight: '500',
    color: QuickCalmColors.primaryText,
    marginBottom: ResponsiveScale.spacing(2),
    lineHeight: ResponsiveScale.fontSize(20),
  },
  selectedLanguageText: {
    color: QuickCalmColors.accent,
  },
  languageSubtext: {
    fontSize: ResponsiveScale.fontSize(13),
    color: QuickCalmColors.secondaryText,
    opacity: 0.8,
    lineHeight: ResponsiveScale.fontSize(16),
  },
  selectedLanguageSubtext: {
    color: QuickCalmColors.accent,
    opacity: 0.9,
  },
});